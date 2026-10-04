import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// Generates a random 32-byte token, stores only its hash (never the raw
// value) alongside a 1-hour expiry, and returns the raw token so the caller
// can put it in the emailed link.
export async function createPasswordResetToken(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);

  await prisma.passwordResetToken.create({
    data: { userId, tokenHash, expiresAt },
  });

  return token;
}

// The claim and password update commit together; a failed update leaves the
// link unused so the same request can be retried safely.
export async function resetPasswordWithToken(token: string, passwordHash: string): Promise<string | null> {
  const tokenHash = hashToken(token);
  return prisma.$transaction(async (tx) => {
    const record = await tx.passwordResetToken.findUnique({ where: { tokenHash } });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      return null;
    }

    const claimed = await tx.passwordResetToken.updateMany({
      where: { id: record.id, usedAt: null, expiresAt: { gt: new Date() } },
      data: { usedAt: new Date() },
    });

    if (claimed.count !== 1) return null;
    await tx.user.update({ where: { id: record.userId }, data: { passwordHash } });
    return record.userId;
  }, { maxWait: 5_000 });
}
