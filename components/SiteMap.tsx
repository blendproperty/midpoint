"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { listings, type Listing } from "@/lib/listings";

export default function SiteMap() {
  const [selected, setSelected] = useState<Listing | null>(null);

  return (
    <div>
      <div className="relative">
        <div className="relative aspect-[5500/2792] w-full overflow-hidden rounded-[20px] bg-white">
          <Image
            src="/images/sitemap/aerial.jpg"
            alt="Midpoint estate aerial map"
            fill
            className="object-cover"
          />

          {listings.map((listing) => (
            <button
              key={listing.pin}
              type="button"
              onClick={() => setSelected(listing)}
              style={{ left: `${listing.x}%`, top: `${listing.y}%` }}
              className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-midpoint-cyan bg-white text-sm font-semibold text-midpoint-dark transition-colors duration-200 hover:text-midpoint-cyan focus-visible:text-midpoint-cyan"
              aria-label={`View ${listing.name}`}
            >
              {listing.pin}
            </button>
          ))}
        </div>

        {selected && (
          <div className="absolute right-0 top-0 z-10 max-h-full w-full max-w-sm overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-midpoint-grey-100 px-4 py-3">
              <span className="text-lg font-bold text-midpoint-dark">M{selected.pin}</span>
              <button type="button" onClick={() => setSelected(null)} aria-label="Close" className="text-xl text-midpoint-grey-400">×</button>
            </div>
            <div className="relative h-48 w-full">
              <Image src={selected.image} alt={selected.name} fill className="object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-xl font-semibold text-midpoint-dark">{selected.name}</h3>
              <p className="mt-1 text-sm font-medium text-midpoint-cyan">{selected.category}</p>
              <p className="mt-3 text-sm text-midpoint-grey-400">{selected.description}</p>
              <ul className="mt-3 space-y-1 text-sm text-midpoint-grey-400">
                {selected.features.map((f) => (<li key={f}>• {f}</li>))}
              </ul>
              <div className="mt-4 flex gap-3">
                <Link href="/contact-us" className="rounded-full bg-midpoint-cyan px-4 py-2 text-sm font-semibold text-midpoint-dark">Enquire</Link>
                <Link href={selected.href} className="rounded-full bg-midpoint-grey-100 px-4 py-2 text-sm font-semibold text-midpoint-dark">See Listings</Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 lg:grid-cols-4">
        {listings.map((listing) => (
          <button
            key={listing.pin}
            type="button"
            onClick={() => setSelected(listing)}
            className="flex items-center gap-2 text-left text-sm text-midpoint-grey-400 transition-colors duration-150 hover:text-midpoint-dark"
          >
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-midpoint-cyan text-xs font-semibold text-midpoint-dark">
              {listing.pin}
            </span>
            {listing.name}
          </button>
        ))}
      </div>
    </div>
  );
}
