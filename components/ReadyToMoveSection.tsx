import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function ReadyToMoveSection() {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto flex max-w-7xl justify-center">
        <Link
          href="/vacancies"
          className="group relative flex min-h-[380px] w-full items-center overflow-hidden rounded-card md:min-h-[460px]"
        >
          <Image
            src="/images/gallery/gallery-4.avif"
            alt="Landscaped gardens and water feature at Midpoint Business Park"
            fill
            sizes="(min-width: 1280px) 1280px, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-midpoint-dark/90 via-midpoint-dark/50 to-midpoint-dark/5" />

          <Reveal className="relative max-w-2xl px-8 text-white sm:px-14">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-midpoint-cyan">Current opportunities</p>
            <p className="mt-4 text-4xl font-semibold leading-tight sm:text-6xl">Ready to find your space?</p>
            <p className="mt-4 max-w-lg text-sm leading-6 text-white/75 sm:text-base">
              Explore available offices, warehouses and flexible workspace within one connected Midrand estate.
            </p>
            <span className="mt-7 inline-flex items-center gap-2 rounded-full bg-midpoint-cyan px-5 py-3 text-sm font-semibold text-midpoint-dark transition-transform duration-150 ease-out group-hover:translate-x-1 sm:text-base">
              Check availability now
              <span aria-hidden="true">&rarr;</span>
            </span>
          </Reveal>
        </Link>
      </div>
    </section>
  );
}
