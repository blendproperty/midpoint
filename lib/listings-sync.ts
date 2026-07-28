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
// is a no-op rather than an error — same "optional integration" pattern as
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
  skipped: { id: string; reason: string }[];
  error?: string;
};

function apiBaseUrl(): string {
  return (process.env.LISTINGS_API_BASE_URL || "https://listings.blendproperty.co.za").replace(/\/$/, "");
}

async function fetchAllListings(): Promise<ListingRecord[]> {
  const apiKey = process.env.LISTINGS_API_KEY;
  if (!apiKey) return [];

  const all: ListingRecord[] = [];
  let page = 1;
  const limit = 100;

  while (true) {
    const url = new URL(`${apiBaseUrl()}/api/public/v1/midpoint/listings`);
    url.searchParams.set("page", String(page));
    url.searchParams.set("limit", String(limit));

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`listings.blendproperty.co.za returned ${res.status}`);
    }
    const body = (await res.json()) as ListingsResponse;
    all.push(...(body.data || []));

    const totalPages = body.pagination?.totalPages ?? 1;
    if (page >= totalPages) break;
    page += 1;
  }

  return all;
}

// Their marketSector strings aren't documented against our exact enum
// values, so this matches loosely (case-insensitive substring) rather than
// requiring an exact string — "Serviced Office", "serviced_office", and
// "Serviced" should all land on SERVICED_OFFICE, for example. Anything that
// doesn't match any known sector falls back to OFFICE and is flagged in the
// sync result's `skipped` list (as a warning, not a hard failure) so it's
// visible in /admin rather than silently miscategorised.
function mapSector(raw: string | undefined): { sector: "WAREHOUSE" | "OFFICE" | "SERVICED_OFFICE"; matched: boolean } {
  const value = (raw || "").toLowerCase();
  if (value.includes("serviced")) return { sector: "SERVICED_OFFICE", matched: true };
  if (value.includes("warehouse") || value.includes("industrial")) return { sector: "WAREHOUSE", matched: true };
  if (value.includes("office")) return { sector: "OFFICE", matched: true };
  return { sector: "OFFICE", matched: false };
}

function mapAvailability(listing: ListingRecord): string {
  if (listing.isAvailableImmediately) return "Immediately";
  return listing.availableFromLabel || listing.availableFrom || "Contact for availability";
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

export async function syncVacanciesFromListings(): Promise<VacancySyncResult> {
  const ranAt = new Date().toISOString();
  const result: VacancySyncResult = { ranAt, fetched: 0, created: 0, updated: 0, deprecated: 0, skipped: [] };

  if (!process.env.LISTINGS_API_KEY) {
    result.error = "LISTINGS_API_KEY is not configured — nothing was synced.";
    return result;
  }

  let listings: ListingRecord[];
  try {
    listings = await fetchAllListings();
  } catch (err) {
    result.error = err instanceof Error ? err.message : "Failed to reach listings.blendproperty.co.za";
    return result;
  }

  result.fetched = listings.length;
  const seenExternalIds = new Set<string>();

  for (const listing of listings) {
    if (!listing.id) continue;
    seenExternalIds.add(listing.id);

    const { sector, matched } = mapSector(listing.marketSector);
    if (!matched) {
      result.skipped.push({
        id: listing.id,
        reason: `Unrecognised marketSector "${listing.marketSector}" — defaulted to Office. Check and correct in /admin/vacancies.`,
      });
    }

    const data = {
      building: listing.building?.name || listing.name || "Untitled space",
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

    const existing = await prisma.vacancy.findUnique({ where: { externalId: listing.id } });
    if (existing) {
      await prisma.vacancy.update({ where: { id: existing.id }, data });
      result.updated += 1;
    } else {
      await prisma.vacancy.create({ data: { ...data, externalId: listing.id } });
      result.created += 1;
    }
  }

  // Anything previously synced (has an externalId) that the API no longer
  // returned has presumably been let, withdrawn, or removed on their side —
  // soft-hide it here (set to DRAFT) rather than deleting, so an editor can
  // still see and review it in /admin/vacancies instead of it vanishing.
  const previouslySynced = await prisma.vacancy.findMany({
    where: { externalId: { not: null } },
    select: { id: true, externalId: true, status: true },
  });
  for (const row of previouslySynced) {
    if (row.externalId && !seenExternalIds.has(row.externalId) && row.status === "PUBLISHED") {
      await prisma.vacancy.update({ where: { id: row.id }, data: { status: "DRAFT" } });
      result.deprecated += 1;
    }
  }

  return result;
}
