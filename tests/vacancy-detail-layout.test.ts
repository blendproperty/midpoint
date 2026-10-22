import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";
import { vacancyLabel } from "@/lib/vacancy-shared";

const { getVacancyById } = vi.hoisted(() => ({ getVacancyById: vi.fn() }));
vi.mock("@/lib/vacancies", () => ({ getVacancyById, vacancyLabel, vacancySummary: (text: string) => text }));
vi.mock("@/lib/site-settings", () => ({ getSiteSettings: async () => ({ domain: "https://www.mid-point.co.za", phone: "+27 11 380 9400" }) }));
vi.mock("@/lib/page-seo", () => ({ getPageSeoOverride: vi.fn() }));
vi.mock("@/lib/listings-brochure", () => ({ getListingBrochureImages: vi.fn() }));
vi.mock("@/components/VacancyViewTracker", () => ({ default: () => null }));
import VacancyDetailPage from "@/app/vacancies/[id]/page";

const listing = { id: "layout-test", building: "Test building", unitName: "Test unit", sector: "Office", sizeSqm: 2183, ratePerSqm: 115, availability: "Contact leasing", description: "Office and training space. Current layout to be confirmed.", features: [], image: "/images/test.jpg", updatedAt: new Date("2026-10-22T08:00:00Z") };
afterEach(() => vi.unstubAllGlobals());

it.each(["Office", "Warehouse", "Serviced office"])("keeps %s information first and confirmations accessible without an empty technical card", async sector => {
  vi.stubGlobal("React", React);
  getVacancyById.mockResolvedValue({ ...listing, sector });
  const html = renderToStaticMarkup(await VacancyDetailPage({ params: Promise.resolve({ id: listing.id }) }));
  const details = html.slice(html.indexOf('>Property details</h2>'));
  expect(details.indexOf(listing.description)).toBeLessThan(details.indexOf("Property information to confirm"));
  expect(html).not.toContain("No labelled technical measurements");
  expect(html).not.toContain(">At a glance<");
  expect(details).toContain('<details');
  expect(details).toContain("VAT, recoveries, utilities");
  expect(details).toContain('data-analytics-location="vacancy_viewing_brief"');
  expect(details.indexOf("Request a floor plan and viewing")).toBeLessThan(details.indexOf("What to check at your viewing"));
  expect(details).toContain('href="tel:+27113809400"');
  expect(details).toContain('interest=');
});

it("retains source measurements and the prominent conflicting-area warning", async () => {
  vi.stubGlobal("React", React);
  getVacancyById.mockResolvedValue({ ...listing, id: "cmsfvflha000zoy01wxkk2efu", sector: "Warehouse", sizeSqm: 3849, description: "A 3,300 m² property. 8m height to eaves." });
  const html = renderToStaticMarkup(await VacancyDetailPage({ params: Promise.resolve({ id: "cmsfvflha000zoy01wxkk2efu" }) }));
  expect(html).toContain("At a glance");
  expect(html).toContain("8 m");
  expect(html).toContain("Area confirmation required:");
  expect(html.indexOf("Area confirmation required:")).toBeLessThan(html.indexOf("Property information to confirm"));
});
