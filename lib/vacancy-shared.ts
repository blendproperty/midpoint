// Browser-safe vacancy types and presentation helpers. Keep database imports
// out of this module because VacancyCard and VacancySchedule run in the client.
export type VacancySector = "Warehouse" | "Office" | "Serviced office";

export type VacancyListing = {
  id: string;
  building: string;
  unitName: string | null;
  sector: VacancySector;
  sizeSqm: number;
  ratePerSqm: number;
  availability: string;
  description: string;
  features: string[];
  image: string;
};

export function vacancyLabel(listing: Pick<VacancyListing, "building" | "unitName">) {
  return listing.unitName ? `${listing.building} — ${listing.unitName}` : listing.building;
}

export function vacancyDetailHref(listing: Pick<VacancyListing, "id">) {
  return `/vacancies/${encodeURIComponent(listing.id)}`;
}

export function vacancyRate(rate: number) {
  return Number.isFinite(rate) && rate > 0
    ? `R${rate.toLocaleString("en-ZA", { maximumFractionDigits: 2 })}`
    : "On request";
}

export function vacancySize(size: number) {
  return Number.isFinite(size) && size > 0
    ? `${size.toLocaleString("en-ZA", { maximumFractionDigits: 2 })} m²`
    : "Area on request";
}

export function vacancyAvailability(value: string) {
  if (!value) return "On request";
  if (/^\d{4}-\d{2}-\d{2}(?:T|$)/.test(value)) {
    const date = new Date(value);
    if (Number.isFinite(date.getTime())) return date.toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  }
  return value;
}
