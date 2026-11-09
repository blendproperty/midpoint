import { afterEach, describe, expect, it, vi } from "vitest";
import { pushLeadToListings } from "@/lib/listings-leads";

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
describe("listing lead company", () => {
  it("preserves company in the existing message contract", async () => {
    vi.stubEnv("LISTINGS_LEADS_URL", "https://listings.example.test/api/leads");
    vi.stubEnv("LISTINGS_LEADS_API_KEY", "test-key");
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    await pushLeadToListings({ email: "test@example.test", company: "Acme Logistics", message: "Looking for offices" });
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).message).toBe("Company: Acme Logistics\n\nLooking for offices");
  });
});
