import { beforeEach, describe, expect, it, vi } from "vitest";
const records = vi.hoisted(() => ({ findUnique: vi.fn(), updateMany: vi.fn(), updateUser: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ prisma: { $transaction: async (run: (tx: unknown) => unknown) => run({ passwordResetToken: records, user: { update: records.updateUser } }) } }));
import { resetPasswordWithToken } from "@/lib/password-reset";
beforeEach(() => { vi.clearAllMocks(); records.updateUser.mockResolvedValue({ id: "local-user" }); });
describe("single-use password reset claim", () => {
  it("allows only one concurrent claimant after both read an unused token", async () => {
    records.findUnique.mockResolvedValue({ id: "local-reset", userId: "local-user", usedAt: null, expiresAt: new Date(Date.now() + 60000) });
    let claimed = false;
    records.updateMany.mockImplementation(async args => {
      expect(args.where).toMatchObject({ id: "local-reset", usedAt: null, expiresAt: { gt: expect.any(Date) } });
      if (claimed) return { count: 0 };
      claimed = true; return { count: 1 };
    });
    const result = await Promise.all([resetPasswordWithToken("local-raw-token", "new-hash"), resetPasswordWithToken("local-raw-token", "new-hash")]);
    expect(result.sort()).toEqual(["local-user", null].sort());
    expect(records.updateUser).toHaveBeenCalledTimes(1);
    expect(records.updateUser).toHaveBeenCalledWith({ where: { id: "local-user" }, data: { passwordHash: "new-hash" } });
  });
  it.each([{ usedAt: new Date(), expiresAt: new Date(Date.now()+60000) }, { usedAt: null, expiresAt: new Date(0) }])("rejects used or expired tokens without a claim", async record => {
    records.findUnique.mockResolvedValue({ id: "local-reset", userId: "local-user", ...record });
    expect(await resetPasswordWithToken("local-raw-token", "new-hash")).toBeNull();
    expect(records.updateMany).not.toHaveBeenCalled();
  });
});
