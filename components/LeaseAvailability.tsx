import Link from "next/link";
import VacancyCard from "@/components/VacancyCard";
import ListingsJsonLd from "@/components/ListingsJsonLd";
import type { VacancyListing } from "@/lib/vacancy-shared";

export default function LeaseAvailability({ listings, sector, path }: { listings: VacancyListing[]; sector: string; path: string }) {
  return <section id="availability" className="scroll-mt-28 bg-[#f5f7f6] px-6 py-12">
    <div className="mx-auto max-w-7xl">
      <h2 className="text-2xl font-bold text-midpoint-dark md:text-3xl">{sector} availability at Midpoint</h2>
      <p className="mt-3 max-w-3xl text-midpoint-grey-400">Compare the currently published spaces in Halfway House, Midrand. Availability dates include future opportunities; confirm occupation timing, specifications and complete costs with the leasing team.</p>
      {listings.length ? <>
        <ListingsJsonLd listings={listings} path={path} name={`${sector} availability at Midpoint`} />
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{listings.map(listing => <VacancyCard key={listing.id} listing={listing} />)}</div>
      </> : <p className="mt-6 rounded-xl bg-white p-6 text-midpoint-dark">No spaces are currently published in this category. <Link href="/contact-us#Contact" className="underline">Ask the leasing team about upcoming availability.</Link></p>}
      <Link href={`/vacancies?sector=${encodeURIComponent(sector)}`} className="mt-8 inline-flex rounded-full bg-midpoint-dark px-6 py-3 text-sm font-semibold text-white">View the vacancy schedule →</Link>
    </div>
  </section>;
}
