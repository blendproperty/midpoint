import type { Metadata } from "next";
import Image from "next/image";
import { BedDouble, BriefcaseBusiness, Dumbbell, MapPin, ShieldCheck, UtensilsCrossed, Wifi } from "lucide-react";
import SuitesBookingForm from "@/components/SuitesBookingForm";

export const metadata: Metadata = {
  title: "The Suites at Midpoint",
  description: "Corporate accommodation at Midpoint in Midrand for executives, project teams and business travellers.",
  alternates: { canonical: "https://www.mid-point.co.za/the-suites-at-midpoint" },
};

const features = [
  [Wifi, "Work-ready", "Reliable connectivity and a comfortable workspace for focused days."],
  [BriefcaseBusiness, "Corporate stays", "Designed for visiting executives, consultants and project teams."],
  [UtensilsCrossed, "Everyday convenience", "Dining, coffee and practical amenities within the Midpoint precinct."],
  [Dumbbell, "Wellness nearby", "Easy access to the precinct gym, padel and outdoor spaces."],
  [ShieldCheck, "Managed precinct", "A professionally managed business environment with controlled access."],
  [MapPin, "Central Midrand", "Positioned between Johannesburg and Pretoria with key routes close by."],
];

export default function SuitesPage() {
  return <main className="bg-[#062b29] text-white">
    <section className="relative min-h-[72vh] overflow-hidden">
      <Image src="/images/listings/corporate-accommodation.png" alt="Contemporary bedroom at The Suites at Midpoint" fill priority className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#041f1e]/95 via-[#041f1e]/65 to-transparent" />
      <div className="relative mx-auto flex min-h-[72vh] max-w-7xl items-center px-6 py-24">
        <div className="max-w-2xl"><p className="mb-4 text-sm font-semibold uppercase tracking-[.22em] text-midpoint-cyan">Corporate accommodation in Midrand</p><h1 className="text-5xl font-semibold leading-tight md:text-7xl">The Suites at Midpoint</h1><p className="mt-6 max-w-xl text-lg leading-8 text-white/75">A considered place to stay, work and recharge—created for executives, project teams and business travellers who want to remain close to the office.</p><a href="#request-to-book" className="mt-8 inline-flex rounded-full bg-midpoint-cyan px-7 py-3 font-semibold text-midpoint-dark">Check dates</a></div>
      </div>
    </section>
    <section className="mx-auto max-w-7xl px-6 py-20"><div className="grid gap-6 md:grid-cols-3">{features.map(([Icon, title, copy]) => { const I = Icon as typeof BedDouble; return <article key={String(title)} className="rounded-2xl border border-white/10 bg-white/5 p-6"><I className="h-7 w-7 text-midpoint-cyan"/><h2 className="mt-5 text-xl font-semibold">{String(title)}</h2><p className="mt-2 text-sm leading-6 text-white/65">{String(copy)}</p></article>; })}</div></section>
    <section id="request-to-book" className="border-t border-white/10 bg-[#041f1e] px-6 py-20"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-sm font-semibold uppercase tracking-[.2em] text-midpoint-cyan">Plan your stay</p><h2 className="mt-3 text-4xl font-semibold">Request availability</h2><p className="mt-5 leading-7 text-white/65">Send your preferred dates and guest details. The team will confirm availability and rates before any reservation is finalised.</p></div><SuitesBookingForm /></div></section>
  </main>;
}
