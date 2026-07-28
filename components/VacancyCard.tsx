"use client";

import Image from "next/image";
import Link from "next/link";
import type { VacancyListing } from "@/lib/vacancies";

function formatSize(n: number) {
  return `${n.toLocaleString("en-ZA", { maximumFractionDigits: 2 })} m²`;
}

// Fires a beacon when "Enquire" is clicked so /admin can show which listings
// are attracting the most interest — doesn't block or delay the navigation.
// Uses the specific unit name where one exists (e.g. an OnPoint suite)
// rather than just the shared building name, so the "Vacancy interest"
// breakdown on the dashboard can tell individual units apart.
function trackVacancyEnquire(vacancyId: string, spaceLabel: string) {
  const body = JSON.stringify({ vacancyId, building: spaceLabel, type: "ENQUIRE" });
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/track/vacancy-event", new Blob([body], { type: "application/json" }));
  } else {
    fetch("/api/track/vacancy-event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  }
}

// ContactForm's "I'm interested in:" dropdown only has these three exact
// option values — map the vacancy's sector label onto the matching option so
// it's pre-selected when someone arrives from a specific listing.
const SECTOR_TO_INTEREST: Record<string, string> = {
  Warehouse: "Warehouse space",
  Office: "Office space",
  "Serviced office": "Serviced offices",
};

// The label carried through to the enquiry — the specific unit when there
// is one (e.g. "OnPoint — Suite 4"), otherwise just the building name.
// Buildings like OnPoint have many individual listings that would otherwise
// all show up as the same bare "OnPoint", making it impossible to tell
// which actual space someone enquired about.
function spaceLabel(listing: VacancyListing) {
  return listing.unitName ? `${listing.building} — ${listing.unitName}` : listing.building;
}

function enquireHref(listing: VacancyListing) {
  const params = new URLSearchParams();
  params.set("space", spaceLabel(listing));
  const interest = SECTOR_TO_INTEREST[listing.sector];
  if (interest) params.set("interest", interest);
  return `/contact-us?${params.toString()}#Contact`;
}

export default function VacancyCard({ listing }: { listing: VacancyListing }) {
  return (
    <div className="overflow-hidden rounded-card bg-midpoint-dark text-white">
      <div className="relative h-56 w-full">
        <Image src={listing.image} alt={listing.building} fill className="object-cover" />
      </div>
      <div className="p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Building</p>
            <h3 className="text-xl font-semibold md:text-2xl">{listing.building}</h3>
            {listing.unitName && <p className="mt-0.5 text-sm font-medium text-midpoint-cyan">{listing.unitName}</p>}
          </div>
          <span className="rounded-full bg-midpoint-cyan/20 px-3 py-1 text-xs font-medium text-midpoint-cyan">
            {listing.sector}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 border-y border-white/10 py-4 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Size</p>
            <p className="mt-1 font-semibold">{formatSize(listing.sizeSqm)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Rate /m²</p>
            <p className="mt-1 font-semibold">R{listing.ratePerSqm}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Availability</p>
            <p className="mt-1 font-semibold">{listing.availability}</p>
          </div>
        </div>

        <p className="mt-4 text-sm text-white/70">{listing.description}</p>

        <ul className="mt-4 space-y-1 text-sm text-white/70">
          {listing.features.map((f) => (
            <li key={f}>• {f}</li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={enquireHref(listing)}
            onClick={() => trackVacancyEnquire(listing.id, spaceLabel(listing))}
            className="rounded-full bg-midpoint-cyan px-5 py-2.5 text-sm font-semibold text-midpoint-dark transition hover:opacity-90"
          >
            Enquire
          </Link>
          <Link
            href="/#explore"
            className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
          >
            See map view
          </Link>
        </div>
      </div>
    </div>
  );
}
