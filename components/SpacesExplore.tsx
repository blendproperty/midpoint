import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getVacanciesGroupedBySector } from "@/lib/vacancies";

const items = [
  {
    title: "Offices",
    text: "Flexible suites through to full corporate headquarters, with prime finishes and on-site security.",
    href: "/offices",
    cta: "View offices",
    image: "/images/listings/2-weaver-avenue.png",
    sectorKey: "office" as const,
  },
  {
    title: "Warehouses",
    text: "High-performance industrial space with strong eaves, dock levellers and dedicated yard access.",
    href: "/warehouses",
    cta: "View warehouses",
    image: "/images/listings/6-weaver-avenue.png",
    sectorKey: "warehouse" as const,
  },
  {
    title: "Serviced offices",
    text: "Furnished OnPoint suites with meeting rooms, reception and an on-site barista — move in and get to work.",
    href: "/services-offices",
    cta: "View serviced offices",
    image: "/images/listings/onpoint.jpeg",
    sectorKey: "servicedOffice" as const,
  },
];

export default async function SpacesExplore() {
  const grouped = await getVacanciesGroupedBySector();

  return (
    <section className="relative overflow-hidden bg-white px-6 py-24">
      <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-midpoint-cyan/30 blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <h2 className="text-3xl font-semibold text-midpoint-dark md:text-4xl">Explore Midpoint&apos;s spaces</h2>
        <p className="mt-4 max-w-2xl text-midpoint-grey-400">
          Office space, warehouse space and on-site amenities within a single connected estate — pick where to start
          below for current availability, specifications and a direct way to get in touch.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((item, i) => {
            const count = grouped[item.sectorKey].length;
            return (
              <Reveal key={item.title} delay={i * 100}>
                <Link
                  href={item.href}
                  className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-card"
                >
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midpoint-dark via-midpoint-dark/40 to-transparent" />

                  {count > 0 && (
                    <span className="absolute right-4 top-4 rounded-full bg-midpoint-cyan px-3 py-1 text-xs font-semibold text-midpoint-dark">
                      {count} available now
                    </span>
                  )}

                  <div className="relative flex flex-col gap-3 p-8 text-white">
                    <h3 className="text-2xl font-semibold">{item.title}</h3>
                    <p className="text-sm text-white/75">{item.text}</p>
                    <span className="mt-2 inline-flex w-fit items-center gap-1 rounded-full bg-midpoint-cyan px-4 py-2 text-sm font-medium text-midpoint-dark transition-transform duration-150 ease-out group-hover:translate-x-1">
                      {item.cta} →
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
