import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ listing: vi.fn(), fields: vi.fn(), settings: vi.fn() }));
vi.mock("@/lib/vacancies", async importOriginal => ({ ...await importOriginal<typeof import("@/lib/vacancies")>(), getVacancyBySlugOrId: mocks.listing }));
vi.mock("@/lib/page-seo", () => ({ getPageSeoOverride: mocks.fields }));
vi.mock("@/lib/site-settings", () => ({ getSiteSettings: mocks.settings }));
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("404"); }, permanentRedirect: (path: string) => { throw new Error(`308:${path}`); } }));
import VacancyDetailPage, { generateMetadata } from "@/app/vacancies/[id]/page";

const listing = { id: "legacy-id", slug: "onpoint-office-g-02-midrand", building: "OnPoint", unitName: "Office G.02", sector: "Serviced office", sizeSqm: 172.66, ratePerSqm: 117.5, availability: "Immediately", description: "Fixture", features: [], image: "/office.jpg" };
const props = (id: string, query: Record<string, string | string[]> = {}) => ({ params: Promise.resolve({ id }), searchParams: Promise.resolve(query) });
beforeEach(() => {
  vi.resetAllMocks();
  mocks.listing.mockResolvedValue(listing);
  mocks.fields.mockResolvedValue(null);
  mocks.settings.mockResolvedValue({ domain: "https://www.mid-point.co.za", siteName: "Midpoint", allowIndexing: true });
});

describe("vacancy canonical routes", () => {
  it("permanently redirects ID links before rendering, preserving tracking and repeated parameters", async () => {
    for (const render of [generateMetadata, VacancyDetailPage]) {
      await expect(render(props(listing.id, { utm_source: "email", tag: ["a", "b"] }))).rejects.toThrow("308:/vacancies/onpoint-office-g-02-midrand?utm_source=email&tag=a&tag=b");
    }
  });
  it("returns 404 for missing and unpublished listings", async () => {
    mocks.listing.mockResolvedValue(null);
    for (const render of [generateMetadata, VacancyDetailPage]) await expect(render(props("missing"))).rejects.toThrow("404");
  });
  it("generates listing-specific canonical and social metadata", async () => {
    const result = await generateMetadata(props(listing.slug));
    expect(mocks.fields).toHaveBeenCalledWith(`/vacancies/${listing.slug}`);
    expect(result.title).toContain("OnPoint — Office G.02");
    expect(result.title).toContain("Serviced office to Rent in Midrand");
    expect(result.description).toContain("172,66 m²");
    expect(result.description).toContain("Immediately");
    expect(result.alternates?.canonical).toBe(`https://www.mid-point.co.za/vacancies/${listing.slug}`);
    expect(result.openGraph).toMatchObject({ url: result.alternates?.canonical, images: [{ url: "https://www.mid-point.co.za/office.jpg" }] });
    expect(result.twitter).toMatchObject({ card: "summary_large_image" });
  });
  it("preserves editorial overrides and noindex", async () => {
    mocks.fields.mockResolvedValue({ seoTitle: "Owner title", seoDescription: "Owner description", noIndex: true });
    const result = await generateMetadata(props(listing.slug));
    expect(result.title).toBe("Owner title");
    expect(result.description).toBe("Owner description");
    expect(result.robots).toMatchObject({ index: false });
  });
});
