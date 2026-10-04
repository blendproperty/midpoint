import { afterEach, expect, it, vi } from "vitest";
import { pushLeadToListings } from "@/lib/listings-leads";

afterEach(() => { vi.restoreAllMocks(); vi.useRealTimers(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
it("bounds a stalled best-effort Listings push and preserves failure handling", async () => {
  vi.useFakeTimers();
  vi.stubEnv("LISTINGS_LEADS_URL", "https://listings.example.test/api/leads");
  vi.stubEnv("LISTINGS_LEADS_API_KEY", "synthetic-local-key");
  vi.spyOn(console, "error").mockImplementation(() => undefined);
  vi.spyOn(AbortSignal, "timeout").mockImplementation(ms => {
    expect(ms).toBe(8000);
    const controller = new AbortController();
    setTimeout(() => controller.abort(), ms);
    return controller.signal;
  });
  vi.stubGlobal("fetch", vi.fn((_url, options) => new Promise((_resolve, reject) => options.signal.addEventListener("abort", () => reject(new Error("local timeout"))))));
  const pending = pushLeadToListings({ email: "local@example.test" });
  await vi.advanceTimersByTimeAsync(8001);
  await expect(pending).resolves.toBeUndefined();
});
