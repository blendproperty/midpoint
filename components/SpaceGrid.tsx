import Reveal from "@/components/Reveal";

const principles = [
  {
    number: "01",
    title: "Long-term stewardship",
    text: "Midpoint is managed as a living business precinct, with continued investment in the estate, its infrastructure and the experience of the companies based here.",
  },
  {
    number: "02",
    title: "Designed around people",
    text: "Landscaped outdoor areas, everyday amenities and opportunities to connect support a more balanced working environment for teams across the estate.",
  },
  {
    number: "03",
    title: "Operationally practical",
    text: "Access, security, resilient infrastructure and adaptable property are considered together so businesses can operate efficiently as their requirements evolve.",
  },
];

export default function SpaceGrid() {
  return (
    <section className="relative overflow-hidden bg-white px-6 py-24">
      <div className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-midpoint-cyan/20 blur-3xl" />
      <div className="relative mx-auto max-w-6xl">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-midpoint-grey-400">How we think</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
            <h2 className="text-3xl font-semibold leading-tight text-midpoint-dark md:text-5xl">
              A precinct built to keep evolving.
            </h2>
            <p className="max-w-2xl leading-7 text-midpoint-grey-400">
              Midpoint is more than a collection of buildings. It is an established business community shaped by
              thoughtful ownership, practical property experience and a long-term view of how workplaces should perform.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 divide-y divide-midpoint-dark/10 border-y border-midpoint-dark/10">
          {principles.map((principle, index) => (
            <Reveal key={principle.number} delay={index * 90}>
              <div className="grid gap-5 py-9 md:grid-cols-[80px_0.8fr_1.2fr] md:items-start">
                <span className="text-sm font-semibold text-midpoint-cyan">{principle.number}</span>
                <h3 className="text-2xl font-semibold text-midpoint-dark">{principle.title}</h3>
                <p className="max-w-2xl text-sm leading-7 text-midpoint-grey-400">{principle.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
