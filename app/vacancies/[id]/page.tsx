import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getVacancyById, vacancyLabel } from "@/lib/vacancies";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const listing = await getVacancyById(decodeURIComponent(id));
  if (!listing) return {};
  return { title: `${vacancyLabel(listing)} to let`, description: listing.description };
}

export default async function VacancyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getVacancyById(decodeURIComponent(id));
  if (!listing) notFound();
  const label = vacancyLabel(listing);
  const enquiryHref = `/contact-us?space=${encodeURIComponent(label)}#Contact`;
  const breadcrumbItems = [{ name: "Home", path: "/" }, { name: "Vacancies", path: "/vacancies" }, { name: label, path: `/vacancies/${encodeURIComponent(listing.id)}` }];

  return (
    <article className="bg-white pb-20">
      <BreadcrumbJsonLd items={breadcrumbItems} description={listing.description} />
      <Breadcrumbs items={breadcrumbItems} />
      <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-12 pt-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div className="relative aspect-[16/10] overflow-hidden rounded-card bg-midpoint-grey-100">
          <Image src={listing.image || "/images/pages/amenities-banner.jpg"} alt={label} fill priority className="object-cover" />
        </div>
        <div className="lg:py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-midpoint-cyan">{listing.sector}</p>
          <h1 className="mt-3 text-4xl font-bold text-midpoint-dark md:text-5xl">{label}</h1>
          <div className="mt-8 grid grid-cols-3 gap-4 border-y border-midpoint-grey-100 py-5">
            <div><p className="text-xs text-midpoint-grey-400">Available area</p><p className="mt-1 font-bold text-midpoint-dark">{listing.sizeSqm.toLocaleString("en-ZA", { maximumFractionDigits: 2 })} m²</p></div>
            <div><p className="text-xs text-midpoint-grey-400">Rate</p><p className="mt-1 font-bold text-midpoint-dark">R{listing.ratePerSqm.toLocaleString("en-ZA")} /m²</p></div>
            <div><p className="text-xs text-midpoint-grey-400">Availability</p><p className="mt-1 font-bold text-midpoint-dark">{listing.availability}</p></div>
          </div>
          <p className="mt-7 leading-7 text-midpoint-grey-400">{listing.description}</p>
          {listing.features.length > 0 && <ul className="mt-6 space-y-2 text-midpoint-dark">{listing.features.map((feature) => <li key={feature}>🔹 {feature}</li>)}</ul>}
          <div className="mt-8 flex flex-wrap gap-3"><Link href={enquiryHref} className="rounded-full bg-midpoint-cyan px-6 py-3 text-sm font-semibold text-midpoint-dark">Arrange a viewing</Link><Link href="/vacancies" className="rounded-full border border-midpoint-dark/20 px-6 py-3 text-sm font-semibold text-midpoint-dark">Back to vacancies</Link></div>
        </div>
      </section>
    </article>
  );
}
