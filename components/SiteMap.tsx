"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { listings, type Listing } from "@/lib/listings";

export type MapAvailability = {
  count: number;
  totalSqm: number;
  nextAvailable: string | null;
};

type Filter = "all" | "offices" | "warehouses" | "flexible" | "lifestyle";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All destinations" },
  { value: "offices", label: "Offices" },
  { value: "warehouses", label: "Warehouses" },
  { value: "flexible", label: "Serviced offices" },
  { value: "lifestyle", label: "Amenities & living" },
];

function belongsToFilter(listing: Listing, filter: Filter) {
  const category = listing.category.toLowerCase();
  if (filter === "all") return true;
  if (filter === "offices") return category.includes("office") && !category.includes("serviced");
  if (filter === "warehouses") return category.includes("warehouse") || category.includes("development");
  if (filter === "flexible") return category.includes("serviced");
  return category.includes("entertainment") || category.includes("accommodation");
}

function formatArea(area: number) {
  return `${Math.round(area).toLocaleString("en-ZA")} m²`;
}

export default function SiteMap({ availability }: { availability: Record<number, MapAvailability> }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Listing>(listings[0]);
  const visibleListings = useMemo(() => listings.filter((listing) => belongsToFilter(listing, filter)), [filter]);

  useEffect(() => {
    if (!visibleListings.some((listing) => listing.pin === selected.pin)) {
      setSelected(visibleListings[0]);
    }
  }, [selected.pin, visibleListings]);

  const selectedAvailability = availability[selected.pin] || { count: 0, totalSqm: 0, nextAvailable: null };
  const enquiryHref = `/contact-us?space=${encodeURIComponent(selected.name)}#Contact`;

  return (
    <div>
      <div className="flex flex-wrap gap-2" aria-label="Filter map destinations">
        {filters.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filter === option.value ? "bg-midpoint-dark text-white" : "border border-midpoint-dark/15 bg-white text-midpoint-dark hover:border-midpoint-dark/40"}`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid overflow-hidden rounded-card bg-white shadow-[0_24px_70px_rgba(4,35,34,0.12)] lg:grid-cols-[1.55fr_0.75fr]">
        <div className="relative min-h-[420px] overflow-hidden bg-white lg:min-h-[620px]">
          <div className="absolute left-1/2 top-[35%] aspect-[5500/2792] w-[185%] -translate-x-1/2 -translate-y-1/2">
            <Image src="/images/sitemap/aerial.jpg" alt="Interactive map of Midpoint Business Park" fill priority className="object-cover" />
            {visibleListings.map((listing) => {
              const isSelected = selected.pin === listing.pin;
              const live = availability[listing.pin]?.count || 0;
              return (
                <button
                  key={listing.pin}
                  type="button"
                  onClick={() => setSelected(listing)}
                  style={{ left: `${listing.x}%`, top: `${listing.y}%`, transform: "translate(-50%, -50%) scale(0.54)" }}
                  className={`absolute z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 text-sm font-bold shadow-lg transition ${isSelected ? "border-midpoint-dark bg-midpoint-cyan text-midpoint-dark ring-4 ring-midpoint-cyan/25" : "border-midpoint-cyan bg-white text-midpoint-dark hover:bg-midpoint-cyan"}`}
                  aria-label={`Select ${listing.name}${live ? `, ${live} spaces available` : ""}`}
                  aria-pressed={isSelected}
                >
                  {listing.pin}
                </button>
              );
            })}
          </div>
          <div className="absolute bottom-4 left-4 rounded-full bg-midpoint-dark/90 px-4 py-2 text-xs font-medium text-white backdrop-blur">
            Select a numbered marker to explore
          </div>
        </div>

        <aside className="flex min-h-[520px] flex-col bg-midpoint-dark text-white lg:min-h-[620px]">
          <div className="relative h-56 shrink-0 overflow-hidden">
            <Image src={selected.image} alt={selected.name} fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-midpoint-dark/70 to-transparent" />
            <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-midpoint-dark">Map point {selected.pin}</span>
            <span className={`absolute bottom-5 left-5 rounded-full px-3 py-1 text-xs font-semibold ${selectedAvailability.count > 0 ? "bg-midpoint-cyan text-midpoint-dark" : "bg-white/15 text-white backdrop-blur"}`}>
              {selectedAvailability.count > 0 ? `${selectedAvailability.count} available now` : "Explore this destination"}
            </span>
          </div>

          <div className="flex flex-1 flex-col p-6 md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-midpoint-cyan">{selected.category}</p>
            <h3 className="mt-2 text-3xl font-semibold">{selected.name}</h3>
            <p className="mt-4 text-sm leading-6 text-white/65">{selected.description}</p>

            {selectedAvailability.count > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-4 border-y border-white/10 py-5">
                <div><p className="text-xs text-white/45">Available area</p><p className="mt-1 font-semibold">{formatArea(selectedAvailability.totalSqm)}</p></div>
                <div><p className="text-xs text-white/45">Next availability</p><p className="mt-1 font-semibold">{selectedAvailability.nextAvailable}</p></div>
              </div>
            )}

            <ul className="mt-5 space-y-2 text-sm text-white/65">
              {selected.features.slice(0, 3).map((feature) => <li key={feature} className="flex gap-2"><span className="text-midpoint-cyan">•</span><span>{feature}</span></li>)}
            </ul>

            <div className="mt-auto flex flex-wrap gap-3 pt-7">
              <Link href={selected.href} className="rounded-full bg-midpoint-cyan px-5 py-3 text-sm font-semibold text-midpoint-dark">View details</Link>
              <Link href={enquiryHref} className="rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white">Arrange inspection</Link>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
        {visibleListings.map((listing) => {
          const isSelected = selected.pin === listing.pin;
          const live = availability[listing.pin]?.count || 0;
          return (
            <button key={listing.pin} type="button" onClick={() => setSelected(listing)} className={`min-w-[210px] rounded-2xl border p-4 text-left transition ${isSelected ? "border-midpoint-cyan bg-midpoint-dark text-white" : "border-midpoint-dark/10 bg-white text-midpoint-dark hover:border-midpoint-dark/30"}`}>
              <span className="text-xs font-semibold text-midpoint-cyan">{listing.category}</span>
              <span className="mt-1 block font-semibold">{listing.name}</span>
              <span className={`mt-2 block text-xs ${isSelected ? "text-white/55" : "text-midpoint-grey-400"}`}>{live > 0 ? `${live} space${live === 1 ? "" : "s"} available` : "View destination"}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
