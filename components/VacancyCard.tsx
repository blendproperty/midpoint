"use client";

import VacancyPhoto from "@/components/VacancyPhoto";
import { ArrowUpRight, CalendarDays, MapPin, Maximize2 } from "lucide-react";
import VacancyFeature from "@/components/VacancyFeature";
import Link from "next/link";
import { vacancyDetailHref, vacancyLabel, vacancyRate, vacancySize, vacancyAvailability, type VacancyListing } from "@/lib/vacancy-shared";
import WhatsAppIcon from "@/components/WhatsAppIcon";

// Fires a beacon when "Enquire" is clicked so /admin can show which listings
// are attracting the most interest — doesn't block or delay the navigation.
// Uses the specific unit name where one exists (e.g. an OnPoint suite)
// rather than just the shared building name, so the "Vacancy interest"
// breakdown on the dashboard can tell individual units apart.
function trackVacancyEnquire(vacancyId: string, spaceLabel: string, type: "ENQUIRE" | "WHATSAPP" = "ENQUIRE") {
  const body = JSON.stringify({ vacancyId, building: spaceLabel, type });
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

function enquireHref(listing: VacancyListing) {
  const params = new URLSearchParams();
  params.set("space", vacancyLabel(listing));
  const interest = SECTOR_TO_INTEREST[listing.sector];
  if (interest) params.set("interest", interest);
  return `/contact-us?${params.toString()}#Contact`;
}

type Props = {
  listing: VacancyListing;
  // Pre-built wa.me link (site WhatsApp number + a message naming this
  // specific listing), computed server-side in app/vacancies/page.tsx from
  // Site Settings. Omitted/undefined when no WhatsApp number is configured.
  whatsappUrl?: string | null;
};

export default function VacancyCard({ listing, whatsappUrl }: Props) {
  const label = vacancyLabel(listing);
  const features = Array.from(new Set(listing.features)).slice(0, 4);
  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-midpoint-dark/10 bg-white text-midpoint-dark shadow-sm transition-shadow hover:shadow-lg">
      <Link href={vacancyDetailHref(listing)} aria-label={`View ${label}`} className="relative block aspect-[16/10] shrink-0 overflow-hidden bg-[#eaf0ef] focus-visible:outline focus-visible:outline-2 focus-visible:outline-midpoint-dark">
        <VacancyPhoto src={listing.image} label={label} sizes="(min-width: 1280px) 390px, (min-width: 768px) 50vw, 100vw" />
        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold shadow-sm">{listing.sector}</span>
      </Link>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="flex items-center gap-1.5 text-xs text-midpoint-grey-400"><MapPin aria-hidden="true" className="h-3.5 w-3.5" />Midpoint · Midrand</p>
        <h3 className="mt-2 text-xl font-semibold leading-tight"><Link href={vacancyDetailHref(listing)} className="hover:underline">{listing.unitName || listing.building}</Link></h3>
        <p className="mt-1 min-h-5 text-sm text-midpoint-grey-400">{listing.unitName ? listing.building : listing.sector + ' space to let'}</p>
        <div className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-2xl font-bold">{vacancyRate(listing.ratePerSqm)}</span>
          {listing.ratePerSqm > 0 && <span className="text-sm text-midpoint-grey-400">/ m² / month</span>}
        </div>
        <p className="mt-1 text-xs text-midpoint-grey-400">Confirm VAT, parking and other charges with our leasing team.</p>
        <dl className="mt-5 grid grid-cols-2 gap-4 border-y border-midpoint-dark/10 py-4 text-sm">
          <div><dt className="flex items-center gap-1.5 text-xs text-midpoint-grey-400"><Maximize2 aria-hidden="true" className="h-3.5 w-3.5" />Floor area</dt><dd className="mt-1 font-semibold">{vacancySize(listing.sizeSqm)}</dd></div>
          <div><dt className="flex items-center gap-1.5 text-xs text-midpoint-grey-400"><CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />Availability</dt><dd className="mt-1 font-semibold">{vacancyAvailability(listing.availability)}</dd></div>
        </dl>
        <p className="mt-4 line-clamp-2 text-sm leading-6 text-midpoint-grey-400">{listing.description}</p>
        {features.length > 0 && <ul className="mt-4 grid gap-2 text-xs text-midpoint-dark/80">{features.map(feature => <li key={feature}><VacancyFeature feature={feature} /></li>)}</ul>}
        {listing.features.length > features.length && <p className="mt-2 text-xs text-midpoint-grey-400">More features in property details</p>}
        <div className="mt-auto pt-6">
          <Link href={vacancyDetailHref(listing)} data-analytics-event="vacancy_view" data-analytics-location="vacancy_card" data-vacancy-id={listing.id} data-vacancy-name={label} className="flex w-full items-center justify-between rounded-xl bg-midpoint-dark px-4 py-3 text-sm font-semibold text-white transition hover:bg-midpoint-dark/90">View details<ArrowUpRight aria-hidden="true" className="h-4 w-4 text-midpoint-cyan" /></Link>
          <div className="mt-3 flex items-center justify-between gap-3 text-sm">
            <Link href={enquireHref(listing)} onClick={() => trackVacancyEnquire(listing.id, label)} data-analytics-event="enquiry_start" data-analytics-location="vacancy_card" data-vacancy-id={listing.id} data-vacancy-name={label} className="font-semibold underline-offset-4 hover:underline">Enquire</Link>
            {whatsappUrl && <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackVacancyEnquire(listing.id, label, "WHATSAPP")} aria-label={`WhatsApp us about ${label}`} className="inline-flex items-center gap-1.5 font-medium underline-offset-4 hover:underline"><WhatsAppIcon className="h-4 w-4" />WhatsApp</a>}
          </div>
        </div>
      </div>
    </article>
  );
}
