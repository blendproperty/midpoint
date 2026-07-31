"use client";

import { useMemo, useState } from "react";
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

// The presentation asset is a vertical crop of the original 5,500 × 2,792 map.
// Convert the original pin Y coordinates into the cropped 5,500 × 1,700 canvas.
function mapY(y: number) {
  return ((y / 100) * 2792 - 500) / 1700 * 100;
}

export default function SiteMap({ availability }: { availability: Record<number, MapAvailability> }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Listing | null>(null);
  const visibleListings = useMemo(() => listings.filter((listing) => belongsToFilter(listing, filter)), [filter]);

  const chooseFilter = (nextFilter: Filter) => {
    setFilter(nextFilter);
    setSelected(null);
  };

  const selectedAvailability = selected
    ? availability[selected.pin] || { count: 0, totalSqm: 0, nextAvailable: null }
    : null;

  return (
    <div>
      <div className="flex flex-wrap gap-2" aria-label="Filter map destinations">
        {filters.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => chooseFilter(option.value)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filter === option.value ? "bg-midpoint-dark text-white" : "border border-midpoint-dark/15 bg-white text-midpoint-dark hover:border-midpoint-dark/40"}`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="relative mt-5 overflow-hidden rounded-card bg-white shadow-[0_24px_70px_rgba(4,35,34,0.12)]">
        <div className="overflow-x-auto">
          <div className="relative aspect-[5500/1700] min-w-[1050px] bg-white lg:min-w-0">
            <Image
              src="/images/sitemap/estate-map.jpg"
              alt="Complete map of Midpoint Business Park showing the main and tenant entrances"
              fill
              priority
              sizes="(min-width: 1800px) 1800px, 100vw"
              className="object-cover"
            />

            {visibleListings.map((listing) => {
              const isSelected = selected?.pin === listing.pin;
              const live = availability[listing.pin]?.count || 0;
              return (
                <button
                  key={listing.pin}
                  type="button"
                  onClick={() => setSelected(listing)}
                  style={{ left: `${listing.x}%`, top: `${mapY(listing.y)}%` }}
                  className={`absolute z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-xs font-bold shadow-lg transition md:h-11 md:w-11 md:text-sm ${isSelected ? "border-midpoint-dark bg-midpoint-cyan text-midpoint-dark ring-4 ring-midpoint-cyan/25" : "border-midpoint-cyan bg-white text-midpoint-dark hover:bg-midpoint-cyan"}`}
                  aria-label={`Select ${listing.name}${live ? `, ${live} spaces available` : ""}`}
                  aria-pressed={isSelected}
                >
                  {listing.pin}
                </button>
              );
            })}

            {!selected && (
              <div className="absolute bottom-4 left-4 rounded-full bg-midpoint-dark/90 px-4 py-2 text-xs font-medium text-white backdrop-blur">
                Select a marker or property below
              </div>
            )}
          </div>
        </div>

        {selected && selectedAvailability && (
          <aside className="z-20 flex flex-col bg-midpoint-dark text-white min-[1700px]:absolute min-[1700px]:bottom-4 min-[1700px]:right-4 min-[1700px]:top-4 min-[1700px]:max-h-[calc(100%-2rem)] min-[1700px]:w-[430px] min-[1700px]:overflow-hidden min-[1700px]:rounded-2xl min-[1700px]:shadow-2xl">
            <div className="relative h-44 shrink-0 overflow-hidden min-[1700px]:rounded-t-2xl">
              <Image src={selected.image} alt={selected.name} fill sizes="430px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-midpoint-dark/70 to-transparent" />
              <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-midpoint-dark">Map point {selected.pin}</span>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close property details"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-midpoint-dark/85 text-xl text-white backdrop-blur hover:bg-midpoint-dark"
              >
                ×
              </button>
              <span className={`absolute bottom-5 left-5 rounded-full px-3 py-1 text-xs font-semibold ${selectedAvailability.count > 0 ? "bg-midpoint-cyan text-midpoint-dark" : "bg-white/15 text-white backdrop-blur"}`}>
                {selectedAvailability.count > 0 ? `${selectedAvailability.count} available now` : "Explore this destination"}
              </span>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-midpoint-cyan">{selected.category}</p>
              <h3 className="mt-2 text-3xl font-semibold">{selected.name}</h3>
              <p className="mt-3 text-sm leading-6 text-white/65">{selected.description}</p>

              {selectedAvailability.count > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-4 border-y border-white/10 py-3">
                  <div><p className="text-xs text-white/45">Available area</p><p className="mt-1 font-semibold">{formatArea(selectedAvailability.totalSqm)}</p></div>
                  <div><p className="text-xs text-white/45">Next availability</p><p className="mt-1 font-semibold">{selectedAvailability.nextAvailable}</p></div>
                </div>
              )}

              <div className="mt-auto flex flex-wrap gap-3 pt-4">
                <Link href={selected.href} className="rounded-full bg-midpoint-cyan px-5 py-3 text-sm font-semibold text-midpoint-dark">View details</Link>
                <Link href={`/contact-us?space=${encodeURIComponent(selected.name)}#Contact`} className="rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white">Arrange viewing</Link>
              </div>
            </div>
          </aside>
        )}
      </div>

      <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
        {visibleListings.map((listing) => {
          const isSelected = selected?.pin === listing.pin;
          const live = availability[listing.pin]?.count || 0;
          return (
            <button key={listing.pin} type="button" onClick={() => setSelected(listing)} className={`min-w-[220px] rounded-2xl border p-4 text-left transition ${isSelected ? "border-midpoint-cyan bg-midpoint-dark text-white" : "border-midpoint-dark/10 bg-white text-midpoint-dark hover:border-midpoint-dark/30"}`}>
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
