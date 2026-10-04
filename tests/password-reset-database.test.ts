import { randomUUID } from "node:crypto";
import { expect, it } from "vitest";
import { prisma } from "@/lib/prisma";
import { resetPasswordWithToken, hashToken } from "@/lib/password-reset";

const integration = process.env.BOOKING_INTEGRATION === "1";
if (integration && !process.env.DATABASE_URL?.includes("localhost:55439/midpoint_booking_test")) throw new Error("Disposable test database required");

(integration ? it : it.skip)("allows exactly one PostgreSQL claimant for a reset token under concurrency", async () => {
  const id = "reset-local-" + randomUUID(), raw = "local-token-" + randomUUID();
  try {
    await prisma.user.create({ data: { id, email: id + "@example.test", passwordHash: "synthetic-not-for-sign-in", role: "EDITOR" } });
    await prisma.passwordResetToken.create({ data: { userId: id, tokenHash: hashToken(raw), expiresAt: new Date(Date.now()+60000) } });
    const result = await Promise.all([resetPasswordWithToken(raw, "synthetic-new-hash"), resetPasswordWithToken(raw, "synthetic-new-hash"), resetPasswordWithToken(raw, "synthetic-new-hash")]);
    expect(result.filter(value => value === id)).toHaveLength(1);
    expect(result.filter(value => value === null)).toHaveLength(2);
    expect(await resetPasswordWithToken(raw, "synthetic-other-hash")).toBeNull();
    expect((await prisma.user.findUniqueOrThrow({ where: { id } })).passwordHash).toBe("synthetic-new-hash");
  } finally {
    await prisma.passwordResetToken.deleteMany({ where: { userId: id } });
    await prisma.user.deleteMany({ where: { id } });
  }
}, 20000);

(integration ? it : it.skip)("rolls back a failed password update and permits retrying the same reset link", async () => {
  const suffix = randomUUID().replaceAll("-", ""), id = "reset-retry-" + suffix, raw = "local-token-" + suffix;
  const trigger = "reset_fail_" + suffix;
  try {
    await prisma.user.create({ data: { id, email: id + "@example.test", passwordHash: "synthetic-old-hash", role: "EDITOR" } });
    await prisma.passwordResetToken.create({ data: { userId: id, tokenHash: hashToken(raw), expiresAt: new Date(Date.now()+60000) } });
    // Test-only trigger in the guarded disposable database forces a real SQL failure.
    await prisma.$executeRawUnsafe(`CREATE FUNCTION "${trigger}"() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'Synthetic update failure'; END $$`);
    await prisma.$executeRawUnsafe(`CREATE TRIGGER "${trigger}" BEFORE UPDATE ON "User" FOR EACH ROW WHEN (NEW.id = '${id}' AND NEW."passwordHash" = 'synthetic-fail') EXECUTE FUNCTION "${trigger}"()`);
    await expect(resetPasswordWithToken(raw, "synthetic-fail")).rejects.toThrow();
    expect((await prisma.passwordResetToken.findUniqueOrThrow({ where: { tokenHash: hashToken(raw) } })).usedAt).toBeNull();
    expect((await prisma.user.findUniqueOrThrow({ where: { id } })).passwordHash).toBe("synthetic-old-hash");
    expect(await resetPasswordWithToken(raw, "synthetic-retry-hash")).toBe(id);
    expect((await prisma.user.findUniqueOrThrow({ where: { id } })).passwordHash).toBe("synthetic-retry-hash");
    expect((await prisma.passwordResetToken.findUniqueOrThrow({ where: { tokenHash: hashToken(raw) } })).usedAt).not.toBeNull();
    expect(await resetPasswordWithToken(raw, "synthetic-next-hash")).toBeNull();
  } finally {
    await prisma.$executeRawUnsafe(`DROP TRIGGER IF EXISTS "${trigger}" ON "User"`);
    await prisma.$executeRawUnsafe(`DROP FUNCTION IF EXISTS "${trigger}"()`);
    await prisma.passwordResetToken.deleteMany({ where: { userId: id } });
    await prisma.user.deleteMany({ where: { id } });
  }
}, 20000);
