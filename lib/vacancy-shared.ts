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

export function vacancyEnquiryHref(listing: Pick<VacancyListing, "building" | "unitName" | "sector">) {
  const interest: Record<VacancySector, string> = {
    Warehouse: "Warehouse space", Office: "Office space", "Serviced office": "Serviced offices",
  };
  const params = new URLSearchParams({ space: vacancyLabel(listing), interest: interest[listing.sector] });
  return `/contact-us?${params.toString()}#Contact`;
}

export function formatVacancySize(value: number) {
  return `${value.toLocaleString("en-ZA", { maximumFractionDigits: 2 })} m²`;
}

export function formatVacancyRate(value: number) {
  return `R ${value.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
