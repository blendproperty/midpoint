import type { Metadata } from "next";
import Link from "next/link";
import VacancyCard from "@/components/VacancyCard";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ListingsJsonLd from "@/components/ListingsJsonLd";
import { getAllVacancies } from "@/lib/vacancies";

export const dynamic = "force-dynamic";

const description =
  "Current availability schedule for warehouse, office and serviced office space at Midpoint, Midrand.";

export const metadata: Metadata = {
  title: "Availability Report | Midpoint",
  description
};

export default async function AvailabilityReport() {
  const all = await getAllVacancies();

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <BreadcrumbJsonLd
        items={[{ name: "Home", path: "/" }, { name: "Availability Report", path: "/availability-report" }]}
        description={description}
      />
      <ListingsJsonLd listings={all} path="/availability-report" name="Midpoint availability schedule" />

      <h1 className="text-4xl font-bold text-midpoint-dark">Availability Report</h1>
      <p className="mt-4 max-w-2xl text-midpoint-grey-400">
        The full current availability schedule across the estate — warehouse, office and serviced office space.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {all.map((l) => (
          <VacancyCard key={l.id} listing={l} />
        ))}
      </div>

      <Link href="/contact-us" className="mt-10 inline-block rounded-full bg-midpoint-dark px-6 py-3 text-sm font-medium text-white">
        Request the full schedule
      </Link>
    </section>
  );
}
