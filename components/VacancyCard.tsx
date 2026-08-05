"use client";

import Image from "next/image";
import Link from "next/link";
import { vacancyDetailHref, vacancyLabel, type VacancyListing } from "@/lib/vacancies";
import WhatsAppIcon from "@/components/WhatsAppIcon";

function formatSize(n: number) {
  return `${n.toLocaleString("en-ZA", { maximumFractionDigits: 2 })} m²`;
}

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
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-card bg-midpoint-dark text-white">
      <div className="relative h-56 w-full shrink-0">
        <Image src={listing.image} alt={listing.building} fill className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Building</p>
            <h3 className="text-xl font-semibold md:text-2xl">{listing.building}</h3>
            {listing.unitName && <p className="mt-0.5 text-sm font-medium text-midpoint-cyan">{listing.unitName}</p>}
          </div>
          <span className="rounded-full bg-midpoint-cyan/20 px-3 py-1 text-xs font-medium text-midpoint-cyan">
            {listing.sector}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4 border-y border-white/10 py-4 text-sm">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Size</p>
            <p className="mt-1 font-semibold">{formatSize(listing.sizeSqm)}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Rate /m²</p>
            <p className="mt-1 font-semibold">R{listing.ratePerSqm}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-white/50">Availability</p>
            <p className="mt-1 font-semibold">{listing.availability}</p>
          </div>
        </div>

        <p className="mt-4 text-sm text-white/70">{listing.description}</p>

        <ul className="mt-4 space-y-1 text-sm text-white/70">
          {listing.features.map((f) => (
            <li key={f}>• {f}</li>
          ))}
        </ul>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
          <Link href={vacancyDetailHref(listing)} className="rounded-full bg-midpoint-cyan px-5 py-2.5 text-sm font-semibold text-midpoint-dark transition hover:opacity-90">View details</Link>
          <Link
            href={enquireHref(listing)}
            onClick={() => trackVacancyEnquire(listing.id, vacancyLabel(listing))}
            className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-100 ease-out hover:bg-white/10 active:scale-[0.97]"
          >
            Enquire
          </Link>
          <Link
            href="/#explore"
            className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white transition-transform duration-100 ease-out hover:bg-white/10 active:scale-[0.97]"
          >
            See map view
          </Link>

          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackVacancyEnquire(listing.id, vacancyLabel(listing), "WHATSAPP")}
              aria-label={`WhatsApp us about ${vacancyLabel(listing)}`}
              title={`WhatsApp us about ${vacancyLabel(listing)}`}
              className="flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-semibold text-white transition-transform duration-100 ease-out hover:opacity-90 active:scale-[0.97]"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
