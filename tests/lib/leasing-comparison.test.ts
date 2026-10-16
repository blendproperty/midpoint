import { describe, expect, it, vi } from "vitest";
import { indicativeMonthlyRental, publishedVacancyFacts } from "@/lib/leasing-comparison";
import { pillarPageJsonLd } from "@/lib/pillar-schema";
import { vacancyJsonLd } from "@/lib/vacancy-schema";
import { blogPostingJsonLd } from "@/lib/seo";
import { getAllVacancies } from "@/lib/vacancies";
import type { VacancyListing } from "@/lib/vacancy-shared";

const database = vi.hoisted(() => ({ findMany: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ prisma: { vacancy: { findMany: database.findMany } } }));
const source = "This 10,150m&sup2; warehouse, 5,800m&sup2; yard, and 1,293m&sup2; signature office space offers frontage. " + "Further property detail. ".repeat(15) + "15m height to eaves 3000kg/sqm load bearing capacity 2.5 MVA";
const listing: VacancyListing = { id: "six-weaver", building: "Midpoint Warehousing", unitName: "6 Weaver Avenue", sector: "Warehouse", sizeSqm: 11443, ratePerSqm: 109, availability: "1 September 2026", description: source, features: [], image: "/images/listings/6-weaver-avenue.png" };

describe("source-based leasing comparisons", () => {
  it("extracts only labelled measurements and keeps their meanings separate", () => {
    expect(publishedVacancyFacts(listing).map(fact => ({ ...fact, value: fact.value.replace(/\u00a0/g, " ") }))).toEqual([
      { label: "Warehouse component", value: "10 150 m²" },
      { label: "Office component", value: "1 293 m²" },
      { label: "Yard area", value: "5 800 m²" },
      { label: "Height to eaves", value: "15 m" },
      { label: "Floor loading", value: "3 000 kg/m²" },
      { label: "Power figure", value: "2,5 MVA" },
    ]);
  });

  it("does not turn a clearance into eaves, yard size into depth or power into backup coverage", () => {
    const facts = publishedVacancyFacts({ description: "Industrial space with 4-meter clearance. Generator, parking and loading access." });
    expect(facts).toEqual([{ label: "Clearance", value: "4 m" }]);
    expect(publishedVacancyFacts({ description: "No labelled technical figures supplied." })).toEqual([]);
    expect(publishedVacancyFacts({ description: "-15m height to eaves and 0 MVA" })).toEqual([]);
  });

  it("preserves decimal and unit-specific office facts without inferring a serviced-office package", () => {
    expect(publishedVacancyFacts({ description: "500.66 m&sup2; ground-floor office. Minimum lease period of 12 months." })).toEqual([
      { label: "Office position", value: "Ground floor" }, { label: "Published minimum lease", value: "12 months" },
    ]);
  });

  it("calculates only finite positive area-rate estimates and withholds conflicting source totals", () => {
    expect(indicativeMonthlyRental(listing)).toBe(1247287);
    expect(indicativeMonthlyRental({ ...listing, sizeSqm: 500.66, ratePerSqm: 120 })).toBeCloseTo(60079.2);
    for (const sizeSqm of [0, -1, NaN, Infinity]) expect(indicativeMonthlyRental({ ...listing, sizeSqm })).toBeNull();
    for (const ratePerSqm of [0, -1, NaN, Infinity]) expect(indicativeMonthlyRental({ ...listing, ratePerSqm })).toBeNull();
    expect(indicativeMonthlyRental({ ...listing, id: "cmsfvflha000zoy01wxkk2efu", sizeSqm: 3849, description: "A 3,300 m² conversion." })).toBeNull();
  });

  it("reads full descriptions for guide facts while leaving ordinary card summaries concise", async () => {
    database.findMany.mockResolvedValue([{ ...listing, sector: "OFFICE" }]);
    const cards = await getAllVacancies();
    const guide = await getAllVacancies({ fullDescriptions: true });
    expect(cards[0].description.length).toBeLessThanOrEqual(280);
    expect(guide[0].description).toContain("15m height to eaves");
    expect(guide[0].description).toContain("10,150m²");
    expect(guide[0].sector).toBe("Warehouse");
  });

  it("uses the same explicitly published facts in schema without adding unverified specifications", () => {
    const properties = vacancyJsonLd(listing).about.additionalProperty;
    expect(properties).toContainEqual({ "@type": "PropertyValue", name: "Height to eaves", value: "15 m" });
    expect(JSON.stringify(properties)).not.toContain("Generator capacity");
    const changed = vacancyJsonLd({ ...listing, description: "Updated listing; specifications on request." });
    expect(changed.about.additionalProperty.some(p => p.name === "Height to eaves")).toBe(false);
  });
});

describe("connected guide and article schema", () => {
  const pillar = { slug: "offices", title: "Offices to Rent in Midrand", seoDescription: "Compare current offices.", heroImage: "/images/office.jpg", updatedAt: new Date("2026-10-16T08:00:00Z"), lastReviewedAt: new Date("2026-07-30T00:00:00Z"), expertName: "Boitumelo", expertRole: "Property Manager", expertBio: null, expertImage: "/images/manager.jpg" };
  it("connects the collection, visible FAQ and reviewer with absolute images and stable identities", () => {
    const graph = pillarPageJsonLd(pillar, [{ question: "How do I view?", answer: "Contact leasing." }], "https://www.mid-point.co.za/", true)["@graph"];
    expect(graph[0]).toMatchObject({ "@type": "CollectionPage", mainEntity: { "@id": "https://www.mid-point.co.za/offices#availability" }, isPartOf: { "@id": "https://www.mid-point.co.za/#website" }, lastReviewed: "2026-07-30T00:00:00.000Z", dateModified: "2026-10-16T08:00:00.000Z", image: "https://www.mid-point.co.za/images/office.jpg" });
    expect(graph[1]).toMatchObject({ "@id": "https://www.mid-point.co.za/offices#faq", isPartOf: { "@id": "https://www.mid-point.co.za/offices#webpage" } });
    expect(graph[2]).toMatchObject({ "@id": "https://www.mid-point.co.za/offices#property-contact", image: "https://www.mid-point.co.za/images/manager.jpg" });
  });
  it("omits absent lists/FAQs and does not promote a property contact to a reviewer", () => {
    const graph = pillarPageJsonLd({ ...pillar, slug: "business-park-midrand" }, [], "https://www.mid-point.co.za", false)["@graph"];
    expect(graph[0]).toMatchObject({ "@type": "WebPage" });
    expect(graph[0]).not.toHaveProperty("mainEntity");
    expect(graph[0]).not.toHaveProperty("hasPart");
    expect(graph[0]).not.toHaveProperty("reviewedBy");
    expect(graph).toHaveLength(2);
  });
  it("gives supporting articles a stable identity and absolute cover image", () => {
    const article = blogPostingJsonLd({ title: "Warehouse checklist", description: "Published specifications.", path: "/blog/checklist", image: "/images/checklist.jpg", dateModified: "2026-10-16T08:00:00Z" });
    expect(article.image).toBe("https://www.mid-point.co.za/images/checklist.jpg");
    expect(article["@id"]).toBe("https://www.mid-point.co.za/blog/checklist#article");
    expect(article).not.toHaveProperty("aggregateRating");
  });
});
