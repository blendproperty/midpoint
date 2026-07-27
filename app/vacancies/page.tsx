import type { Metadata } from "next";
import Link from "next/link";
import { listings } from "@/lib/listings";

export const metadata: Metadata = {
  title: "Vacancies",
  description:
    "Current leasing opportunities at Midpoint: warehouse, office and serviced office vacancies in Midrand."
};

// TODO: swap for live data from listings.blendproperty.co.za when API access is sorted.
export default function Vacancies() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-4xl font-bold text-midpoint-dark">Vacancies</h1>
      <table className="mt-10 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-midpoint-grey-100 uppercase tracking-wide text-midpoint-grey-400">
            <th className="py-3 pr-4">Space</th>
            <th className="py-3 pr-4">Type</th>
            <th className="py-3">Key details</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((l) => (
            <tr key={l.pin} className="border-b border-midpoint-grey-100/60 align-top">
              <td className="py-4 pr-4 font-medium">{l.name}</td>
              <td className="py-4 pr-4">{l.category}</td>
              <td className="py-4">{l.features.join(" · ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href="/contact-us" className="mt-8 inline-block rounded-full bg-midpoint-dark px-6 py-3 text-sm font-medium text-white">
        Enquire about a space
      </Link>
    </section>
  );
}
