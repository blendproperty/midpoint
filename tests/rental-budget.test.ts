import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import RentalBudgetCalculator from "@/components/RentalBudgetCalculator";
import type { VacancyListing } from "@/lib/vacancy-shared";

it("offers only usable published starting figures and leaves charges unconfirmed", () => {
  const listing: VacancyListing = { id: "office", building: "Office", unitName: "Suite A", sector: "Office", sizeSqm: 500.66, ratePerSqm: 120, availability: "Confirm", description: "Office suite", features: [], image: "" };
  vi.stubGlobal("React", React);
  try {
    const html = renderToStaticMarkup(React.createElement(RentalBudgetCalculator, { plannedArea: 400, listings: [
      listing,
      { ...listing, id: "unknown-price", ratePerSqm: 0 },
      { ...listing, id: "cmsfvflha000zoy01wxkk2efu", sizeSqm: 3849, description: "3,300 m² conversion opportunity." },
    ] }));
    expect(html).toContain('value="office"');
    expect(html).not.toContain('value="unknown-price"');
    expect(html).not.toContain('value="cmsfvflha000zoy01wxkk2efu"');
    expect(html).toContain('value="400"');
    expect(html).toContain("4 monthly charges still to confirm");
    expect(html).toContain("Enter a valid area and rate");
    expect(html).toContain('id="rental-budget"');
    expect(html).not.toContain("<form");
  } finally { vi.unstubAllGlobals(); }
});
