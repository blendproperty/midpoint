import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getVacanciesGroupedBySector } from "@/lib/vacancies";

const items = [
  {
    title: "Offices",
    text: "Flexible suites through to full corporate headquarters, with prime finishes and on-site security.",
    href: "/offices",
    cta: "Explore offices",
    image: "/images/listings/2-weaver-avenue.png",
    sectorKey: "office" as const,
    highlights: ["Flexible floorplates", "Backup infrastructure", "On-site amenities"],
    featured: true,
  },
  {
    title: "Warehouses",
    text: "High-performance industrial space with strong eaves, loading infrastructure and dedicated yard access.",
    href: "/warehouses",
    cta: "Explore warehouses",
    image: "/images/pillars/warehouses/warehouse-exterior.webp",
    sectorKey: "warehouse" as const,
    highlights: ["Loading access", "Generous yards", "Office components"],
    featured: false,
  },
  {
    title: "Serviced offices",
    text: "Furnished OnPoint suites with meeting rooms, reception and an on-site barista—ready when your team is.",
    href: "/services-offices",
    cta: "Explore serviced offices",
    image: "/images/listings/onpoint.jpeg",
    sectorKey: "servicedOffice" as const,
    highlights: ["Furnished suites", "Flexible terms", "Shared meeting rooms"],
    featured: false,
  },
];

export default async function SpacesExplore() {
  const grouped = await getVacanciesGroupedBySector();
  const totalAvailable = items.reduce((total, item) => total + grouped[item.sectorKey].length, 0);

  return (
    <section className="relative overflow-hidden bg-midpoint-dark px-6 py-24 text-white">
      <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-midpoint-cyan/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-midpoint-cyan/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <div className="grid gap-10 border-b border-white/15 pb-12 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-midpoint-cyan">Find your space</p>
              <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">Built for the way your business works.</h2>
              <p className="mt-5 max-w-2xl leading-7 text-white/65">
                Compare the three ways to occupy Midpoint, then view specifications, current opportunities and the right contact for an inspection.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div><p className="text-4xl font-semibold text-midpoint-cyan">{totalAvailable}</p><p className="mt-1 text-xs uppercase tracking-wide text-white/55">Available now</p></div>
              <div><p className="text-4xl font-semibold text-midpoint-cyan">3</p><p className="mt-1 text-xs uppercase tracking-wide text-white/55">Space types</p></div>
              <div className="hidden sm:block"><p className="text-4xl font-semibold text-midpoint-cyan">1</p><p className="mt-1 text-xs uppercase tracking-wide text-white/55">Connected estate</p></div>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {items.map((item, index) => {
            const count = grouped[item.sectorKey].length;
            return (
              <Reveal key={item.title} delay={index * 100} className={item.featured ? "lg:row-span-2" : ""}>
                <Link href={item.href} className={`group relative flex h-full min-h-[430px] flex-col justify-end overflow-hidden rounded-card ${item.featured ? "lg:min-h-[760px]" : "lg:min-h-[367px]"}`}>
                  <Image src={item.image} alt={`${item.title} at Midpoint Business Park`} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-midpoint-dark/55 to-transparent" />
                  <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-6 md:p-8">
                    <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-midpoint-dark backdrop-blur">{item.featured ? "Featured workspace" : "Midpoint space"}</span>
                    <span className="rounded-full bg-midpoint-cyan px-3 py-1 text-xs font-semibold text-midpoint-dark">{count > 0 ? `${count} available now` : "Enquire for availability"}</span>
                  </div>
                  <div className="relative p-7 md:p-9">
                    <h3 className={`${item.featured ? "text-4xl md:text-5xl" : "text-3xl"} font-semibold`}>{item.title}</h3>
                    <p className="mt-4 max-w-xl text-sm leading-6 text-white/75">{item.text}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {item.highlights.map((highlight) => <span key={highlight} className="rounded-full border border-white/25 px-3 py-1 text-xs text-white/80">{highlight}</span>)}
                    </div>
                    <span className="mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-midpoint-cyan px-5 py-3 text-sm font-semibold text-midpoint-dark transition-transform group-hover:translate-x-1">{item.cta} <span aria-hidden="true">&rarr;</span></span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={250}>
          <div className="mt-10 flex flex-col justify-between gap-6 rounded-card border border-white/15 bg-white/5 p-7 backdrop-blur md:flex-row md:items-center md:p-9">
            <div><p className="text-xl font-semibold">Not sure which format fits?</p><p className="mt-2 text-sm text-white/60">View every current opportunity or let the leasing team narrow the options with you.</p></div>
            <div className="flex flex-wrap gap-3">
              <Link href="/vacancies" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-midpoint-dark">View all availability</Link>
              <Link href="/contact-us" className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-white">Talk to leasing</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
