import { randomUUID } from "node:crypto";
import { expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { consumePasswordResetToken, hashToken } from "@/lib/password-reset";

const integration = process.env.BOOKING_INTEGRATION === "1";
if (integration && !process.env.DATABASE_URL?.includes("localhost:55439/midpoint_booking_test")) throw new Error("Disposable test database required");

(integration ? it : it.skip)("allows exactly one PostgreSQL claimant for a reset token under concurrency", async () => {
  const id = "reset-local-" + randomUUID(), raw = "local-token-" + randomUUID();
  try {
    await prisma.user.create({ data: { id, email: id + "@example.test", passwordHash: "synthetic-not-for-sign-in", role: "EDITOR" } });
    await prisma.passwordResetToken.create({ data: { userId: id, tokenHash: hashToken(raw), expiresAt: new Date(Date.now()+60000) } });
    const result = await Promise.all([consumePasswordResetToken(raw), consumePasswordResetToken(raw), consumePasswordResetToken(raw)]);
    expect(result.filter(value => value === id)).toHaveLength(1);
    expect(result.filter(value => value === null)).toHaveLength(2);
    expect(await consumePasswordResetToken(raw)).toBeNull();
  } finally {
    await prisma.passwordResetToken.deleteMany({ where: { userId: id } });
    await prisma.user.deleteMany({ where: { id } });
  }
}, 20000);
