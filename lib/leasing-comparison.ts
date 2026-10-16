import { decode } from "html-entities";
import { vacancyAreaNeedsConfirmation } from "@/lib/vacancy-content";
import type { VacancyListing } from "@/lib/vacancy-shared";

export type PublishedFact = { label: string; value: string };

// Extract only explicitly labelled measurements from the current source text.
// A power figure is not a generator rating; eaves are not unobstructed height;
// yard area is not yard depth or a promise that a truck can turn.
export function publishedVacancyFacts(listing: Pick<VacancyListing, "description">): PublishedFact[] {
  const text = decode(listing.description).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
  const facts: PublishedFact[] = [];
  const number = "(?<![\\d.,-])(\\d[\\d,]*(?:\\.\\d+)?)";
  const add = (label: string, pattern: RegExp, unit: string) => {
    const match = text.match(pattern);
    if (match && Number(match[1].replaceAll(",", "")) > 0) facts.push({ label, value: `${Number(match[1].replaceAll(",", "")).toLocaleString("en-ZA", { maximumFractionDigits: 2 })} ${unit}` });
  };
  add("Warehouse component", new RegExp(number + "\\s*m²\\s+warehouse\\b", "i"), "m²");
  add("Office component", new RegExp(number + "\\s*m²\\s+(?:signature\\s+)?office\\s+space\\b", "i"), "m²");
  add("Yard area", new RegExp(number + "\\s*m²\\s+yard\\b", "i"), "m²");
  add("Height to eaves", new RegExp(number + "\\s*m\\s+height\\s+to\\s+eaves\\b", "i"), "m");
  add("Clearance", new RegExp(number + "[- ]met(?:er|re)s?\\s+clearance\\b", "i"), "m");
  add("Floor loading", new RegExp(number + "\\s*kg\\s*/\\s*(?:sqm|m²)\\s+load\\s+bearing\\s+capacity\\b", "i"), "kg/m²");
  const power = text.match(new RegExp(number + "\\s*(MVA|kVA)\\b", "i"));
  if (power && Number(power[1].replaceAll(",", "")) > 0) facts.push({ label: "Power figure", value: `${Number(power[1].replaceAll(",", "")).toLocaleString("en-ZA")} ${power[2]}` });
  if (/\bground[- ]floor\s+office\b/i.test(text)) facts.push({ label: "Office position", value: "Ground floor" });
  add("Published minimum lease", /minimum lease (?:period|term) of (\d+) months\b/i, "months");
  return facts;
}

export function indicativeMonthlyRental(listing: Pick<VacancyListing, "id" | "description" | "sizeSqm" | "ratePerSqm">): number | null {
  if (vacancyAreaNeedsConfirmation(listing) || !Number.isFinite(listing.sizeSqm) || listing.sizeSqm <= 0 || !Number.isFinite(listing.ratePerSqm) || listing.ratePerSqm <= 0) return null;
  const value = listing.sizeSqm * listing.ratePerSqm;
  return Number.isFinite(value) ? value : null;
}
