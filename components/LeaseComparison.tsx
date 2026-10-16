import Link from "next/link";
import { indicativeMonthlyRental, publishedVacancyFacts } from "@/lib/leasing-comparison";
import { vacancyAreaNeedsConfirmation } from "@/lib/vacancy-content";
import { vacancyAvailability, vacancyDetailHref, vacancyRate, vacancySize, type VacancyListing } from "@/lib/vacancy-shared";

export default function LeaseComparison({ listings, sector }: { listings: VacancyListing[]; sector: "Office" | "Warehouse" }) {
  if (!listings.length) return null;
  const warehouse = sector === "Warehouse";
  const facts = listings.map(listing => ({ listing, facts: publishedVacancyFacts(listing) })).filter(item => item.facts.length);
  return <section id="compare-spaces" className="scroll-mt-40 bg-white px-6 py-12 text-midpoint-dark">
    <div className="mx-auto max-w-7xl">
      <h2 className="text-2xl font-bold md:text-3xl">Compare {warehouse ? "warehouse" : "office"} space and asking rentals</h2>
      <p className="mt-4 max-w-3xl leading-7 text-midpoint-grey-400">Compare the current published listings before arranging a viewing. The monthly figures below are area × asking rate, not quotations. VAT, operating costs, utilities, parking and other charges need confirmation for each space.</p>
      <div role="region" aria-label={`Compare ${sector.toLowerCase()} listings`} tabIndex={0} className="mt-6 overflow-x-auto rounded-xl border border-midpoint-dark/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-midpoint-dark">
        <table className="w-full min-w-[760px] text-left text-sm">
          <caption className="sr-only">Published {sector.toLowerCase()} areas, asking rates, indicative monthly base rental and availability</caption>
          <thead className="bg-[#edf3f1]"><tr>{["Space", "Published area", "Asking rate / m² / month", "Indicative base rental / month", "Published availability"].map(label => <th key={label} scope="col" className="p-4 align-top font-semibold">{label}</th>)}</tr></thead>
          <tbody>{listings.map(listing => {
            const conflict = vacancyAreaNeedsConfirmation(listing);
            const monthly = indicativeMonthlyRental(listing);
            return <tr key={listing.id} className="border-t border-midpoint-dark/10 align-top">
              <th scope="row" className="p-4 font-semibold"><Link href={vacancyDetailHref(listing)} className="underline underline-offset-4">{listing.unitName || listing.building}</Link></th>
              <td className="p-4">{conflict ? <span>Area needs confirmation<br /><span className="text-xs">Source fields differ; see property details.</span></span> : vacancySize(listing.sizeSqm)}</td>
              <td className="p-4">{vacancyRate(listing.ratePerSqm)}</td>
              <td className="p-4">{monthly === null ? "Confirm with leasing" : `R${monthly.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
              <td className="p-4">{vacancyAvailability(listing.availability)}</td>
            </tr>;
          })}</tbody>
        </table>
      </div>
      <p className="mt-3 text-sm text-midpoint-grey-400">A published date or “Immediately” is a listing statement, not a confirmed handover. “To Let” and notice periods require a specific occupation date from the leasing team.</p>

      {facts.length > 0 && <div className="mt-10">
        <h3 className="text-xl font-semibold">Specifications published for individual spaces</h3>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-midpoint-grey-400">These figures are taken from each linked listing, and may describe proposed works. Confirm the current condition and final specification before relying on them. {warehouse && "Eaves do not establish clear height below obstructions; yard area does not establish turning geometry; a power figure does not establish generator coverage."}</p>
        <div className="mt-5 grid gap-5 lg:grid-cols-2">{facts.map(({ listing, facts: values }) => <article key={listing.id} className="rounded-xl border border-midpoint-dark/15 p-5">
          <h4 className="font-semibold"><Link href={vacancyDetailHref(listing)} className="underline underline-offset-4">{listing.unitName || listing.building}</Link></h4>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">{values.map(fact => <div key={fact.label}><dt className="text-xs text-midpoint-grey-400">{fact.label}</dt><dd className="mt-1 font-semibold">{fact.value}</dd></div>)}</dl>
        </article>)}</div>
        <p className="mt-4 text-sm text-midpoint-grey-400">A missing specification means it was not identified in that listing; request the full schedule and dimensioned floor plan. Shared estate features do not prove an individual unit’s capacity or inclusions.</p>
      </div>}

      <div className="mt-10 grid gap-8 rounded-card bg-[#f5f7f6] p-6 md:grid-cols-2 md:p-8">
        <div><h3 className="text-xl font-semibold">Build a complete occupancy budget</h3><ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-midpoint-grey-400">
          <li>Request the area basis, asking rate, VAT treatment, recoveries, utilities, parking charges and escalation.</li>
          <li>Allow for the deposit, fit-out, connectivity, relocation and any reinstatement obligations.</li>
          <li>{warehouse ? "Price racking, equipment, electrical work and any loading or fire-system changes against an agreed technical brief." : "Check the existing fit-out, furniture, meeting-room needs, connectivity and landlord versus tenant work."}</li>
        </ul></div>
        <div><h3 className="text-xl font-semibold">Bring a clear viewing brief</h3><p className="mt-4 text-sm leading-6 text-midpoint-grey-400">{warehouse ? "Share your move date, area range, warehouse-to-office split, largest vehicle, loading frequency, racking height, equipment loads and fire requirements." : "Share your move date, team size, area range, private-office and meeting-room needs, parking requirement and critical equipment loads."}</p>
          <p className="mt-3 text-sm leading-6 text-midpoint-grey-400">Confirm backup coverage, access, permitted use, required works and the handover programme for the selected space. Amenities and their charges are subject to current operating arrangements.</p>
          <Link href={`/contact-us?interest=${encodeURIComponent(warehouse ? "Warehouse space" : "Office space")}#Contact`} className="mt-5 inline-flex rounded-full bg-midpoint-dark px-5 py-3 text-sm font-semibold text-white">Discuss your {sector.toLowerCase()} requirements</Link>
          {!warehouse && <Link href="/services-offices" className="mt-4 block text-sm font-semibold underline">Compare OnPoint serviced offices and confirm package inclusions →</Link>}
        </div>
      </div>
    </div>
  </section>;
}
