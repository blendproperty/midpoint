import { afterEach, expect, it, vi } from "vitest";
import { SignJWT } from "jose";

afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });
it("refuses development-secret protected-page tokens when production configuration is missing", async () => {
  vi.stubEnv("NODE_ENV", "production"); vi.stubEnv("AUTH_SECRET", ""); vi.resetModules();
  const { createPageAccessToken, verifyPageAccessToken } = await import("@/lib/page-access");
  const forged = await new SignJWT({ pageId: "local-protected-page" }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("1h").sign(new TextEncoder().encode("dev-insecure-secret-change-me"));
  expect(await verifyPageAccessToken(forged, "local-protected-page")).toBe(false);
  await expect(createPageAccessToken("local-protected-page")).rejects.toThrow(/AUTH_SECRET must be set/);
});
it("retains configured tokens, page scoping and tamper rejection", async () => {
  vi.stubEnv("NODE_ENV", "production"); vi.stubEnv("AUTH_SECRET", "local-only-".repeat(5)); vi.resetModules();
  const { createPageAccessToken, verifyPageAccessToken } = await import("@/lib/page-access");
  const token = await createPageAccessToken("local-page-a");
  expect(await verifyPageAccessToken(token, "local-page-a")).toBe(true);
  expect(await verifyPageAccessToken(token, "local-page-b")).toBe(false);
  expect(await verifyPageAccessToken(token + "tampered", "local-page-a")).toBe(false);
});
