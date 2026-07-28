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

// Validates a raw token against its stored hash, checks it hasn't expired or
// already been used, marks it used, and returns the associated userId (or
// null if invalid). Single-use: calling this twice with the same token only
// succeeds once.
export async function consumePasswordResetToken(token: string): Promise<string | null> {
  const tokenHash = hashToken(token);
  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });

  if (!record || record.usedAt || record.expiresAt < new Date()) {
    return null;
  }

  await prisma.passwordResetToken.update({
    where: { id: record.id },
    data: { usedAt: new Date() },
  });

  return record.userId;
}
