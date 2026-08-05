import Link from "next/link";

export default function BrokerCTASection() {
  return (
    <section className="bg-midpoint-dark px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-3xl font-semibold md:text-4xl">For commercial and industrial brokers</h2>
        <p className="mt-4 text-midpoint-grey-100">
          Brokers can use the live vacancy schedule for current published units and contact the Midpoint leasing team for specifications, viewing access and tenant requirements.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/contact-us"
            className="rounded-full bg-midpoint-cyan px-6 py-3 text-sm font-semibold text-midpoint-dark transition-transform hover:scale-105"
          >
            Contact Leasing Team
          </Link>
          <Link
            href="/vacancies"
            className="rounded-full border border-white/30 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            View Available Space
          </Link>
        </div>
      </div>
    </section>
  );
}
