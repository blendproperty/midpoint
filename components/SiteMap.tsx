"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { listings, type Listing } from "@/lib/listings";

export default function SiteMap() {
  const [selected, setSelected] = useState<Listing | null>(null);

  return (
    <div className="relative">
      {/* Aerial map with numbered pins */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-white">
        <Image
          src="https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/69e21ba7b5a168f9f25a6a8d_Aerial.jpg"
          alt="Midpoint estate aerial map"
          fill
          className="object-contain"
        />

        {listings.map((listing) => (
          <button
            key={listing.pin}
            type="button"
            onClick={() => setSelected(listing)}
            style={{ left: `${listing.x}%`, top: `${listing.y}%` }}
            className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-midpoint-cyan bg-white text-sm font-semibold text-midpoint-dark shadow-md transition-transform hover:scale-110"
            aria-label={`View ${listing.name}`}
          >
            {listing.pin}
          </button>
        ))}
      </div>

      {/* Slide-out detail panel */}
      {selected && (
        <div className="absolute right-0 top-0 z-10 max-h-full w-full max-w-sm overflow-y-auto rounded-2xl bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-midpoint-grey-100 px-4 py-3">
            <span className="text-lg font-bold text-midpoint-dark">M{selected.pin}</span>
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Close"
              className="text-xl text-midpoint-grey-400"
            >
              ×
            </button>
          </div>

          <div className="relative h-48 w-full">
            <Image src={selected.image} alt={selected.name} fill className="object-cover" />
          </div>

          <div className="p-4">
            <h3 className="text-xl font-semibold text-midpoint-dark">{selected.name}</h3>
            <p className="mt-1 text-sm font-medium text-midpoint-cyan">{selected.category}</p>
            <p className="mt-3 text-sm text-midpoint-grey-400">{selected.description}</p>

            <ul className="mt-3 space-y-1 text-sm text-midpoint-grey-400">
              {selected.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>

            <div className="mt-4 flex gap-3">
              <Link
                href="/contact-us"
                className="rounded-full bg-midpoint-cyan px-4 py-2 text-sm font-semibold text-midpoint-dark"
              >
                Enquire
              </Link>
              <Link
                href={selected.href}
                className="rounded-full bg-midpoint-grey-100 px-4 py-2 text-sm font-semibold text-midpoint-dark"
              >
                See Listings
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
