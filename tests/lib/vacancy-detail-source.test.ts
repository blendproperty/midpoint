import { expect, it, vi } from "vitest";
const { findFirst } = vi.hoisted(() => ({ findFirst: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ prisma: { vacancy: { findFirst } } }));
import { getVacancyById } from "@/lib/vacancies";
import { vacancyContent } from "@/lib/vacancy-content";

it("preserves source block boundaries through the database query while keeping plain description consumers unchanged", async () => {
  const source = "<h3>About this office</h3><p>First paragraph.</p><p>Second paragraph.</p><h3>Key Features</h3><ul><li>Private kitchen</li><li>Visitor parking</li></ul>";
  findFirst.mockResolvedValue({ id: "source-test", building: "Test", unitName: "Office", sector: "OFFICE", description: source, sizeSqm: 100, ratePerSqm: 120, features: [], availability: "On request", image: null, updatedAt: new Date(), externalId: null });
  const listing = await getVacancyById("source-test");
  expect(findFirst).toHaveBeenCalledWith({ where: { id: "source-test", status: "PUBLISHED" } });
  expect(listing!.sourceDescription).toBe(source);
  expect(listing!.description).not.toContain("<");
  expect(vacancyContent(listing!).paragraphs).toEqual(["About this office", "First paragraph.", "Second paragraph."]);
  expect(vacancyContent(listing!).details).toEqual(["Private kitchen", "Visitor parking"]);
});
