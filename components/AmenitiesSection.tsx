import Image from "next/image";
import Link from "next/link";
import { amenities } from "@/lib/amenities";
import Reveal from "@/components/Reveal";

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
        <Reveal className="grid gap-8 md:grid-cols-[2fr_1fr] md:items-start">
          <h2 className="text-3xl font-semibold md:text-4xl">Amenities &amp; Lifestyle</h2>
          <div>
            <p className="text-midpoint-grey-100">
              Food, fitness and outdoor facilities within the wider estate.
            </p>
            <p className="mt-2 text-midpoint-grey-100">
              Some facilities and buildings remain under development. Confirm what is operating before visiting.
            </p>
            <Link
              href="/amenities"
              className="mt-4 inline-flex rounded-full bg-midpoint-cyan px-6 py-3 text-sm font-semibold text-midpoint-dark transition-transform hover:scale-105"
            >
              Read More
            </Link>
          </div>
        </Reveal>
      </div>

      {/* Small, always-visible hint that the strip below is interactive and has
          more cards than what's on screen - there was previously no signal of
          either. */}
      <p className="mx-auto mt-8 flex max-w-7xl items-center gap-2 px-6 text-xs uppercase tracking-wide text-midpoint-grey-100/80">
        <span aria-hidden="true">←</span>
        Hover to pause · scroll to explore
        <span aria-hidden="true">→</span>
      </p>

      {/* Sliding card strip with edge fade — real values extracted via
          Playwright: white cards (12px radius, 240px wide), icon image at
          full 56×56 (no smaller icon padded inside), linear-gradient mask
          fading both edges. `group` + focus/hover pause the marquee and
          reveal the chevron hints so a visitor can tell there's more to see
          in both directions and can actually stop it to read a card. */}
      <div
        role="region"
        aria-label="Amenities and lifestyle highlights, auto-scrolling"
        className="group relative mt-4 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, rgba(0,0,0,0), rgb(0,0,0) 30%, rgb(0,0,0) 70%, rgba(0,0,0,0))",
          WebkitMaskImage:
            "linear-gradient(to right, rgba(0,0,0,0), rgb(0,0,0) 30%, rgb(0,0,0) 70%, rgba(0,0,0,0))",
        }}
      >
        <div
          className="flex w-max gap-4 animate-marquee group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
        >
          {row.map((a, i) => (
            <div
              key={`${a.title}-${i}`}
              tabIndex={0}
              className="w-60 shrink-0 rounded-xl bg-white p-5 text-midpoint-dark transition-transform hover:-translate-y-1 focus:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-midpoint-cyan"
            >
              <div className="h-14 w-14 overflow-hidden rounded-lg bg-[rgba(161,189,217,0.08)]">
                <Image src={a.icon} alt="" width={56} height={56} />
              </div>
              <h3 className="mt-4 font-semibold">{a.title}</h3>
              <p className="mt-1 text-sm text-midpoint-grey-400">{a.description}</p>
            </div>
          ))}
        </div>

        {/* Edge chevrons — faint by default, brighten on hover/focus so the
            affordance is discoverable without already knowing to hover. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 opacity-40 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-midpoint-dark/70 text-sm text-white backdrop-blur-sm" aria-hidden="true">
            ←
          </span>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 opacity-40 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-midpoint-dark/70 text-sm text-white backdrop-blur-sm" aria-hidden="true">
            →
          </span>
        </div>
      </div>
    </section>
  );
}
