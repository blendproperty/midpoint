import { describe, expect, it, vi, afterEach } from "vitest";
import { PDFDocument } from "pdf-lib";
import { brochureFilename, brochureImageUrl, brochurePhoto, createVacancyBrochure } from "@/lib/vacancy-brochure";
import { vacancyBrochureHref, type VacancyListing } from "@/lib/vacancy-shared";

const listing: VacancyListing = { id: "unit-g02", building: "OnPoint", unitName: "Office G.02", sector: "Serviced office", sizeSqm: 172.66, ratePerSqm: 117.5, availability: "Immediately", description: "A bright serviced office at Midpoint.", features: ["Meeting rooms", "Shared kitchens"], image: "" };
afterEach(() => vi.unstubAllGlobals());

describe("Midpoint brochures", () => {
  it("makes a branded PDF with the exact unit title and online detail link", async () => {
    const result = await createVacancyBrochure(listing, { phone: "+27 11 380 9400", email: "boitumelo@blendproperty.co.za" }, { photo: null });
    const pdf = await PDFDocument.load(result);
    expect(pdf.getTitle()).toBe("OnPoint — Office G.02 | Midpoint space to let");
    expect(pdf.getAuthor()).toBe("Midpoint");
    expect(pdf.getPageCount()).toBe(1);
    const objects = pdf.context.enumerateIndirectObjects().map(([, object]) => object.toString()).join("\n");
    expect(objects).toContain("https://www.mid-point.co.za/vacancies/unit-g02");
    expect(brochureFilename(listing)).toBe("midpoint-onpoint-office-g-02.pdf");
    expect(vacancyBrochureHref(listing)).toBe("/vacancies/unit-g02/brochure");
  });

  it("flows long content onto continuation pages without losing the last feature", async () => {
    const result = await createVacancyBrochure({ ...listing, description: "An extensive description of this office space. ".repeat(150), features: Array.from({ length: 40 }, (_, i) => `Feature ${i}`) }, { phone: "On request", email: "leasing@example.com" }, { photo: null });
    const pdf = await PDFDocument.load(result);
    expect(pdf.getPageCount()).toBeGreaterThan(1);
    expect(pdf.getPages().every(page => page.getHeight() > 840)).toBe(true);
  });

  it("still generates for missing images, unknown rates and unusual text", async () => {
    const result = await createVacancyBrochure({ ...listing, ratePerSqm: 0, sizeSqm: 0, description: "Office 🏢 <available>", features: [] }, { phone: "On request", email: "leasing@example.com" }, { photo: null });
    expect((await PDFDocument.load(result)).getPageCount()).toBe(1);
  });

  it("only allows known public image hosts, HTTPS and no credentials/ports", () => {
    for (const value of ["http://127.0.0.1/x", "https://localhost/x", "https://evil.test/x", "//169.254.169.254/x", "https://user:pass@listings.blendproperty.co.za/x", "https://listings.blendproperty.co.za:444/x", ""]) expect(brochureImageUrl(value)).toBeNull();
    expect(brochureImageUrl("/images/listings/onpoint.jpeg")?.hostname).toBe("www.mid-point.co.za");
    expect(brochureImageUrl("https://listings.blendproperty.co.za/uploads/photo.jpg")?.hostname).toBe("listings.blendproperty.co.za");
  });

  it("rejects oversized/non-image responses and refuses image redirects", async () => {
    const fetch = vi.fn().mockResolvedValue(new Response("oversized", { headers: { "content-type": "image/jpeg", "content-length": String(15 * 1024 * 1024) } }));
    vi.stubGlobal("fetch", fetch);
    expect(await brochurePhoto("https://listings.blendproperty.co.za/x.jpg")).toBeNull();
    expect(fetch.mock.calls[0][1].redirect).toBe("error");
    fetch.mockResolvedValue(new Response("html", { headers: { "content-type": "text/html" } }));
    expect(await brochurePhoto("https://listings.blendproperty.co.za/x.jpg")).toBeNull();
  });
});
