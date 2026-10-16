import { decode } from "html-entities";
import { vacancyAvailability, vacancyLabel, vacancySize, type VacancyListing } from "@/lib/vacancy-shared";

// Editorial priorities, not traffic/ranking claims. Facts remain in the synced row.
export const PRIORITY_VACANCY_IDS = [
  "cmsfvflfy000yoy01stx7o2dp", // 6 Weaver
  "cmsfvflhj0010oy014b1ytkku", // 1 Kingfisher
  "cmsfuu4xu000ooy01x3ulli7b", // 2 Weaver
  "cms4oiw4v0004n60127izdqzj", // Sunbird ground floor
  "cms4oiw4n0002n601y2gpa0qf", // OnPoint G.02
] as const;

export function isPriorityVacancy(id: string) {
  return (PRIORITY_VACANCY_IDS as readonly string[]).includes(id);
}

export function vacancyAreaNeedsConfirmation(listing: Pick<VacancyListing, "id" | "description" | "sizeSqm">) {
  // This conversion opportunity has conflicting total areas in the source.
  // Re-evaluate the live fields, so the notice clears once the source is fixed.
  if (listing.id !== "cmsfvflha000zoy01wxkk2efu") return false;
  const area = decode(listing.description).match(/\b(\d[\d,]*(?:\.\d+)?)\s*m²/i);
  return !!area && Number(area[1].replaceAll(",", "")) !== listing.sizeSqm;
}

export function vacancyContent(listing: VacancyListing) {
  const clean = decode(listing.description).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const [narrative, ...detail] = clean.split(/Key Features\s*:?/i);
  const details = detail.join(" ").split(/[🔹✅✔✓☑•]/u).map(v => v.trim()).filter(Boolean);
  const address = listing.unitName || listing.building;
  const type = listing.sector === "Warehouse" ? "Warehouse" : listing.sector === "Office" ? "Office space" : "Serviced office";
  const title = `${address} | ${type} to Rent in Midrand`;
  const description = `${vacancyAreaNeedsConfirmation(listing) ? "" : vacancySize(listing.sizeSqm) + " "}${listing.sector.toLowerCase()} to rent at ${address}, Halfway House, Midrand. View property details, photography and asking rental, or arrange a viewing.`;
  const viewing = listing.sector === "Warehouse" ? [
    "Request a dimensioned floor plan showing the warehouse, offices, loading positions and yard.",
    "Check clear height, floor loading, fire provision, power supply and backup coverage against your intended operation.",
    "Confirm loading-door dimensions and test vehicle circulation for your largest regular delivery vehicle.",
    "Agree the required works, approvals, occupation programme and full rental breakdown before committing.",
  ] : listing.sector === "Serviced office" ? [
    "Request the suite floor plan and test workstation capacity, privacy and meeting-room needs for your team.",
    "Confirm furniture options, connectivity, meeting-room allowances and what any monthly credits cover.",
    "Confirm the parking allocation, visitor arrangements, access hours and complete monthly package.",
    "Agree the lease term, deposit and occupation date with the leasing team.",
  ] : [
    "Request the current floor plan and check workstations, private offices, meeting rooms and circulation against your team brief.",
    "Confirm parking allocation and charges, visitor access, connectivity and the unit's backup power and water arrangements.",
    "Agree any fit-out work, landlord and tenant responsibilities, and occupation timing.",
    "Request the complete cost breakdown, including VAT, recoveries, utilities, parking, deposit and escalation.",
  ];
  return { title, description, narrative, details, viewing, label: vacancyLabel(listing), availability: vacancyAvailability(listing.availability) };
}
