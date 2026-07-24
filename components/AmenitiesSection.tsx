import Image from "next/image";
import Link from "next/link";
import { amenities } from "@/lib/amenities";

export default function AmenitiesSection() {
  return (
    <section id="Amenities" className="px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-semibold md:text-4xl">Amenities &amp; Lifestyle</h2>
        <p className="mt-4 max-w-2xl text-midpoint-grey-400">
          Facilities that support your team&rsquo;s day. An environment designed for well-being and success. Midpoint combines industrial and commercial space with everyday amenities created for the people who work here.
        </p>
        <Link
          href="/amenities"
          className="mt-4 inline-flex rounded-full bg-midpoint-cyan px-6 py-3 text-sm font-semibold text-midpoint-dark"
        >
          Read More
        </Link>

        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {amenities.map((a) => (
            <div key={a.title} className="flex gap-4">
              <Image src={a.icon} alt="" width={32} height={32} className="h-8 w-8 shrink-0" />
              <div>
                <h3 className="font-semibold">{a.title}</h3>
                <p className="mt-1 text-sm text-midpoint-grey-400">{a.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
