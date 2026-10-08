import { prisma } from "@/lib/prisma";

// Pulls Midpoint's own listings from listings.blendproperty.co.za's public
// API and upserts them into this site's Vacancy table, so availability and
// pricing shown here (and in listingsJsonLd()'s schema) stays current
// instead of being re-typed by hand into /admin every time something
// changes on the group-wide platform.
//
// API docs (from Brett, confirmed against listings.blendproperty.co.za):
//   GET /api/public/v1/midpoint/listings
//   Authorization: Bearer <LISTINGS_API_KEY>
//   Query params: businessPark, transaction, updatedSince, page, limit
//   Response: { data: Listing[], pagination: { page, limit, total, totalPages }, generatedAt }
//
// Configure with LISTINGS_API_BASE_URL (defaults to
// https://listings.blendproperty.co.za) and LISTINGS_API_KEY (the Bearer
// token Brett has from that side). If LISTINGS_API_KEY isn't set, the sync
// returns an explicit configuration error — same "optional integration" pattern as
// the other listings.blendproperty.co.za wiring in this codebase.

type ListingImage = { url: string; altText?: string; position?: number; isHero?: boolean };

// The full shape is wider than this (contacts, location, brochureUrl, etc.)
// — only the fields this sync actually maps onto Vacancy are typed here.
type ListingRecord = {
  id: string;
  name?: string;
  status?: string;
  transaction?: string;
  marketSector?: string;
  availability?: string;
  availableFrom?: string;
  availableFromLabel?: string;
  isAvailableImmediately?: boolean;
  gla?: number;
  ratePerM2?: number;
  description?: string;
  summary?: string;
  features?: (string | { name?: string; label?: string })[];
  building?: { name?: string };
  businessPark?: { name?: string };
  images?: ListingImage[];
  updatedAt?: string;
};

type ListingsResponse = {
  data: ListingRecord[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export type VacancySyncResult = {
  ranAt: string;
  fetched: number;
  created: number;
  updated: number;
  deprecated: number;
  skipped: { id: string; title: string; reason: string }[];
  error?: string;
};

function apiBaseUrl(): string {
  return (process.env.LISTINGS_API_BASE_URL || "https://listings.blendproperty.co.za").replace(/\/$/, "");
}

async function fetchAllListings(): Promise<ListingRecord[]> {
  const apiKey = process.env.LISTINGS_API_KEY;
  if (!apiKey) return [];

  const all: ListingRecord[] = [];
  const ids = new Set<string>();
  let page = 1;
  const limit = 100;
  let expectedTotal = -1;

  while (true) {
    const url = new URL(`${apiBaseUrl()}/api/public/v1/midpoint/listings`);
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(limit));

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) {
      throw new Error(`listings.blendproperty.co.za returned ${res.status}`);
    }
    const body = (await res.json()) as ListingsResponse;
    const pagination = body.pagination;
    if (!Array.isArray(body.data) || !pagination || pagination.page !== page || pagination.limit !== limit ||
        !Number.isInteger(pagination.total) || pagination.total < 0 ||
        !Number.isInteger(pagination.totalPages) || pagination.totalPages !== Math.ceil(pagination.total / limit) ||
        pagination.totalPages > 20 || (page > 1 && pagination.total !== expectedTotal)) {
      throw new Error("Invalid or inconsistent listings pagination; existing vacancies were preserved.");
    }
    expectedTotal = pagination.total;
    for (const listing of body.data) {
      if (!listing || typeof listing.id !== "string" || !listing.id.trim() || ids.has(listing.id) ||
          (listing.gla != null && (typeof listing.gla !== "number" || !Number.isFinite(listing.gla) || listing.gla < 0)) ||
          (listing.ratePerM2 != null && (typeof listing.ratePerM2 !== "number" || !Number.isFinite(listing.ratePerM2) || listing.ratePerM2 < 0))) {
        throw new Error("Invalid or duplicate listing; existing vacancies were preserved.");
      }
      ids.add(listing.id);
    }
    all.push(...body.data);
    const totalPages = pagination.totalPages;
    if (page >= totalPages) break;
    page += 1;
  }

  if (all.length !== expectedTotal) throw new Error("Incomplete listings feed; existing vacancies were preserved.");
  return all;
}

// Business parks/buildings that are dedicated serviced-office space
// regardless of what marketSector says for their individual listings —
// OnPoint units come back with a generic "Office" marketSector even though
// the whole building is serviced offices (meeting rooms, reception,
// furnished/unfurnished options, monthly credits, etc.). Matched against
// both businessPark.name and building.name since it's unclear which one
// carries "OnPoint" consistently across every listing.
const SERVICED_OFFICE_BUILDINGS = ["onpoint"];

// Their marketSector strings aren't documented against our exact enum
// values, so this matches loosely (case-insensitive substring) rather than
// requiring an exact string — "Serviced Office", "serviced_office", and
// "Serviced" should all land on SERVICED_OFFICE, for example. "COMMERCIAL"
// is confirmed (from a real sync run against 1/2/3 Weaver Avenue, 8 Sunbird
// Road, and Midpoint Commercial) to mean ordinary office space in their
// system, not warehouse/industrial. The building/business park name is
// checked first since it's the more reliable signal for known
// serviced-office-only buildings like OnPoint (see above) — marketSector is
// only consulted as a fallback. Anything that still doesn't match falls
// back to OFFICE and is flagged in the sync result's `skipped` list (as a
// warning, not a hard failure) so it's visible in /admin rather than
// silently miscategorised.
function mapSector(listing: ListingRecord): { sector: "WAREHOUSE" | "OFFICE" | "SERVICED_OFFICE"; matched: boolean } {
  const buildingName = (listing.building?.name || "").toLowerCase();
  const businessParkName = (listing.businessPark?.name || "").toLowerCase();
  if (SERVICED_OFFICE_BUILDINGS.some((name) => buildingName.includes(name) || businessParkName.includes(name))) {
    return { sector: "SERVICED_OFFICE", matched: true };
  }

  const value = (listing.marketSector || "").toLowerCase();
  if (value.includes("serviced")) return { sector: "SERVICED_OFFICE", matched: true };
  if (value.includes("warehouse") || value.includes("industrial")) return { sector: "WAREHOUSE", matched: true };
  if (value.includes("office") || value.includes("commercial")) return { sector: "OFFICE", matched: true };
  return { sector: "OFFICE", matched: false };
}

// Splits a listing into its "building" (the shared property/park, e.g.
// "OnPoint") and its "unit" (the specific space, e.g. "OnPoint Suite 4").
// Most standalone listings (a whole warehouse like "1 Kingfisher Avenue")
// have listing.name equal to the building name — nothing distinct to show,
// so unitName stays null. Shared buildings with many individual listings
// (OnPoint above all — the reason this was added: Brett flagged that every
// OnPoint enquiry was landing as just "OnPoint" with no way to tell which
// of the many units someone actually clicked) have a listing.name that
// differs from the building name, so that gets kept as the unit name and
// carried through into the enquiry.
function mapBuildingAndUnit(listing: ListingRecord): { building: string; unitName: string | null } {
  const buildingName = listing.building?.name || listing.businessPark?.name || "";
  const listingName = (listing.name || "").trim();

  if (!buildingName) {
    return { building: listingName || listing.id, unitName: null };
  }
  if (!listingName || listingName.toLowerCase() === buildingName.toLowerCase()) {
    return { building: buildingName, unitName: null };
  }
  return { building: buildingName, unitName: listingName };
}

function mapAvailability(listing: ListingRecord): string {
  if (listing.isAvailableImmediately) return "Immediately";
  return listing.availableFromLabel || listing.availability || listing.availableFrom || "Contact for availability";
}

function mapFeatures(features: ListingRecord["features"]): string[] {
  if (!Array.isArray(features)) return [];
  return features
    .map((f) => (typeof f === "string" ? f : f?.name || f?.label || ""))
    .map((f) => f.trim())
    .filter(Boolean);
}

function mapImage(images: ListingImage[] | undefined): string | null {
  if (!Array.isArray(images) || images.length === 0) return null;
  const hero = images.find((i) => i.isHero);
  return hero?.url || images[0]?.url || null;
}

// A handful of status strings that clearly mean "don't show this" — anything
// else defaults to PUBLISHED. Deliberately permissive: better to show a
// listing that should've been held back (easy to fix by hand in /admin)
// than to silently hide one that should be live because of an unrecognised
// status string.
function mapStatus(raw: string | undefined): "PUBLISHED" | "DRAFT" {
  const value = (raw || "").toLowerCase();
  const hiddenMarkers = ["draft", "withdrawn", "unpublished", "let", "leased", "sold", "unavailable", "archived"];
  return hiddenMarkers.some((marker) => value.includes(marker)) ? "DRAFT" : "PUBLISHED";
}

async function saveResult(result: VacancySyncResult) {
  try {
    await prisma.siteSetting.upsert({
      where: { id: "global" },
      update: { lastVacancySync: result as unknown as object },
      create: { id: "global", lastVacancySync: result as unknown as object },
    });
  } catch {
    result.error = result.error || "Vacancies were saved but the sync result could not be recorded; verification required.";
  }
}

export async function syncVacanciesFromListings(): Promise<VacancySyncResult> {
  const ranAt = new Date().toISOString();
  const result: VacancySyncResult = { ranAt, fetched: 0, created: 0, updated: 0, deprecated: 0, skipped: [] };

  if (!process.env.LISTINGS_API_KEY) {
    result.error = "LISTINGS_API_KEY is not configured — nothing was synced.";
    await saveResult(result);
    return result;
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Serialize cron and editor runs across containers. Fetch inside the lock
      // so an older snapshot cannot overwrite a newer reconciliation.
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(708102026)`;
      const listings = await fetchAllListings();
      const publishedCount = await tx.vacancy.count({ where: { externalId: { not: null }, status: "PUBLISHED" } });
      if (!listings.length && publishedCount > 0) throw new Error("Empty feed would hide all synced vacancies; manual review required.");
      result.fetched = listings.length;
      const seenExternalIds = new Set<string>();

      for (const listing of listings) {
        if (!listing.id) continue;
        seenExternalIds.add(listing.id);

        const { building, unitName } = mapBuildingAndUnit(listing);
        const title = unitName ? `${building} — ${unitName}` : building;
        const { sector, matched } = mapSector(listing);
        if (!matched) {
          result.skipped.push({
            id: listing.id,
            title,
            reason: `Unrecognised marketSector "${listing.marketSector}" — defaulted to Office. Check and correct in /admin/vacancies.`,
          });
        }

        const data = {
          building,
          unitName,
          sector,
          sizeSqm: listing.gla || 0,
          ratePerSqm: listing.ratePerM2 || 0,
          availability: mapAvailability(listing),
          description: listing.description || listing.summary || "",
          features: mapFeatures(listing.features),
          image: mapImage(listing.images),
          status: mapStatus(listing.status) as "PUBLISHED" | "DRAFT",
          lastSyncedAt: new Date(),
        };

        const existing = await tx.vacancy.findUnique({ where: { externalId: listing.id } });
        if (existing) {
          await tx.vacancy.update({ where: { id: existing.id }, data });
          result.updated += 1;
        } else {
          await tx.vacancy.create({ data: { ...data, externalId: listing.id } });
          result.created += 1;
        }
      }

      // Anything previously synced (has an externalId) that the API no longer
      // returned has presumably been let, withdrawn, or removed on their side —
      // soft-hide it here (set to DRAFT) rather than deleting, so an editor can
      // still see and review it in /admin/vacancies instead of it vanishing.
      const previouslySynced = await tx.vacancy.findMany({
        where: { externalId: { not: null } },
        select: { id: true, externalId: true, status: true },
      });
      for (const row of previouslySynced) {
        if (row.externalId && !seenExternalIds.has(row.externalId) && row.status === "PUBLISHED") {
          await tx.vacancy.update({ where: { id: row.id }, data: { status: "DRAFT" } });
          result.deprecated += 1;
        }
      }

    }, { timeout: 300000, maxWait: 10000 });
  } catch (error) {
    // All vacancy writes roll back together; report no committed changes.
    result.created = 0;
    result.updated = 0;
    result.deprecated = 0;
    result.error = error instanceof Error ? error.message : "Vacancy reconciliation failed; existing vacancies were preserved.";
  }

  await saveResult(result);
  return result;
}
