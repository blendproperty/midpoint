import { describe, expect, it } from "vitest";
import { vacancyJsonLd, vacancyListJsonLd } from "@/lib/vacancy-schema";
import { vacancyContent } from "@/lib/vacancy-content";
import { normalizedVacancySector } from "@/lib/vacancy-sector";
import type { VacancyListing } from "@/lib/vacancy-shared";

const listing: VacancyListing = { id: "one", building: "Midpoint Warehousing", unitName: "6 Weaver Avenue", sector: "Warehouse", sizeSqm: 11443, ratePerSqm: 109, availability: "1 July 2027", description: "A 10,150 m² warehouse with integrated offices. 15m height to eaves and 2.5 MVA. Key Features 🔹 Confirmed loading specification 🔹 Yard", features: [], image: "/images/listings/6-weaver-avenue.png" };

describe("leasing content and schema", () => {
  it("uses exact unit URLs and qualified area rates without inventing immediate stock", () => {
    const schema = vacancyJsonLd(listing);
    expect(schema["@type"]).toBe("RealEstateListing");
    expect(schema.url).toBe("https://www.mid-point.co.za/vacancies/one");
    expect(schema.name).toContain("6 Weaver Avenue");
    expect(schema.offers["@type"]).toBe("OfferForLease");
    expect(schema.offers.priceSpecification).toMatchObject({ price: 109, priceCurrency: "ZAR", unitText: "m² per month" });
    expect(schema.offers).not.toHaveProperty("price");
    expect(schema.offers).not.toHaveProperty("availability");
    expect(JSON.stringify(schema)).not.toContain("InStock");
    expect(schema.offers.description).toContain("1 July 2027");
    expect(schema.image).toMatch(/^https:\/\//);
  });
  it("does not turn an unknown asking rate into a zero-priced offer", () => {
    for (const ratePerSqm of [0, -1, NaN]) expect(vacancyJsonLd({ ...listing, ratePerSqm }).offers).not.toHaveProperty("priceSpecification");
  });
  it("withholds numeric schema for the conflicting conversion area until the source agrees", () => {
    const conflict = { ...listing, id: "cmsfvflha000zoy01wxkk2efu", description: "A substantial 3,300 m² commercial property.", sizeSqm: 3849 };
    expect(vacancyJsonLd(conflict).offers).not.toHaveProperty("priceSpecification");
    expect(vacancyJsonLd(conflict).about.additionalProperty.some(p => p.name === "Published floor area")).toBe(false);
    expect(vacancyJsonLd({ ...conflict, sizeSqm: 3300 }).offers).toHaveProperty("priceSpecification");
  });
  it("describes each unit rather than repeating the schedule URL", () => {
    const schema = vacancyListJsonLd([listing, { ...listing, id: "two", unitName: "1 Kingfisher Avenue" }], "/warehouses", "Warehouse availability");
    expect(schema.numberOfItems).toBe(2);
    expect(schema.itemListElement.map(i => i.item.url)).toEqual(["https://www.mid-point.co.za/vacancies/one", "https://www.mid-point.co.za/vacancies/two"]);
    expect(JSON.stringify(schema)).not.toContain('"@type":"Product"');
  });
  it("keeps complete source specifications and decimal measurements", () => {
    const content = vacancyContent(listing);
    expect(content.narrative).toContain("2.5 MVA");
    expect(content.details).toEqual(["Confirmed loading specification", "Yard"]);
    expect(content.title).toContain("Warehouse to Rent in Midrand");
    expect(content.viewing.join(" ")).toContain("floor plan");
    expect(vacancyContent({ ...listing, sector: "Serviced office" }).viewing.join(" ")).toContain("monthly credits");
  });
  it("normalizes only the known industrial portfolio, never shared feature words", () => {
    expect(normalizedVacancySector("OFFICE", " Midpoint Warehousing ")).toBe("WAREHOUSE");
    expect(normalizedVacancySector("OFFICE", "Midpoint Commercial")).toBe("OFFICE");
    expect(normalizedVacancySector("OFFICE", "Warehouse Management Offices")).toBe("OFFICE");
  });
});
