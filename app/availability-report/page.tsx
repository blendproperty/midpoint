import type { Metadata } from "next";
import Link from "next/link";
import { listings } from "@/lib/listings";

export const metadata: Metadata = {
  title: "Availability Report | Midpoint",
  description:
    "Current availability schedule for warehouse, office and serviced office space at Midpoint, Midrand."
};

export default function AvailabilityReport() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-bold text-midpoint-dark">Availability Report</h1>
      <p className="mt-4 text-midpoint-grey-400">
        Space currently available or in development across the estate.
      </p>
      <ul className="mt-10 space-y-4">
        {listings.map((l) => (
          <li key={l.pin} className="rounded-card border border-midpoint-grey-100 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-midpoint-dark">{l.name}</h2>
              <span className="rounded-full bg-midpoint-cyan/20 px-3 py-1 text-xs font-medium text-midpoint-dark">
                {l.category}
              </span>
            </div>
            <p className="mt-2 text-sm text-midpoint-grey-400">{l.features.join(" · ")}</p>
          </li>
        ))}
      </ul>
      <Link href="/contact-us" className="mt-8 inline-block rounded-full bg-midpoint-dark px-6 py-3 text-sm font-medium text-white">
        Request the full schedule
      </Link>
    </section>
  );
}
