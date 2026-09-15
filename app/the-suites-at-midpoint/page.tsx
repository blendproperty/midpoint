import type { Metadata } from "next";
import Image from "next/image";
import {
  BedDouble,
  BriefcaseBusiness,
  Dumbbell,
  MapPin,
  ShieldCheck,
  UtensilsCrossed,
  Wifi,
} from "lucide-react";
import SuitesBookingForm from "@/components/SuitesBookingForm";
import BookingSearch from "@/components/BookingSearch";
import SuiteGallery from "@/components/SuiteGallery";
import { isStagingHost } from "@/lib/staging-host";

export const metadata: Metadata = {
  title: "The Suites at Midpoint",
  description:
    "Coming soon: corporate accommodation at Midpoint in Midrand. Preview AI renderings of The Suites for executives, project teams and business travellers.",
  alternates: {
    canonical: "https://www.mid-point.co.za/the-suites-at-midpoint",
  },
};

const features = [
  [
    Wifi,
    "Work-ready",
    "Reliable connectivity and a comfortable workspace for focused days.",
  ],
  [
    BriefcaseBusiness,
    "Corporate stays",
    "Designed for visiting executives, consultants and project teams.",
  ],
  [
    UtensilsCrossed,
    "Everyday convenience",
    "Dining, coffee and practical amenities within the Midpoint precinct.",
  ],
  [
    Dumbbell,
    "Wellness nearby",
    "Easy access to the precinct gym, padel and outdoor spaces.",
  ],
  [
    ShieldCheck,
    "Managed precinct",
    "A professionally managed business environment with controlled access.",
  ],
  [
    MapPin,
    "Central Midrand",
    "Positioned between Johannesburg and Pretoria with key routes close by.",
  ],
];

const suiteImages = [
  "/images/suites/suite-bedroom-workspace.png",
  "/images/suites/suite-bedroom-mirror.png",
  "/images/suites/suite-storage.png",
  "/images/suites/suite-bathroom.png",
];

export default async function SuitesPage() {
  const staging = await isStagingHost();
  return (
    <main className="bg-[#062b29] text-white">
      <section className="relative min-h-[72vh] overflow-hidden">
        <Image
          src="/images/suites/suite-bedroom-workspace.png"
          alt="AI rendering of a proposed bedroom at The Suites at Midpoint"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#041f1e]/95 via-[#041f1e]/65 to-transparent" />
        <div className="relative mx-auto flex min-h-[72vh] max-w-7xl items-center px-6 py-24">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[.22em] text-midpoint-cyan">
              Coming soon · Corporate accommodation in Midrand
            </p>
            <h1 className="text-5xl font-semibold leading-tight md:text-7xl">
              The Suites at Midpoint
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/75">
              A considered place to stay, work and recharge—created for
              executives, project teams and business travellers who want to
              remain close to the office.
            </p>
            <p className="mt-4 text-sm font-medium text-midpoint-cyan">AI renderings for illustration. Final finishes may differ.</p>
            <a
              href={staging ? "/stay" : "#request-to-book"}
              className="mt-8 inline-flex rounded-full bg-midpoint-cyan px-7 py-3 font-semibold text-midpoint-dark"
            >
              {staging ? "Book your stay" : "Enquire about The Suites"}
            </a>
          </div>
        </div>
      </section>
      {staging && (
        <section className="relative z-10 mx-auto -mt-10 max-w-7xl px-6">
          <BookingSearch />
        </section>
      )}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map(([Icon, title, copy]) => {
            const I = Icon as typeof BedDouble;
            return (
              <article
                key={String(title)}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <I className="h-7 w-7 text-midpoint-cyan" />
                <h2 className="mt-5 text-xl font-semibold">{String(title)}</h2>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  {String(copy)}
                </p>
              </article>
            );
          })}
        </div>
      </section>
      <section className="bg-[#f4efe5] px-6 py-20 text-[#27362f]">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#8a4f3d]">
            Inside the suites
          </p>
          <h2 className="mb-8 mt-3 text-4xl font-semibold">A closer look</h2>
          <SuiteGallery images={suiteImages} title="The Suites at Midpoint" imageNotice="Coming soon · AI renderings" />
          <p className="mt-4 text-sm text-slate-500">
            Coming soon. These images are AI renderings for illustration, not photographs of completed suites. Final layouts, finishes and furnishings may differ.
          </p>
        </div>
      </section>
      <section
        id="request-to-book"
        className="border-t border-white/10 bg-[#041f1e] px-6 py-20"
      >
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[.2em] text-midpoint-cyan">
              Plan your stay
            </p>
            <h2 className="mt-3 text-4xl font-semibold">
              {staging ? "Find your stay" : "Enquire about The Suites"}
            </h2>
            <p className="mt-5 leading-7 text-white/65">
              The Suites are coming soon. Contact the team about future stays and opening plans. Availability and rates will be confirmed before any reservation is finalised.
            </p>
          </div>
          {staging ? (
            <a href="/stay" className="stay-button self-center">
              Search rooms & make a test booking →
            </a>
          ) : (
            <SuitesBookingForm />
          )}
        </div>
      </section>
    </main>
  );
}
