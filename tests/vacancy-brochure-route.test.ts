import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ findFirst: vi.fn(), settings: vi.fn(), generate: vi.fn(), limit: vi.fn(), images: vi.fn() }));
vi.mock("@/lib/listings-brochure", () => ({ getListingBrochureImages: mocks.images }));
vi.mock("@/lib/prisma", () => ({ prisma: { vacancy: { findFirst: mocks.findFirst } } }));
vi.mock("@/lib/site-settings", () => ({ getSiteSettings: mocks.settings }));
vi.mock("@/lib/vacancy-brochure", () => ({ createVacancyBrochure: mocks.generate, brochureFilename: () => "midpoint-onpoint-office-g-02.pdf" }));
vi.mock("@/lib/rate-limit", () => ({ checkRateLimit: mocks.limit, getClientIp: () => "test" }));
import { GET } from "@/app/vacancies/[id]/brochure/route";
const row = { id: "unit-g02", building: "OnPoint", unitName: "Office G.02", sector: "SERVICED_OFFICE", sizeSqm: 172.66, ratePerSqm: 117.5, availability: "Immediately", description: "<p>Full &amp; current description</p>", features: ["Meeting rooms"], image: null };
const run = () => GET(new Request("https://www.mid-point.co.za/vacancies/unit-g02/brochure"), { params: Promise.resolve({ id: row.id }) });
beforeEach(() => { vi.resetAllMocks(); mocks.limit.mockReturnValue(true); mocks.settings.mockResolvedValue({ phone: "office-phone", email: "leasing@example.com" }); mocks.generate.mockResolvedValue(new Uint8Array([37, 80, 68, 70])); });

describe("public brochure scope", () => {
  it("only selects published Midpoint vacancies and downloads fresh PDF data", async () => {
    mocks.findFirst.mockResolvedValue(row);
    const response = await run();
    expect(mocks.findFirst).toHaveBeenCalledWith({ where: { id: row.id, status: "PUBLISHED" } });
    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe("application/pdf");
    expect(response.headers.get("Content-Disposition")).toContain("attachment;");
    expect(response.headers.get("Cache-Control")).toContain("no-store");
    expect(mocks.generate.mock.calls[0][0].description).toBe("Full & current description");
    expect(mocks.generate.mock.calls[0][0].unitName).toBe("Office G.02");
  });
  it("does not render missing, unpublished or other portfolio listings", async () => {
    mocks.findFirst.mockResolvedValue(null);
    expect((await run()).status).toBe(404);
    expect(mocks.generate).not.toHaveBeenCalled();
  });
  it("uses the exact upstream ID and its full photo gallery", async () => {
    mocks.findFirst.mockResolvedValue({ ...row, externalId: "blend-source-id" });
    const images = ["https://listings.blendproperty.co.za/cover.jpg", "https://listings.blendproperty.co.za/interior.jpg"];
    mocks.images.mockResolvedValue(images);
    expect((await run()).status).toBe(200);
    expect(mocks.images).toHaveBeenCalledWith("blend-source-id");
    expect(mocks.generate.mock.calls[0][2]).toEqual({ imageUrls: images });
  });
  it("does not render a synced space withdrawn from the live Midpoint feed", async () => {
    mocks.findFirst.mockResolvedValue({ ...row, externalId: "withdrawn-source-id" });
    mocks.images.mockResolvedValue(null);
    expect((await run()).status).toBe(404);
    expect(mocks.generate).not.toHaveBeenCalled();
  });
  it("returns 503 when the source gallery cannot be fetched", async () => {
    mocks.findFirst.mockResolvedValue({ ...row, externalId: "blend-source-id" });
    mocks.images.mockRejectedValue(new Error("provider unavailable"));
    expect((await run()).status).toBe(503);
    expect(mocks.generate).not.toHaveBeenCalled();
  });
  it("returns 503 instead of an old brochure when the database fails", async () => {
    mocks.findFirst.mockRejectedValue(new Error("database unavailable"));
    expect((await run()).status).toBe(503);
    expect(mocks.generate).not.toHaveBeenCalled();
  });
  it("limits repeated PDF requests before image/database work", async () => {
    mocks.limit.mockReturnValue(false);
    const response = await run();
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("60");
    expect(mocks.findFirst).not.toHaveBeenCalled();
  });
});
