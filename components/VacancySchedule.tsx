"use client";

import { useMemo, useState } from "react";
import VacancyCard from "@/components/VacancyCard";
import type { VacancyListing, VacancySector } from "@/lib/vacancies";

type SectorFilter = "ALL" | VacancySector;
type SizeFilter = "ALL" | "UP_TO_250" | "250_500" | "500_1000" | "OVER_1000";

const sectors: { value: SectorFilter; label: string }[] = [
  { value: "ALL", label: "All spaces" },
  { value: "Office", label: "Commercial / Office" },
  { value: "Warehouse", label: "Warehousing" },
  { value: "Serviced office", label: "Serviced offices" },
];

function matchesSize(size: number, filter: SizeFilter) {
  if (filter === "UP_TO_250") return size <= 250;
  if (filter === "250_500") return size > 250 && size <= 500;
  if (filter === "500_1000") return size > 500 && size <= 1000;
  if (filter === "OVER_1000") return size > 1000;
  return true;
}

export default function VacancySchedule({ listings, whatsappUrls }: { listings: VacancyListing[]; whatsappUrls: Record<string, string> }) {
  const [sector, setSector] = useState<SectorFilter>("ALL");
  const [size, setSize] = useState<SizeFilter>("ALL");
  const [availability, setAvailability] = useState("ALL");
  const [query, setQuery] = useState("");

  const availabilityOptions = useMemo(
    () => Array.from(new Set(listings.map((listing) => listing.availability).filter(Boolean))),
    [listings],
  );
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return listings.filter((listing) =>
      (sector === "ALL" || listing.sector === sector) &&
      matchesSize(listing.sizeSqm, size) &&
      (availability === "ALL" || listing.availability === availability) &&
      (!needle || `${listing.building} ${listing.unitName || ""} ${listing.description}`.toLowerCase().includes(needle)),
    );
  }, [availability, listings, query, sector, size]);

  const reset = () => { setSector("ALL"); setSize("ALL"); setAvailability("ALL"); setQuery(""); };

  return (
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <div className="rounded-card bg-[#f3f7f6] p-5 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-midpoint-grey-400">Live vacancy search</p>
        <h2 className="mt-2 text-2xl font-bold text-midpoint-dark">Find your space</h2>
        <div className="mt-5 flex flex-wrap gap-2" aria-label="Filter by space type">
          {sectors.map((option) => (
            <button key={option.value} type="button" onClick={() => setSector(option.value)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${sector === option.value ? "bg-midpoint-dark text-white" : "border border-midpoint-dark/15 bg-white text-midpoint-dark"}`}>
              {option.label}
            </button>
          ))}
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_2fr_auto]">
          <select aria-label="Filter by size" value={size} onChange={(event) => setSize(event.target.value as SizeFilter)} className="rounded-xl border border-midpoint-dark/15 bg-white px-4 py-3 text-sm text-midpoint-dark">
            <option value="ALL">Any size</option><option value="UP_TO_250">Up to 250 m²</option><option value="250_500">250–500 m²</option><option value="500_1000">500–1,000 m²</option><option value="OVER_1000">Over 1,000 m²</option>
          </select>
          <select aria-label="Filter by availability" value={availability} onChange={(event) => setAvailability(event.target.value)} className="rounded-xl border border-midpoint-dark/15 bg-white px-4 py-3 text-sm text-midpoint-dark">
            <option value="ALL">Any availability</option>{availabilityOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by property or unit name..." className="rounded-xl border border-midpoint-dark/15 bg-white px-4 py-3 text-sm text-midpoint-dark" />
          <button type="button" onClick={reset} className="rounded-xl px-4 py-3 text-sm font-semibold text-midpoint-dark underline">Reset</button>
        </div>
      </div>

      <p className="mt-8 text-sm text-midpoint-grey-400"><strong className="text-midpoint-dark">{filtered.length}</strong> live listing{filtered.length === 1 ? "" : "s"} matching your filters.</p>
      {filtered.length > 0 ? <div className="mt-5 grid gap-6 md:grid-cols-2">{filtered.map((listing) => <VacancyCard key={listing.id} listing={listing} whatsappUrl={whatsappUrls[listing.id]} />)}</div> : <div className="mt-5 rounded-card border border-midpoint-grey-100 p-10 text-center text-midpoint-grey-400">No spaces match those filters. Reset the filters or contact our leasing team.</div>}
    </section>
  );
}
