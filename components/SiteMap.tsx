import Image from "next/image";
import Link from "next/link";
import { listings, type Listing } from "@/lib/listings";

export type MapAvailability = {
  count: number;
  totalSqm: number;
  nextAvailable: string | null;
  spaces: { id: string; label: string; href: string; sizeSqm: number }[];
};

type Filter = "all" | "offices" | "warehouses" | "flexible" | "lifestyle";

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All destinations" },
  { value: "offices", label: "Offices" },
  { value: "warehouses", label: "Warehouses" },
  { value: "flexible", label: "Serviced offices" },
  { value: "lifestyle", label: "Amenities & living" },
];

function filterTokens(listing: Listing) {
  const category = listing.category.toLowerCase();
  const tokens = ["all"];
  if (category.includes("office") && !category.includes("serviced")) tokens.push("offices");
  if (category.includes("warehouse") || category.includes("development")) tokens.push("warehouses");
  if (category.includes("serviced")) tokens.push("flexible");
  if (category.includes("entertainment") || category.includes("accommodation")) tokens.push("lifestyle");
  return tokens.join(" ");
}

function formatArea(area: number) {
  return `${Math.round(area).toLocaleString("en-ZA")} m²`;
}

function mapY(y: number) {
  return ((y / 100) * 2792 - 500) / 1700 * 100;
}

export default function SiteMap({ availability }: { availability: Record<number, MapAvailability> }) {
  const visibleListings = listings
    .filter((listing) => listing.evergreen || (availability[listing.pin]?.count || 0) > 0)
    .sort((a, b) => a.pin - b.pin);

  return (
    <div className="site-map">
      {filters.map((option) => (
        <input
          key={option.value}
          id={`map-filter-${option.value}`}
          className="sr-only"
          type="radio"
          name="map-filter"
          defaultChecked={option.value === "all"}
        />
      ))}

      <div className="map-filter-labels flex flex-wrap gap-2" aria-label="Filter map destinations">
        {filters.map((option) => (
          <label
            key={option.value}
            htmlFor={`map-filter-${option.value}`}
            className="cursor-pointer rounded-full border border-midpoint-dark/15 bg-white px-4 py-2 text-sm font-semibold text-midpoint-dark transition hover:border-midpoint-dark/40"
          >
            {option.label}
          </label>
        ))}
      </div>

      <div className="map-content">
        <div className="relative mt-5 overflow-hidden rounded-card bg-white shadow-[0_24px_70px_rgba(4,35,34,0.12)]">
          <div className="overflow-x-auto">
            <div className="relative aspect-[5500/1700] min-w-[1050px] bg-white lg:min-w-0">
              <Image
                src="/images/sitemap/estate-map.jpg"
                alt="Complete map of Midpoint Business Park showing the main and tenant entrances"
                fill
                sizes="(min-width: 1800px) 1800px, 100vw"
                className="object-cover"
              />

              {visibleListings.map((listing) => {
                const live = availability[listing.pin]?.count || 0;
                return (
                  <a
                    key={listing.pin}
                    href={`#map-point-${listing.pin}`}
                    data-map-filter={filterTokens(listing)}
                    style={{ left: `${listing.x}%`, top: `${mapY(listing.y)}%` }}
                    className="absolute z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-midpoint-cyan bg-white text-xs font-bold text-midpoint-dark shadow-lg transition hover:bg-midpoint-cyan md:h-11 md:w-11 md:text-sm"
                    aria-label={`Open ${listing.name} details${live ? `, ${live} spaces available` : ""}`}
                  >
                    {listing.pin}
                  </a>
                );
              })}

              <div className="absolute bottom-4 left-4 rounded-full bg-midpoint-dark/90 px-4 py-2 text-xs font-medium text-white backdrop-blur">
                Select a marker or property below
              </div>
            </div>
          </div>

          {visibleListings.map((listing) => {
            const selectedAvailability = availability[listing.pin] || { count: 0, totalSqm: 0, nextAvailable: null, spaces: [] };
            return (
              <aside
                key={listing.pin}
                id={`map-point-${listing.pin}`}
                className="map-detail hidden flex-col bg-midpoint-dark text-white target:flex min-[1700px]:absolute min-[1700px]:bottom-4 min-[1700px]:right-4 min-[1700px]:top-4 min-[1700px]:z-20 min-[1700px]:w-[430px] min-[1700px]:overflow-hidden min-[1700px]:rounded-2xl min-[1700px]:shadow-2xl"
              >
                <div className="relative h-36 shrink-0 overflow-hidden min-[1700px]:rounded-t-2xl">
                  <Image src={listing.image} alt={listing.name} fill sizes="430px" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-midpoint-dark/70 to-transparent" />
                  <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-midpoint-dark">Map point {listing.pin}</span>
                  <a href="#explore" aria-label="Close property details" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-midpoint-dark/85 text-xl text-white backdrop-blur hover:bg-midpoint-dark">×</a>
                  <span className={`absolute bottom-5 left-5 rounded-full px-3 py-1 text-xs font-semibold ${selectedAvailability.count > 0 ? "bg-midpoint-cyan text-midpoint-dark" : "bg-white/15 text-white backdrop-blur"}`}>
                    {selectedAvailability.count > 0 ? `${selectedAvailability.count} available now` : "Explore this destination"}
                  </span>
                </div>

                <div className="flex min-h-0 flex-1 flex-col p-4">
                  <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-midpoint-cyan">{listing.category}</p>
                    <h3 className="mt-1.5 text-2xl font-semibold">{listing.name}</h3>
                    <p className="mt-2 text-sm leading-5 text-white/65">{listing.description}</p>

                    {selectedAvailability.count > 0 && (
                      <div className="mt-3 grid grid-cols-2 gap-4 border-y border-white/10 py-2.5">
                        <div><p className="text-xs text-white/45">Available area</p><p className="mt-1 font-semibold">{formatArea(selectedAvailability.totalSqm)}</p></div>
                        <div><p className="text-xs text-white/45">Next availability</p><p className="mt-1 font-semibold">{selectedAvailability.nextAvailable}</p></div>
                      </div>
                    )}

                    {selectedAvailability.spaces.length > 0 && (
                      <div className="mt-3 max-h-24 space-y-2 overflow-y-auto pr-1">
                        {selectedAvailability.spaces.map((space) => (
                          <Link key={space.id} href={space.href} className="flex items-center justify-between rounded-xl bg-white/10 px-3 py-2 text-xs hover:bg-white/15">
                            <span className="truncate pr-3">{space.label}</span><span className="shrink-0 text-white/55">{formatArea(space.sizeSqm)}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex shrink-0 flex-wrap gap-2 border-t border-white/10 pt-3">
                    <Link href={listing.evergreen ? listing.href : (selectedAvailability.spaces[0]?.href || "/vacancies")} className="rounded-full bg-midpoint-cyan px-4 py-2.5 text-sm font-semibold text-midpoint-dark">
                      {listing.evergreen ? "Explore destination" : `View available space${selectedAvailability.count === 1 ? "" : "s"}`}
                    </Link>
                    <Link href={`/contact-us?space=${encodeURIComponent(listing.name)}#Contact`} className="rounded-full border border-white/25 px-4 py-2.5 text-sm font-semibold text-white">Arrange viewing</Link>
                  </div>
                </div>
              </aside>
            );
          })}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleListings.map((listing) => {
            const live = availability[listing.pin]?.count || 0;
            return (
              <a key={listing.pin} href={`#map-point-${listing.pin}`} data-map-filter={filterTokens(listing)} className="min-w-0 rounded-2xl border border-midpoint-dark/10 bg-white p-4 text-left text-midpoint-dark transition hover:border-midpoint-dark/30">
                <span className="flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-midpoint-cyan">{listing.category}</span>
                  <span aria-label={`Map point ${listing.pin}`} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-midpoint-cyan bg-midpoint-cyan/10 text-sm font-bold text-midpoint-dark">{listing.pin}</span>
                </span>
                <span className="mt-1 block font-semibold">{listing.name}</span>
                <span className="mt-2 block text-xs text-midpoint-grey-400">{live > 0 ? `${live} space${live === 1 ? "" : "s"} available` : "View destination"}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
