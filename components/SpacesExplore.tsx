import Link from "next/link";

const items = [
  {
    title: "Offices",
    text: "Offices to rent in Midrand — flexible suites through to full corporate headquarters.",
    href: "/offices",
    cta: "View offices"
  },
  {
    title: "Warehouses",
    text: "High-performance warehouses in Midrand with strong eaves, loading access and yard space.",
    href: "/warehouses",
    cta: "View warehouses"
  },
  {
    title: "Serviced offices",
    text: "Furnished OnPoint suites with meeting rooms, reception and flexible terms — move in and get to work.",
    href: "/offices",
    cta: "View serviced offices"
  }
];

export default function SpacesExplore() {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-24">
      <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-midpoint-cyan/30 blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <h2 className="text-3xl font-semibold text-midpoint-dark md:text-4xl">Explore Midpoint&apos;s spaces</h2>
        <p className="mt-4 max-w-2xl text-midpoint-grey-400">
          Midpoint brings together office space, warehouse space and on-site amenities within a single connected estate. Choose where to start below — each page has current availability, specifications and a direct way to get in touch.
        </p>
        <p className="mt-4 max-w-2xl text-midpoint-grey-400">
          These spaces contribute to a workplace culture that extends beyond desks, meeting rooms, and warehouse floors. Teams can meet informally, step away for a break, or recharge between meetings without leaving the estate.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="flex flex-col rounded-2xl bg-midpoint-dark p-8 text-white">
              <h3 className="text-2xl font-semibold">{item.title}</h3>
              <p className="mt-3 flex-1 text-sm text-white/70">{item.text}</p>
              <Link
                href={item.href}
                className="mt-6 inline-flex w-fit items-center gap-1 rounded-full bg-[#3898EC] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
              >
                {item.cta} →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
