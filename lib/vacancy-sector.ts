export type VacancySectorCode = "WAREHOUSE" | "OFFICE" | "SERVICED_OFFICE";

// This named portfolio is industrial even when the source feed says OFFICE.
// Do not infer a sector from shared amenity tags such as "Warehousing".
export function normalizedVacancySector(source: VacancySectorCode, building: string): VacancySectorCode {
  return building.trim().toLowerCase() === "midpoint warehousing" ? "WAREHOUSE" : source;
}
