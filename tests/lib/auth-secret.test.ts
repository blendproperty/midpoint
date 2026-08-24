import { afterEach, describe, expect, it, vi } from "vitest";

// getAuthSecretBytes() caches its result in module scope, so each test
// needs a fresh module instance to see a different AUTH_SECRET/NODE_ENV.
async function freshModule() {
  vi.resetModules();
  return import("@/lib/auth-secret");
}

describe("getAuthSecretBytes", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses AUTH_SECRET when it's set and long enough", async () => {
    vi.stubEnv("AUTH_SECRET", "a".repeat(32));
    vi.stubEnv("NODE_ENV", "production");
    const { getAuthSecretBytes } = await freshModule();
    expect(new TextDecoder().decode(getAuthSecretBytes())).toBe("a".repeat(32));
  });

  it("throws in production when AUTH_SECRET is missing — must not be caught at module import time, or it would break `next build` (AUTH_SECRET is only injected at container runtime, not Docker build time)", async () => {
    vi.stubEnv("AUTH_SECRET", "");
    vi.stubEnv("NODE_ENV", "production");
    const { getAuthSecretBytes } = await freshModule();
    expect(getAuthSecretBytes).toThrow(/AUTH_SECRET must be set/);
  });

  it("falls back to the obvious dev secret outside production", async () => {
    vi.stubEnv("AUTH_SECRET", "");
    vi.stubEnv("NODE_ENV", "test");
    const { getAuthSecretBytes } = await freshModule();
    expect(new TextDecoder().decode(getAuthSecretBytes())).toBe("dev-insecure-secret-change-me");
  });
});
