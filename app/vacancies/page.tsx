import type { Metadata } from "next";
import Link from "next/link";
import VacancyCard from "@/components/VacancyCard";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ListingsJsonLd from "@/components/ListingsJsonLd";
import { getVacanciesGroupedBySector } from "@/lib/vacancies";

export const dynamic = "force-dynamic";

const description =
  "Current leasing opportunities at Midpoint: warehouse, office and serviced office vacancies in Midrand.";

export const metadata: Metadata = {
  title: "Vacancies",
  description
};

export default async function Vacancies() {
  const { warehouse, office, servicedOffice, all } = await getVacanciesGroupedBySector();

  return (
    <div className="bg-white">
      <BreadcrumbJsonLd
        items={[{ name: "Home", path: "/" }, { name: "Vacancies", path: "/vacancies" }]}
        description={description}
      />
      <ListingsJsonLd listings={all} path="/vacancies" name="Midpoint vacancies" />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-4xl font-bold text-midpoint-dark md:text-5xl">Vacancies</h1>
        <p className="mt-4 max-w-2xl text-midpoint-grey-400">
          Current warehouse, office and serviced office space available to lease at Midpoint, Midrand.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <h2 className="text-2xl font-bold text-midpoint-dark md:text-3xl">Available Warehouse Space</h2>
        <p className="mt-2 max-w-2xl text-midpoint-grey-400">Below are the warehouse opportunities currently available at Midpoint:</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {warehouse.map((l) => (
            <VacancyCard key={l.id} listing={l} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <h2 className="text-2xl font-bold text-midpoint-dark md:text-3xl">Available Office Space</h2>
        <p className="mt-2 max-w-2xl text-midpoint-grey-400">Below are the office spaces currently available at Midpoint:</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {office.map((l) => (
            <VacancyCard key={l.id} listing={l} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <h2 className="text-2xl font-bold text-midpoint-dark md:text-3xl">Shared Workspace</h2>
        <p className="mt-2 max-w-2xl text-midpoint-grey-400">Below is the shared workspace currently available at Midpoint:</p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {servicedOffice.map((l) => (
            <VacancyCard key={l.id} listing={l} />
          ))}
        </div>

        <Link href="/contact-us" className="mt-4 inline-block rounded-full bg-midpoint-dark px-6 py-3 text-sm font-medium text-white">
          Enquire about a space
        </Link>
      </section>
    </div>
  );
}
