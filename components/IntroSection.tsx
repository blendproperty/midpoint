import Link from "next/link";
import Logo from "@/components/Logo";
import Reveal from "@/components/Reveal";

export default function IntroSection() {
  return (
    <section id="introduction" className="bg-midpoint-dark px-6 py-16 text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <Reveal className="flex justify-center lg:justify-start">
          <Logo className="h-auto w-full max-w-md" />
        </Reveal>

        <Reveal delay={120}>
          <p className="font-semibold">
            Midpoint is a commercial and industrial estate in Halfway House, Midrand. It includes conventional offices, OnPoint serviced offices and warehouse space.
          </p>
          <p className="mt-4 text-midpoint-grey-100">
            The estate is positioned on the N1 corridor between Johannesburg and Pretoria. Current sizes, rates, availability and unit-specific features are published on the vacancy schedule.
          </p>
          <p className="mt-4 text-sm text-midpoint-grey-100">
            Some images show planned work. Confirm the current condition and specification of a space during a viewing.
          </p>
          <Link
            href="/availability-report"
            className="mt-6 inline-flex rounded-full bg-midpoint-cyan px-6 py-3 text-sm font-semibold text-midpoint-dark transition-transform hover:scale-105"
          >
            View available space at Midpoint
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
