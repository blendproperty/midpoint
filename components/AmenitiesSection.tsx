import Image from "next/image";
import Link from "next/link";
import { amenities } from "@/lib/amenities";

export default function AmenitiesSection() {
  // Duplicated for a seamless marquee loop, same technique as TenantWall.
  const row = [...amenities, ...amenities];

  return (
    <section
      id="Amenities"
      className="overflow-hidden py-16 text-white"
      style={{
        backgroundImage:
          "linear-gradient(81deg, rgb(79, 115, 117), rgb(81, 98, 97) 59%)",
      }}
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Real 2-column grid confirmed via Playwright (607.2px / 303.6px,
            ~2fr/1fr): heading left, description + button right. */}
        <div className="grid gap-8 md:grid-cols-[2fr_1fr] md:items-start">
          <h2 className="text-3xl font-semibold md:text-4xl">Amenities &amp; Lifestyle</h2>
          <div>
            <p className="text-midpoint-grey-100">
              Facilities that support your team&rsquo;s day. An environment designed for well-being and success.
            </p>
            <p className="mt-2 text-midpoint-grey-100">
              Midpoint combines industrial and commercial space with everyday amenities created for the people who work here.
            </p>
            <Link
              href="/amenities"
              className="mt-4 inline-flex rounded-full bg-midpoint-cyan px-6 py-3 text-sm font-semibold text-midpoint-dark"
            >
              Read More
            </Link>
          </div>
        </div>
      </div>

      {/* Sliding card strip with edge fade — real values extracted via
          Playwright: white cards (12px radius, 240px wide), icon image at
          full 56×56 (no smaller icon padded inside), linear-gradient mask
          fading both edges. */}
      <div
        className="mt-10 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, rgba(0,0,0,0), rgb(0,0,0) 30%, rgb(0,0,0) 70%, rgba(0,0,0,0))",
          WebkitMaskImage:
            "linear-gradient(to right, rgba(0,0,0,0), rgb(0,0,0) 30%, rgb(0,0,0) 70%, rgba(0,0,0,0))",
        }}
      >
        <div className="flex w-max animate-marquee gap-4">
          {row.map((a, i) => (
            <div
              key={`${a.title}-${i}`}
              className="w-60 shrink-0 rounded-xl bg-white p-5 text-midpoint-dark"
            >
              <div className="h-14 w-14 overflow-hidden rounded-lg bg-[rgba(161,189,217,0.08)]">
                <Image src={a.icon} alt="" width={56} height={56} />
              </div>
              <h3 className="mt-4 font-semibold">{a.title}</h3>
              <p className="mt-1 text-sm text-midpoint-grey-400">{a.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
