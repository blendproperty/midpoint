const AMENITY_BUILDING_SLUGS = new Set([
  "amenityhub",
  "amenity-hub",
  "corporate-apartments",
  "corporate-accommodation",
]);

// The previous Webflow site exposed individual /buildings/* and /units/*
// collection URLs. The rebuilt site centralises current, database-backed
// inventory on /vacancies, while amenity destinations belong on /amenities.
// A family-level fallback also catches legacy slugs still appearing in Search
// Console but no longer present in the current inventory export.
export function legacyDestination(pathname: string): string | null {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  const building = /^\/buildings\/([^/]+)$/i.exec(normalized);
  if (building) {
    return AMENITY_BUILDING_SLUGS.has(building[1].toLowerCase()) ? "/amenities" : "/vacancies";
  }

  if (/^\/units\/[^/]+$/i.test(normalized)) return "/vacancies";
  return null;
}
