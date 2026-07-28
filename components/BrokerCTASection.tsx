import Link from "next/link";

export default function BrokerCTASection() {
  return (
    <section className="bg-midpoint-dark px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-3xl font-semibold md:text-4xl">For commercial and industrial brokers</h2>
        <p className="mt-4 text-midpoint-grey-100">
          Midpoint welcomes enquiries from commercial and industrial property brokers representing tenants seeking warehouse space, offices, or serviced offices in Midrand. Current vacancies range from office suites to large-scale warehouse facilities, with further developments underway. For leasing information, availability schedules, or tenant requirements, please contact the Midpoint leasing team.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/contact-us"
            className="rounded-full bg-midpoint-cyan px-6 py-3 text-sm font-semibold text-midpoint-dark"
          >
            Contact Leasing Team
          </Link>
          <Link
            href="/vacancies"
            className="rounded-full bg-midpoint-cyan px-6 py-3 text-sm font-semibold text-midpoint-dark"
          >
            View Available Space
          </Link>
        </div>
      </div>
    </section>
  );
}
