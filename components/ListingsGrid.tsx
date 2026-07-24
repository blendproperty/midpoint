import Image from "next/image";
import Link from "next/link";
import { listings } from "@/lib/listings";

export default function ListingsGrid() {
  return (
    <section id="explore" className="overflow-hidden px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-semibold md:text-4xl">Explore Midpoint</h2>
        <p className="mt-4 max-w-2xl text-midpoint-grey-400">
          Explore our interactive map to view available warehouse space, offices, serviced offices, and upcoming developments in Midrand. You can also view our vacancy schedule for current leasing opportunities.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <div key={listing.name} className="overflow-hidden rounded-card bg-midpoint-dark text-white">
              <div className="relative h-48 w-full">
                <Image src={listing.image} alt={listing.name} fill className="object-cover" />
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-wide text-midpoint-cyan">{listing.category}</p>
                <h3 className="mt-1 text-xl font-semibold">{listing.name}</h3>
                <p className="mt-2 text-sm text-white/80">{listing.description}</p>
                <ul className="mt-3 space-y-1 text-sm text-white/70">
                  {listing.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <div className="mt-4 flex gap-3">
                  <Link
                    href="/contact-us"
                    className="rounded-full bg-midpoint-cyan px-4 py-2 text-xs font-semibold text-midpoint-dark"
                  >
                    Enquire
                  </Link>
                  <Link
                    href={listing.href}
                    className="rounded-full bg-midpoint-grey-100 px-4 py-2 text-xs font-semibold text-midpoint-dark"
                  >
                    See Listings
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
