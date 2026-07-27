import Link from "next/link";

type Listing = { title: string; text: string };

type Props = {
  eyebrow: string;
  intro: string;
  listings: Listing[];
  ctaHref: string;
  ctaLabel: string;
};

export default function ListingsPreview({ eyebrow, intro, listings, ctaHref, ctaLabel }: Props) {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-bold text-midpoint-dark md:text-3xl">{eyebrow}</h2>
        <p className="mt-3 max-w-2xl text-midpoint-grey-400">{intro}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {listings.map((l) => (
            <div key={l.title} className="rounded-2xl bg-midpoint-dark p-6 text-white">
              <h3 className="text-lg font-semibold">{l.title}</h3>
              <p className="mt-2 text-sm text-white/70">{l.text}</p>
            </div>
          ))}
        </div>

        <Link
          href={ctaHref}
          className="mt-8 inline-flex w-fit items-center gap-1 rounded-full bg-[#3898EC] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          {ctaLabel} →
        </Link>
      </div>
    </section>
  );
}
