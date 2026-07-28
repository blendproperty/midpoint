import { describe, it, expect, vi, afterEach } from "vitest";
import { verifyRecaptcha } from "@/lib/recaptcha";

describe("verifyRecaptcha", () => {
  const originalSecret = process.env.RECAPTCHA_SECRET_KEY;
  const originalFetch = global.fetch;

  afterEach(() => {
    if (originalSecret === undefined) delete process.env.RECAPTCHA_SECRET_KEY;
    else process.env.RECAPTCHA_SECRET_KEY = originalSecret;
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("fails open (returns true) when RECAPTCHA_SECRET_KEY is not configured", async () => {
    delete process.env.RECAPTCHA_SECRET_KEY;
    expect(await verifyRecaptcha("some-token")).toBe(true);
  });

  it("rejects a missing token once a secret is configured", async () => {
    process.env.RECAPTCHA_SECRET_KEY = "test-secret";
    expect(await verifyRecaptcha(null)).toBe(false);
    expect(await verifyRecaptcha("")).toBe(false);
  });

  it("returns true when Google reports success", async () => {
    process.env.RECAPTCHA_SECRET_KEY = "test-secret";
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ success: true }),
    }) as unknown as typeof fetch;

    expect(await verifyRecaptcha("valid-token")).toBe(true);
  });

  it("returns false when Google reports failure", async () => {
    process.env.RECAPTCHA_SECRET_KEY = "test-secret";
    global.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ success: false }),
    }) as unknown as typeof fetch;

    expect(await verifyRecaptcha("bad-token")).toBe(false);
  });

  it("fails open when the request to Google itself throws", async () => {
    process.env.RECAPTCHA_SECRET_KEY = "test-secret";
    global.fetch = vi.fn().mockRejectedValue(new Error("network down")) as unknown as typeof fetch;

    expect(await verifyRecaptcha("some-token")).toBe(true);
  });
});
