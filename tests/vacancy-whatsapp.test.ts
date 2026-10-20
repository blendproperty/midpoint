import { describe, expect, it, vi } from "vitest";
vi.mock("@/lib/prisma", () => ({ prisma: {} }));
import { buildVacancyWhatsappMessage, type VacancyListing } from "@/lib/vacancies";

const listing: VacancyListing = {
  id: "storage", building: "Midpoint Warehousing", unitName: "STOR24 Self-Storage at Midpoint",
  sector: "Warehouse", sizeSqm: 0, ratePerSqm: 0, availability: "Contact Boitumelo",
  description: "Contact Boitumelo for pricing", features: [], image: "",
};

describe("vacancy WhatsApp pricing", () => {
  it.each([0, -1])("keeps unspecified area and rate on request (%s)", value => {
    const text = buildVacancyWhatsappMessage("Hello", { ...listing, sizeSqm: value, ratePerSqm: value }, "https://www.mid-point.co.za/");
    expect(text).toContain("STOR24 Self-Storage at Midpoint — area on request, rate on request, available Contact Boitumelo.");
    expect(text).not.toContain("R0");
    expect(text).toContain("https://www.mid-point.co.za/vacancies");
  });
  it("preserves published area and rate for ordinary vacancies", () => {
    const text = buildVacancyWhatsappMessage("Hello", { ...listing, sizeSqm: 100, ratePerSqm: 120 }, "https://www.mid-point.co.za");
    expect(text).toContain("100 m², R120/m²");
    expect(text).toMatch(/^Hello\n\nI'm interested in:/);
  });
});
