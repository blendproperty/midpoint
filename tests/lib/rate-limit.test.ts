import { describe, it, expect } from "vitest";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// This exact logic guards /api/enquiry and /api/track/pageview in
// production — worth pinning down precisely since a subtle off-by-one here
// either lets spam through or blocks real visitors.
describe("checkRateLimit", () => {
  it("allows requests up to the limit, then blocks the next one", () => {
    const key = `test-${Math.random()}`;
    expect(checkRateLimit(key, 3, 60_000)).toBe(true);
    expect(checkRateLimit(key, 3, 60_000)).toBe(true);
    expect(checkRateLimit(key, 3, 60_000)).toBe(true);
    expect(checkRateLimit(key, 3, 60_000)).toBe(false);
  });

  it("tracks separate keys (e.g. separate IPs) independently", () => {
    const keyA = `test-a-${Math.random()}`;
    const keyB = `test-b-${Math.random()}`;
    expect(checkRateLimit(keyA, 1, 60_000)).toBe(true);
    expect(checkRateLimit(keyA, 1, 60_000)).toBe(false);
    expect(checkRateLimit(keyB, 1, 60_000)).toBe(true);
  });

  it("resets once the time window elapses", async () => {
    const key = `test-window-${Math.random()}`;
    expect(checkRateLimit(key, 1, 50)).toBe(true);
    expect(checkRateLimit(key, 1, 50)).toBe(false);
    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(checkRateLimit(key, 1, 50)).toBe(true);
  });
});

describe("getClientIp", () => {
  it("prefers cf-connecting-ip, which Cloudflare sets and a client can't spoof", () => {
    const request = new Request("http://localhost", {
      headers: { "cf-connecting-ip": "9.9.9.9", "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });
    expect(getClientIp(request)).toBe("9.9.9.9");
  });

  it("without cf-connecting-ip, trusts the last x-forwarded-for hop (the one Traefik appended), not the client-supplied first one", () => {
    const request = new Request("http://localhost", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });
    expect(getClientIp(request)).toBe("5.6.7.8");
  });

  it("falls back to 'unknown' when no IP header is present", () => {
    const request = new Request("http://localhost");
    expect(getClientIp(request)).toBe("unknown");
  });
});
