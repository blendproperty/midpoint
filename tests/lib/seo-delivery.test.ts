import { describe, expect, it, vi, beforeEach } from "vitest";
import { buildPageMetadata, publicSeoUrl } from "@/lib/seo-metadata";
import { buildSitemap } from "@/lib/seo-sitemap";
import { readCanonicalUrl } from "@/lib/seo-validation";
import { readContentIdea } from "@/lib/content-ideas";
import { redirectDestination } from "@/lib/seo-redirects";

const settings = { domain: "https://www.mid-point.co.za", siteName: "Midpoint Midrand", defaultSocialImage: "/default.jpg", defaultMetaDescription: "Estate information", allowIndexing: true };
describe("public SEO delivery", () => {
  it("delivers saved canonical and social fields to both preview protocols", () => {
    const result = buildPageMetadata({ path: "/about-us", title: "About", settings, fields: { seoTitle: "Estate | Midpoint Midrand", seoDescription: "Search description", canonicalUrl: "https://www.mid-point.co.za/about-us", ogTitle: "Share title", ogDescription: "Share description", ogImage: "/share.jpg" } });
    expect(result.title).toBe("Estate");
    expect(result.description).toBe("Search description");
    expect(result.alternates?.canonical).toBe(`${settings.domain}/about-us`);
    expect(result.openGraph).toMatchObject({ title: "Share title", description: "Share description", url: `${settings.domain}/about-us`, images: [{ url: `${settings.domain}/share.jpg` }] });
    expect(result.twitter).toMatchObject({ title: "Share title", description: "Share description", images: [`${settings.domain}/share.jpg`] });
  });
  it("uses self canonicals and site social fallbacks on every route type", () => {
    for (const path of ["/", "/faqs", "/vacancies/abc", "/blog/story", "/p/page", "/offices", "/the-suites-at-midpoint"]) {
      const result = buildPageMetadata({ path, title: "Title", settings });
      expect(result.alternates?.canonical).toBe(new URL(path, settings.domain).href);
      expect(result.twitter).toMatchObject({ images: [`${settings.domain}/default.jpg`] });
    }
  });
  it("keeps global, per-page and protected exclusions stronger than page defaults", () => {
    for (const fields of [{ noIndex: true }, { passwordProtected: true }]) expect(buildPageMetadata({ path: "/offices", title: "Title", fields, settings }).robots).toMatchObject({ index: false });
    expect(buildPageMetadata({ path: "/", title: "Title", settings: { ...settings, allowIndexing: false } }).robots).toMatchObject({ index: false });
  });
  it("rejects invalid canonical writes and safely ignores invalid historical values", () => {
    for (const value of ["javascript:alert(1)", "data:text/html,x", "https://user:pass@example.com"]) {
      expect(publicSeoUrl(value, settings.domain)).toBeUndefined();
      const form = new FormData(); form.set("canonicalUrl", value);
      expect(() => readCanonicalUrl(form)).toThrow();
    }
    const form = new FormData(); form.set("canonicalUrl", "https://www.mid-point.co.za/about-us#section");
    expect(readCanonicalUrl(form)).toBe(`${settings.domain}/about-us`);
  });
  it("sitemap omits excluded, protected, redirected and alternate-canonical URLs without inventing dates", () => {
    const lastModified = new Date("2026-09-30T00:00:00Z");
    const candidates = [{ path: "/" }, { path: "/offices", updatedAt: lastModified }, { path: "/hidden", noIndex: true }, { path: "/private", passwordProtected: true }, { path: "/old" }, { path: "/duplicate", canonicalUrl: `${settings.domain}/offices` }, { path: "/offices" }, { path: "/vacancies/abc" }];
    expect(buildSitemap(settings.domain, true, candidates, ["/old"])).toEqual([{ url: `${settings.domain}/` }, { url: `${settings.domain}/offices`, lastModified }, { url: `${settings.domain}/vacancies/abc` }]);
    expect(buildSitemap(settings.domain, false, candidates)).toEqual([]);
  });
  it("preserves incoming redirect queries while respecting explicit destination values", () => {
    expect(redirectDestination("/vacancies?sector=Office", "https://www.mid-point.co.za/old?utm_source=mail&sector=Warehouse").href).toBe("https://www.mid-point.co.za/vacancies?sector=Office&utm_source=mail");
    expect(() => redirectDestination("javascript:alert(1)", settings.domain)).toThrow();
    expect(redirectDestination("/vacancies", "https://www.mid-point.co.za/old?interest=office&interest=warehouse").searchParams.getAll("interest")).toEqual(["office", "warehouse"]);
  });
});

describe("private content planning validation", () => {
  const form = () => { const f = new FormData(); f.set("title", "Office viewing checklist"); return f; };
  it("supports the reference CMS planning fields without a publishing contract", () => {
    const f = form(); f.set("keyword", "office space Midrand"); f.set("audience", "Business tenants"); f.set("brief", "Questions to ask"); f.set("research", "Review leasing details"); f.set("status", "published"); f.set("format", "article"); f.set("priority", "high"); f.set("targetDate", "2026-10-20"); f.set("publishedUrl", `${settings.domain}/blog/checklist`);
    expect(readContentIdea(f, settings.domain)).toMatchObject({ title: "Office viewing checklist", status: "published", keyword: "office space Midrand", targetDate: new Date("2026-10-20T00:00:00Z"), publishedUrl: `${settings.domain}/blog/checklist` });
  });
  it("rejects invalid status, dates and foreign/non-HTTPS finished links", () => {
    for (const [key, value] of [["status", "live"], ["targetDate", "2026-02-30"], ["publishedUrl", "https://other.example/blog"], ["publishedUrl", "http://www.mid-point.co.za/blog"]]) {
      const f = form(); f.set(key, value); expect(() => readContentIdea(f, settings.domain)).toThrow();
    }
  });
});

const mocks = vi.hoisted(() => ({ auth: vi.fn(), create: vi.fn(), update: vi.fn(), remove: vi.fn() }));
vi.mock("@/lib/require-admin", () => ({ requireAdmin: mocks.auth }));
vi.mock("@/lib/prisma", () => ({ prisma: { contentIdea: { create: mocks.create, update: mocks.update, delete: mocks.remove } } }));
vi.mock("@/lib/site-settings", () => ({ getSiteSettings: async () => settings }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
import { saveContentIdea, deleteContentIdea } from "@/app/admin/(protected)/content-ideas/actions";
describe("content idea action permissions", () => {
  beforeEach(() => { vi.clearAllMocks(); mocks.auth.mockResolvedValue({ role: "EDITOR" }); });
  it("denies unauthenticated create, update and delete before any database mutation", async () => {
    mocks.auth.mockRejectedValue(new Error("Unauthorized"));
    const f = new FormData(); f.set("title", "Test");
    await expect(saveContentIdea(f)).rejects.toThrow("Unauthorized"); f.set("id", "idea");
    await expect(saveContentIdea(f)).rejects.toThrow("Unauthorized"); await expect(deleteContentIdea(f)).rejects.toThrow("Unauthorized");
    expect(mocks.create).not.toHaveBeenCalled(); expect(mocks.update).not.toHaveBeenCalled(); expect(mocks.remove).not.toHaveBeenCalled();
  });
  it("writes only authenticated planning records, including published progress", async () => {
    const f = new FormData(); f.set("title", "Test idea"); f.set("status", "published");
    await saveContentIdea(f); expect(mocks.create).toHaveBeenCalledWith({ data: expect.objectContaining({ title: "Test idea", status: "published" }) });
    f.set("id", "idea"); await saveContentIdea(f); expect(mocks.update).toHaveBeenCalledWith({ where: { id: "idea" }, data: expect.objectContaining({ title: "Test idea" }) });
  });
});
