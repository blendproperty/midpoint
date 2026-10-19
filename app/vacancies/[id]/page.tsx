import { getPageSeoOverride } from "@/lib/page-seo";
import { getSiteSettings } from "@/lib/site-settings";
import { buildPageMetadata } from "@/lib/seo-metadata";
import type { Metadata } from "next";
import VacancyFeature from "@/components/VacancyFeature";
import { vacancyRate, vacancySize, vacancyAvailability } from "@/lib/vacancy-shared";
import VacancyPhoto from "@/components/VacancyPhoto";
import Link from "next/link";
import { notFound } from "next/navigation";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getVacancyById, vacancyLabel } from "@/lib/vacancies";
import VacancyViewTracker from "@/components/VacancyViewTracker";
import { vacancyBrochureHref } from "@/lib/vacancy-shared";
import { vacancySummary } from "@/lib/vacancies";
import { isPriorityVacancy, vacancyContent, vacancyAreaNeedsConfirmation } from "@/lib/vacancy-content";
import { vacancyJsonLd } from "@/lib/vacancy-schema";
import { getListingBrochureImages } from "@/lib/listings-brochure";
import { safeJsonLd } from "@/lib/json-ld";
import AmenityGallery from "@/components/AmenityGallery";
import { indicativeMonthlyRental, publishedVacancyFacts } from "@/lib/leasing-comparison";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const listing = await getVacancyById(decodeURIComponent(id));
  if (!listing) return {};
  const path = `/vacancies/${encodeURIComponent(listing.id)}`;
  const [fields, settings] = await Promise.all([getPageSeoOverride(path), getSiteSettings()]);
  const content = vacancyContent(listing);
  return buildPageMetadata({ path, title: content.title, description: content.description, image: listing.image, fields, settings });
}

export default async function VacancyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await getVacancyById(decodeURIComponent(id));
  if (!listing) notFound();
  const label = vacancyLabel(listing);
  const content = vacancyContent(listing);
  const settings = await getSiteSettings();
  const priority = isPriorityVacancy(listing.id);
  const interest = listing.sector === "Warehouse" ? "Warehouse space" : listing.sector === "Office" ? "Office space" : "Serviced offices";
  const enquiryHref = `/contact-us?space=${encodeURIComponent(label)}&interest=${encodeURIComponent(interest)}#Contact`;
  const guideHref = listing.sector === "Warehouse" ? "/warehouses" : listing.sector === "Office" ? "/offices" : "/services-offices";
  // Reuse the brochure's exact external-ID photo lookup. A provider outage
  // must not hide a published listing or its primary saved photograph.
  // shortcut: live gallery has a 1.5s budget; persist photos during sync if it regularly expires.
  const gallery = priority && listing.externalId
    ? await getListingBrochureImages(listing.externalId, AbortSignal.timeout(1500)).catch(() => null)
    : null;
  const photos = (gallery || []).filter(src => {
    try { const url = new URL(src, settings.domain); return url.protocol === "https:" && ["www.mid-point.co.za", "mid-point.co.za", "listings.blendproperty.co.za", "cdn.prod.website-files.com"].includes(url.hostname); } catch { return false; }
  });
  const areaNeedsConfirmation = vacancyAreaNeedsConfirmation(listing);
  const monthlyBase = indicativeMonthlyRental(listing);
  const publishedFacts = publishedVacancyFacts(listing);
  const breadcrumbItems = [{ name: "Home", path: "/" }, { name: "Vacancies", path: "/vacancies" }, { name: label, path: `/vacancies/${encodeURIComponent(listing.id)}` }];

  return (
    <article className="bg-white pb-20">
      <VacancyViewTracker vacancyId={listing.id} vacancyName={label} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd({ ...vacancyJsonLd(listing, settings.domain), dateModified: listing.updatedAt.toISOString() }) }} />
      <Breadcrumbs items={breadcrumbItems} />
      <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-12 pt-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div className="min-w-0">
          {photos.length > 1 ? <AmenityGallery name={label} photos={photos.map((src, index) => ({ src, alt: `${label}, Halfway House, Midrand — property photograph ${index + 1}` }))} sizes="(min-width: 1024px) 55vw, 100vw" /> : <div className="relative aspect-[16/10] overflow-hidden rounded-card bg-midpoint-grey-100">
          <VacancyPhoto src={listing.image} label={label} priority sizes="(min-width: 1024px) 60vw, 100vw" />
          </div>}
          <p className="mt-3 text-xs text-midpoint-grey-400">Published property images may illustrate proposed works. Confirm the current condition and specifications during your viewing.</p>
        </div>
        <div className="lg:py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-midpoint-dark/70">{listing.sector}</p>
          <h1 className="mt-3 text-4xl font-bold text-midpoint-dark md:text-5xl">{listing.unitName || listing.building}</h1>
          <p className="mt-3 text-midpoint-grey-400">{listing.sector} to rent · Midpoint Business Park · Halfway House, Midrand</p>
          <div className="mt-8 grid grid-cols-3 gap-4 border-y border-midpoint-grey-100 py-5">
            <div><p className="text-xs text-midpoint-grey-400">Published area</p><p className="mt-1 font-bold text-midpoint-dark">{areaNeedsConfirmation ? "Confirmation required" : vacancySize(listing.sizeSqm)}</p></div>
            <div><p className="text-xs text-midpoint-grey-400">Rate</p><p className="mt-1 font-bold text-midpoint-dark">{vacancyRate(listing.ratePerSqm)}{listing.ratePerSqm > 0 && " /m² /month"}</p></div>
            <div><p className="text-xs text-midpoint-grey-400">Availability</p><p className="mt-1 font-bold text-midpoint-dark">{vacancyAvailability(listing.availability)}</p></div>
          </div>
          <p className="mt-3 text-xs text-midpoint-grey-400">Confirm VAT, parking and other charges with our leasing team.</p>
          {monthlyBase !== null && <p className="mt-3 text-sm text-midpoint-dark">Indicative base rental: <strong>{monthlyBase.toLocaleString("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 2 })} per month</strong>. Calculated from the published area × asking rate; VAT treatment, parking and additional charges require confirmation. This estimate is not a quotation.</p>}
          <a href={vacancyBrochureHref(listing)} download aria-label={`Download brochure for ${label}`} data-analytics-event="brochure_download" data-analytics-location="vacancy_detail" data-vacancy-id={listing.id} data-vacancy-name={label} className="mt-6 inline-flex rounded-full border border-midpoint-dark/20 px-6 py-3 text-sm font-semibold text-midpoint-dark transition hover:bg-midpoint-dark/5">Download brochure</a>
          <p className="mt-7 leading-7 text-midpoint-grey-400">{vacancySummary(content.narrative)}</p>
          {listing.features.length > 0 && <ul className="mt-6 grid gap-3 text-sm text-midpoint-dark sm:grid-cols-2">{listing.features.map((feature) => <li key={feature}><VacancyFeature feature={feature} /></li>)}</ul>}
          <div className="mt-8 flex flex-wrap gap-3"><Link href={enquiryHref} data-analytics-event="enquiry_start" data-analytics-location="vacancy_detail" data-vacancy-id={listing.id} data-vacancy-name={label} className="rounded-full bg-midpoint-cyan px-6 py-3 text-sm font-semibold text-midpoint-dark">Arrange a viewing</Link><Link href="/vacancies" className="rounded-full border border-midpoint-dark/20 px-6 py-3 text-sm font-semibold text-midpoint-dark">Back to vacancies</Link></div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-10 border-t border-midpoint-grey-100 px-6 py-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <h2 className="text-2xl font-bold text-midpoint-dark">Property details</h2>
          <div className="mt-5 rounded-xl border border-midpoint-dark/15 p-5">
            <h3 className="text-lg font-semibold text-midpoint-dark">Published unit information</h3>
            <p className="mt-3 text-sm leading-6 text-midpoint-grey-400">The figures below come from this unit’s current listing description. They are source statements, not independently measured or certified specifications. Confirm the current condition, proposed works and suitability against your operational brief.</p>
            {publishedFacts.length > 0 ? <dl className="mt-4 grid gap-4 sm:grid-cols-2">{publishedFacts.map(fact => <div key={fact.label}><dt className="text-sm text-midpoint-grey-400">{fact.label}</dt><dd className="mt-1 font-semibold text-midpoint-dark">{fact.value}</dd></div>)}</dl> : <p className="mt-4 text-sm text-midpoint-grey-400">No labelled technical measurements were identified in this listing description. Request the current unit specification schedule and dimensioned floor plan from leasing.</p>}
            <p className="mt-4 text-sm leading-6 text-midpoint-grey-400">A generator or backup-water feature does not establish this unit’s allocation, supported equipment or service inclusions. Confirm access hours, parking, VAT, recoveries, utilities and occupation timing in a written quote.</p>
          </div>
          <p className="mt-5 whitespace-pre-line leading-7 text-midpoint-grey-400">{content.narrative}</p>
          {content.details.length > 0 && <ul className="mt-5 space-y-3 text-midpoint-grey-400">{content.details.map((detail, index) => <li key={index} className="flex gap-3"><span aria-hidden="true" className="text-midpoint-dark">•</span><span>{detail}</span></li>)}</ul>}
          {areaNeedsConfirmation && <p className="mt-5 rounded-xl bg-amber-50 p-4 text-sm text-midpoint-dark">Area confirmation required: the published area field and source description currently differ. Please request the confirmed lettable area and floor plan before comparing costs.</p>}
          <p className="mt-5 text-xs text-midpoint-grey-400">Listing data updated {listing.updatedAt.toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric", timeZone: "Africa/Johannesburg" })}. Source features may include shared estate facilities; confirm operating status, unit coverage, charges and any restrictions.</p>
          <Link href={guideHref} className="mt-6 inline-block font-semibold text-midpoint-dark underline">Compare {listing.sector.toLowerCase()} space at Midpoint →</Link>
        </div>
        <aside className="rounded-card bg-[#f5f7f6] p-6 md:p-8">
          <h2 className="text-2xl font-bold text-midpoint-dark">Plan your viewing</h2>
          <p className="mt-4 text-sm leading-6 text-midpoint-grey-400">Bring your occupation date, area requirement and operational brief. Ask the leasing team to confirm these points for {listing.unitName || listing.building}:</p>
          <ul className="mt-5 space-y-4 text-sm leading-6 text-midpoint-dark">{content.viewing.map(item => <li key={item} className="flex gap-3"><span aria-hidden="true">•</span><span>{item}</span></li>)}</ul>
          <Link href={enquiryHref} data-analytics-event="enquiry_start" data-analytics-location="vacancy_viewing_brief" data-vacancy-id={listing.id} data-vacancy-name={label} className="mt-6 inline-flex rounded-full bg-midpoint-cyan px-6 py-3 text-sm font-semibold text-midpoint-dark">Request a floor plan and viewing</Link>
          <a href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`} className="mt-5 block text-sm font-semibold text-midpoint-dark">Call {settings.phone}</a>
        </aside>
      </section>
    </article>
  );
}
