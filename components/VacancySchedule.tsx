"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calculator, SlidersHorizontal } from "lucide-react";
import VacancyCard from "@/components/VacancyCard";
import type { VacancyListing, VacancySector } from "@/lib/vacancy-shared";
import type { SpaceCalculatorValues, SpaceRange } from "@/lib/space-calculator";
import { trackAnalyticsEvent } from "@/lib/analytics";

type SectorFilter = "ALL" | VacancySector;
type SizeFilter = "ALL" | "UP_TO_250" | "250_500" | "500_1000" | "OVER_1000" | "CALCULATED";

const sectors: { value: SectorFilter; label: string }[] = [
  { value: "ALL", label: "All spaces" },
  { value: "Office", label: "Commercial / Office" },
  { value: "Warehouse", label: "Warehousing" },
  { value: "Serviced office", label: "Serviced offices" },
];

function matchesSize(size: number, filter: SizeFilter, calculatedRange: SpaceRange | null) {
  if (filter === "CALCULATED" && calculatedRange) return size >= calculatedRange.min && size <= calculatedRange.max;
  if (filter === "UP_TO_250") return size <= 250;
  if (filter === "250_500") return size > 250 && size <= 500;
  if (filter === "500_1000") return size > 500 && size <= 1000;
  if (filter === "OVER_1000") return size > 1000;
  return true;
}

type Props = {
  listings: VacancyListing[];
  whatsappUrls: Record<string, string>;
  initialQuery?: string;
  initialSector?: SectorFilter;
  initialSize?: SizeFilter;
  initialAvailability?: string;
  initialCalculatedRange?: SpaceRange | null;
  calculatorValues?: SpaceCalculatorValues;
};

export default function VacancySchedule({ listings, whatsappUrls, initialQuery = "", initialSector = "ALL", initialSize = "ALL", initialAvailability = "ALL", initialCalculatedRange = null, calculatorValues = { employees: 20, privateOffices: 2, meetingRooms: 2, collaborationSeats: 8 } }: Props) {
  const [sort, setSort] = useState("DEFAULT");
  const [sector, setSector] = useState<SectorFilter>(initialSector);
  const [size, setSize] = useState<SizeFilter>(initialSize);
  const [availability, setAvailability] = useState(initialAvailability);
  const [query, setQuery] = useState(initialQuery);
  const [calculatedRange, setCalculatedRange] = useState<SpaceRange | null>(initialCalculatedRange);

  const availabilityOptions = useMemo(
    () => Array.from(new Set(listings.map((listing) => listing.availability).filter(Boolean))),
    [listings],
  );
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matches = listings.filter((listing) =>
      (sector === "ALL" || listing.sector === sector) &&
      matchesSize(listing.sizeSqm, size, calculatedRange) &&
      (availability === "ALL" || listing.availability === availability) &&
      (!needle || `${listing.building} ${listing.unitName || ""} ${listing.description}`.toLowerCase().includes(needle)),
    );
    if (sort === "SIZE_ASC") matches.sort((a, b) => (a.sizeSqm || Infinity) - (b.sizeSqm || Infinity));
    if (sort === "SIZE_DESC") matches.sort((a, b) => b.sizeSqm - a.sizeSqm);
    if (sort === "RATE_ASC") matches.sort((a, b) => (a.ratePerSqm || Infinity) - (b.ratePerSqm || Infinity));
    return matches;
  }, [sort, availability, calculatedRange, listings, query, sector, size]);

  const reset = () => { setSector("ALL"); setSize("ALL"); setAvailability("ALL"); setQuery(""); setCalculatedRange(null); setSort("DEFAULT"); };
  const sectorHref = (value: SectorFilter) => value === "ALL" ? "/vacancies" : `/vacancies?sector=${encodeURIComponent(value)}`;

  return (
    <section className="mx-auto max-w-7xl px-6 pb-20">
      <div className="rounded-2xl border border-midpoint-dark/10 bg-white p-5 shadow-sm md:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-midpoint-grey-400">Spaces to let</p>
        <h2 className="mt-2 text-2xl font-bold text-midpoint-dark">Find your space <SlidersHorizontal aria-hidden="true" className="ml-2 inline h-5 w-5 text-midpoint-grey-400" /></h2>
        <div className="mt-5 flex flex-wrap gap-2" aria-label="Filter by space type">
          {sectors.map((option) => (
            <a key={option.value} href={sectorHref(option.value)} aria-current={sector === option.value ? "true" : undefined} onClick={(event) => { event.preventDefault(); setSector(option.value); }} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${sector === option.value ? "bg-midpoint-dark text-white" : "border border-midpoint-dark/15 bg-white text-midpoint-dark"}`}>
              {option.label}
            </a>
          ))}
        </div>
        <form action="/vacancies" method="get" onSubmit={(event) => {
          const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
          trackAnalyticsEvent(submitter?.value === "1" ? "calculator_applied" : "vacancy_search", {
            sector, size_filter: size, availability, query_used: Boolean(query.trim()), results_count: filtered.length,
          });
        }} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr_auto_auto_auto]">
          <input type="hidden" name="sector" value={sector === "ALL" ? "" : sector} />
          <select name="size" aria-label="Filter by size" value={size} onChange={(event) => setSize(event.target.value as SizeFilter)} className="rounded-xl border border-midpoint-dark/15 bg-white px-4 py-3 text-sm text-midpoint-dark">
            <option value="ALL">Any size</option>{calculatedRange && <option value="CALCULATED">{calculatedRange.min.toLocaleString("en-ZA")}–{calculatedRange.max.toLocaleString("en-ZA")} m²</option>}<option value="UP_TO_250">Up to 250 m²</option><option value="250_500">250–500 m²</option><option value="500_1000">500–1,000 m²</option><option value="OVER_1000">Over 1,000 m²</option>
          </select>
          <select name="availability" aria-label="Filter by availability" value={availability} onChange={(event) => setAvailability(event.target.value)} className="rounded-xl border border-midpoint-dark/15 bg-white px-4 py-3 text-sm text-midpoint-dark">
            <option value="ALL">Any availability</option>{availabilityOptions.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
          <input type="search" name="q" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search vacancies" placeholder="Search by property or unit name..." className="rounded-xl border border-midpoint-dark/15 bg-white px-4 py-3 text-sm text-midpoint-dark" />
          <button type="submit" className="rounded-xl bg-midpoint-dark px-5 py-3 text-sm font-semibold text-white">Search</button>
          <details className="relative">
            <summary onClick={() => trackAnalyticsEvent("calculator_open")} className="flex cursor-pointer list-none items-center justify-center gap-2 rounded-xl bg-midpoint-cyan px-4 py-3 text-sm font-semibold text-midpoint-dark"><Calculator className="h-4 w-4" />Space calculator</summary>
            <div className="absolute left-0 z-20 mt-2 w-[min(20rem,calc(100vw-5.5rem))] lg:left-auto lg:right-0 rounded-2xl border border-midpoint-dark/10 bg-white p-5 shadow-xl">
              <p className="font-bold text-midpoint-dark">Calculate office space</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <label className="text-xs">Employees<input name="employees" type="number" min="0" defaultValue={calculatorValues.employees} className="mt-1 w-full rounded-lg border p-2 text-sm" /></label>
                <label className="text-xs">Private offices<input name="privateOffices" type="number" min="0" defaultValue={calculatorValues.privateOffices} className="mt-1 w-full rounded-lg border p-2 text-sm" /></label>
                <label className="text-xs">Meeting rooms<input name="meetingRooms" type="number" min="0" defaultValue={calculatorValues.meetingRooms} className="mt-1 w-full rounded-lg border p-2 text-sm" /></label>
                <label className="text-xs">Collaboration seats<input name="collaborationSeats" type="number" min="0" defaultValue={calculatorValues.collaborationSeats} className="mt-1 w-full rounded-lg border p-2 text-sm" /></label>
              </div>
              <button type="submit" name="calculate" value="1" className="mt-4 w-full rounded-full bg-midpoint-dark px-4 py-3 text-sm font-semibold text-white">Calculate and filter</button>
            </div>
          </details>
          <a href="/vacancies" onClick={(event) => { event.preventDefault(); reset(); }} className="rounded-xl px-4 py-3 text-center text-sm font-semibold text-midpoint-dark underline">Reset</a>
        </form>
        {calculatedRange && size === "CALCULATED" && <div className="mt-4 flex flex-wrap items-center gap-2 text-sm"><span className="text-midpoint-grey-400">Active calculator range:</span><button type="button" onClick={() => { setSize("ALL"); setCalculatedRange(null); }} className="rounded-full bg-midpoint-dark px-4 py-2 font-semibold text-white">Commercial / Office · {calculatedRange.min.toLocaleString("en-ZA")}–{calculatedRange.max.toLocaleString("en-ZA")} m² ×</button></div>}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <p role="status" aria-live="polite" className="text-sm text-midpoint-grey-400"><strong className="text-midpoint-dark">{filtered.length}</strong> listing{filtered.length === 1 ? "" : "s"} matching your filters.</p>
        <label className="flex items-center gap-2 text-sm text-midpoint-grey-400">Sort by<select aria-label="Sort listings" value={sort} onChange={event => setSort(event.target.value)} className="rounded-lg border border-midpoint-dark/15 bg-white px-3 py-2 text-midpoint-dark"><option value="DEFAULT">Recommended</option><option value="SIZE_ASC">Area: smallest first</option><option value="SIZE_DESC">Area: largest first</option><option value="RATE_ASC">Rate: lowest first</option></select></label>
      </div>
      {filtered.length > 0 ? <div className="mt-5 grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">{filtered.map((listing) => <VacancyCard key={listing.id} listing={listing} whatsappUrl={whatsappUrls[listing.id]} />)}</div> : <div className="mt-5 rounded-card border border-midpoint-grey-100 p-10 text-center text-midpoint-grey-400">No spaces match those filters. <button type="button" onClick={reset} className="font-semibold text-midpoint-dark underline">Reset filters</button> or <Link href="/contact-us#Contact" className="font-semibold text-midpoint-dark underline">contact our leasing team</Link>.</div>}
    </section>
  );
}
