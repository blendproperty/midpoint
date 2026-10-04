import { beforeEach, afterEach, expect, it, vi } from "vitest";
const state = vi.hoisted(() => ({ token: "", user: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: () => state.token ? { value: state.token } : undefined }) }));
vi.mock("@/lib/prisma", () => ({ prisma: { user: { findUnique: state.user } } }));
beforeEach(() => { vi.resetModules(); state.token = ""; state.user.mockReset(); vi.stubEnv("AUTH_SECRET", "local-session-test-".repeat(3)); });
afterEach(() => { vi.unstubAllEnvs(); });
it("rejects a deleted account despite a correctly signed unexpired session", async () => {
  const { createSessionToken, getSession } = await import("@/lib/auth");
  state.token = await createSessionToken({ sub: "local-user", email: "local@example.test", role: "SUPER_ADMIN" });
  state.user.mockResolvedValue(null);
  expect(await getSession()).toBeNull();
});
it("uses the current role rather than stale session privileges", async () => {
  const { createSessionToken, getSession } = await import("@/lib/auth");
  state.token = await createSessionToken({ sub: "local-user", email: "local@example.test", role: "SUPER_ADMIN" });
  state.user.mockResolvedValue({ id: "local-user", email: "local@example.test", role: "EDITOR" });
  expect(await getSession()).toEqual({ sub: "local-user", email: "local@example.test", role: "EDITOR" });
  const { requireSuperAdmin } = await import("@/lib/require-admin");
  await expect(requireSuperAdmin()).rejects.toThrow(/super admin only/);
});
it("avoids database reads for absent or invalid sessions", async () => {
  const { getSession } = await import("@/lib/auth");
  expect(await getSession()).toBeNull();
  state.token = "invalid-local-token";
  expect(await getSession()).toBeNull();
  expect(state.user).not.toHaveBeenCalled();
});
