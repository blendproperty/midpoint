import Link from "next/link";
import { ArrowUpRight, Bike } from "lucide-react";
import AmenityGallery from "@/components/AmenityGallery";

const highlights = [
  {
    key: "fond", name: "Fond", label: "Eat & connect", number: "01",
    description: "Coffee, a working lunch or a catch-up after hours. Make space for good food and great company at Fond restaurant and bar.",
    photos: ["Light-filled dining room and bar at Fond", "Fond restaurant exterior at Midpoint", "A selection of dishes at Fond", "Seating and counter inside Fond restaurant"],
  },
  {
    key: "gym", name: "Gym", label: "Move & recharge", number: "02",
    description: "A change of pace, right on the estate. Bring movement into your working day with a dedicated space to train and recharge.",
    photos: ["Gym training floor with an orange running track", "Indoor cycling equipment in the gym", "Strength equipment and training area", "Gym reception and seating area"],
  },
  {
    key: "padel", name: "Padel", label: "Play & unwind", number: "03",
    description: "Take your next catch-up to the court. Rooftop padel brings a fresh perspective to team time and the end of the working day.",
    photos: ["Rooftop padel courts and outdoor seating at Midpoint", "View along a green padel court", "Covered seating beside the padel courts", "Glass-sided rooftop padel court"],
  },
  {
    key: "suites", name: "The Suites at Midpoint", label: "Stay & settle in", number: "04",
    description: "Corporate accommodation for visiting executives, business travellers and project teams. Stay close to your workplace and the life of the estate.",
    photos: ["Bedroom and workspace at The Suites at Midpoint", "Bedroom with mirror at The Suites at Midpoint", "Suite wardrobe and refreshment area", "Bathroom at The Suites at Midpoint"],
  },
];

export default function AmenitiesSection({ detail = false }: { detail?: boolean }) {
  return (
    <section id="Amenities" aria-labelledby="amenities-heading" className="bg-midpoint-dark py-16 text-white md:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10 grid gap-6 md:grid-cols-[1.3fr_1fr] md:items-end md:gap-16">
          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-midpoint-cyan">Amenities &amp; lifestyle</p>
            <h2 id="amenities-heading" className="max-w-xl text-4xl font-medium leading-[1.08] tracking-tight md:text-5xl">More to your day.<br /><span className="text-white/65">All at Midpoint.</span></h2>
          </div>
          <div>
            <p className="max-w-md text-base leading-relaxed text-white/75">From your first coffee to your final set. Discover the spaces that bring food, fitness, connection and corporate stays together.</p>
            <Link href={detail ? "/contact-us" : "/amenities"} className="mt-5 inline-flex min-h-11 items-center gap-3 border-b border-midpoint-cyan/50 pb-1 text-sm font-semibold text-midpoint-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-midpoint-cyan">
              {detail ? "Enquire about the amenities" : "Explore all amenities"}<ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {highlights.map((item) => (
            <article key={item.key} className="min-w-0 rounded-[1.5rem] bg-[#133333]">
              <AmenityGallery name={item.name} photos={item.photos.map((alt, i) => ({ src: `/images/amenities/hub/${item.key}-${i + 1}.webp`, alt }))} />
              <div className="p-6 lg:p-7">
                <div className="mb-3 flex items-center justify-between text-xs font-medium uppercase tracking-[0.14em] text-midpoint-cyan"><span>{item.label}</span><span className="text-white/45" aria-hidden="true">{item.number}</span></div>
                <h3 className="text-2xl font-medium tracking-tight">{item.name}</h3>
                <p className="mt-3 text-sm leading-6 text-white/75">{item.description}</p>
                {item.key === "suites" && <Link href="/the-suites-at-midpoint" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-midpoint-cyan underline-offset-4 hover:underline">Explore The Suites<ArrowUpRight size={16} aria-hidden="true" /></Link>}
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-5 border-t border-white/15 pt-7 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-white/60">{detail ? "Confirm operating hours, access and availability with the leasing team." : "There’s more to explore across the estate"}</p>
          <ul className="flex flex-wrap gap-x-7 gap-y-4 text-sm text-white/85">

            <li className="flex items-center gap-2"><Bike size={17} className="text-midpoint-cyan" aria-hidden="true" />Walking, running &amp; cycling trails</li>

          </ul>
        </div>
      </div>
    </section>
  );
}
