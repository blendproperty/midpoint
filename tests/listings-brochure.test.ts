import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ fetch: vi.fn() }));
vi.mock("@/lib/listings-sync", () => ({ fetchAllListings: mocks.fetch }));
import { getListingBrochureImages } from "@/lib/listings-brochure";
beforeEach(() => { vi.resetAllMocks(); vi.stubEnv("LISTINGS_API_KEY", "test-only"); });
describe("exact listing photography", () => {
  it("matches only external ID, orders hero/positions and removes duplicate URLs", async () => {
    mocks.fetch.mockResolvedValue([
      { id: "different", name: "Same title", images: [{ url: "wrong.jpg" }] },
      { id: "correct", images: [{ url: "interior.jpg", position: 2 }, { url: "hero.jpg", position: 1, isHero: true }, { url: "interior.jpg", position: 3 }] },
    ]);
    expect(await getListingBrochureImages("correct")).toEqual(["hero.jpg", "interior.jpg"]);
  });
  it("returns no gallery for removed source IDs", async () => {
    mocks.fetch.mockResolvedValue([{ id: "different", images: [{ url: "wrong.jpg" }] }]);
    expect(await getListingBrochureImages("removed")).toBeNull();
  });
  it("refuses to silently drop photography when credentials are missing", async () => {
    vi.stubEnv("LISTINGS_API_KEY", "");
    await expect(getListingBrochureImages("correct")).rejects.toThrow("not configured");
    expect(mocks.fetch).not.toHaveBeenCalled();
  });
});
