import { prisma } from "@/lib/prisma";

export type VacancySector = "Warehouse" | "Office" | "Serviced office";

export type VacancyListing = {
  id: string;
  building: string;
  // Specific unit/suite name within `building`, e.g. "OnPoint Suite 4" for
  // a listing whose `building` is just "OnPoint". Null for standalone
  // buildings where there's nothing more specific to show.
  unitName: string | null;
  sector: VacancySector;
  sizeSqm: number;
  ratePerSqm: number;
  availability: string;
  description: string;
  features: string[];
  image: string;
};

const SECTOR_LABEL: Record<string, VacancySector> = {
  WAREHOUSE: "Warehouse",
  OFFICE: "Office",
  SERVICED_OFFICE: "Serviced office",
};

// Kept as a manual override for a future live listings.blendproperty.co.za
// API integration; not currently used by the DB-backed queries below, which
// always read the latest rows (Postgres is local/fast so there's no need to
// add a caching layer on top of it yet).
export const VACANCY_REVALIDATE_SECONDS =
  Number(process.env.VACANCY_REVALIDATE_SECONDS) || 60 * 60 * 24 * 7;

// The label used anywhere a vacancy needs a single human-readable name — the
// specific unit when there is one (e.g. "OnPoint — Suite 4"), otherwise just
// the building name. Buildings like OnPoint have many individual listings
// that would otherwise all show up as the same bare "OnPoint", making it
// impossible to tell which actual space someone is asking about.
export function vacancyLabel(listing: Pick<VacancyListing, "building" | "unitName">) {
  return listing.unitName ? `${listing.building} — ${listing.unitName}` : listing.building;
}

export function vacancyDetailHref(listing: Pick<VacancyListing, "id">) {
  return `/vacancies/${encodeURIComponent(listing.id)}`;
}

const DESCRIPTION_ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&apos;": "'",
  "&#39;": "'",
  "&quot;": '"',
  "&nbsp;": " ",
  "&sup2;": "²",
  "&#178;": "²",
  "&lt;": "<",
  "&gt;": ">",
};

export function vacancySector(sourceSector: string, building: string): VacancySector {
  // The upstream feed currently labels the Midpoint Warehousing portfolio as
  // OFFICE. The public category must follow the actual property product.
  if (/\bwarehous(?:e|ing)\b/i.test(building)) return "Warehouse";
  return SECTOR_LABEL[sourceSector] || "Office";
}

export function vacancySummary(value: string, maxLength = 280) {
  const clean = value
    .replace(/&(amp|apos|quot|nbsp|sup2|lt|gt);|&#(?:39|178);/gi, (entity) =>
      DESCRIPTION_ENTITIES[entity.toLowerCase()] || entity,
    )
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (clean.length <= maxLength) return clean;

  const sentences = clean.match(/[^.!?]+[.!?]+/g) || [];
  const opening = sentences.slice(0, 2).map((sentence) => sentence.trim()).join(" ");
  if (opening && opening.length <= maxLength) return opening;

  return `${clean.slice(0, maxLength - 1).replace(/\s+\S*$/, "").trimEnd()}…`;
}

export async function getVacancyById(id: string): Promise<VacancyListing | null> {
  const vacancies = await getAllVacancies();
  return vacancies.find((vacancy) => vacancy.id === id) || null;
}

function formatVacancySize(n: number) {
  return `${n.toLocaleString("en-ZA", { maximumFractionDigits: 2 })} m²`;
}

// Builds a per-listing WhatsApp message from the site's single admin-edited
// base template (Site Settings -> whatsappTemplate) by appending that
// specific listing's details and a link back to the public vacancies page.
// Mirrors the intent of listings.blendproperty.co.za's per-listing WhatsApp
// links (renderWhatsappTemplate there), adapted for the fact that Midpoint
// has one site-wide WhatsApp number rather than a contact per listing.
export function buildVacancyWhatsappMessage(
  baseTemplate: string,
  listing: VacancyListing,
  siteUrl: string,
) {
  const details = `${vacancyLabel(listing)} — ${formatVacancySize(listing.sizeSqm)}, R${listing.ratePerSqm}/m², available ${listing.availability}.`;
  const link = `${siteUrl.replace(/\/$/, "")}/vacancies`;
  return `${baseTemplate}\n\nI'm interested in: ${details}\n${link}`;
}

// Availability must be current. If the database is unavailable or has no
// published rows, show no listings rather than an old hard-coded snapshot
// that could include a space already let on Blend Listings.
export async function getAllVacancies(): Promise<VacancyListing[]> {
  try {
    const rows = await prisma.vacancy.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    if (rows.length === 0) return [];
    return rows.map((row) => ({
      id: row.id,
      building: row.building,
      unitName: row.unitName || null,
      sector: vacancySector(row.sector, row.building),
      sizeSqm: row.sizeSqm,
      ratePerSqm: row.ratePerSqm,
      availability: row.availability,
      description: vacancySummary(row.description),
      features: row.features,
      image: row.image || "",
    }));
  } catch {
    return [];
  }
}

export async function getVacanciesGroupedBySector() {
  const all = await getAllVacancies();
  return {
    warehouse: all.filter((v) => v.sector === "Warehouse"),
    office: all.filter((v) => v.sector === "Office"),
    servicedOffice: all.filter((v) => v.sector === "Serviced office"),
    all,
  };
}
