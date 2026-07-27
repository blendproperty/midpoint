import type { Metadata } from "next";
import Link from "next/link";
import VacancyCard from "@/components/VacancyCard";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ListingsJsonLd from "@/components/ListingsJsonLd";
import { allVacancyListings } from "@/lib/vacancies";

const description =
  "Current availability schedule for warehouse, office and serviced office space at Midpoint, Midrand.";

export const metadata: Metadata = {
  title: "Availability Report | Midpoint",
  description
};

export default function AvailabilityReport() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <BreadcrumbJsonLd
        items={[{ name: "Home", path: "/" }, { name: "Availability Report", path: "/availability-report" }]}
        description={description}
      />
      <ListingsJsonLd listings={allVacancyListings} path="/availability-report" name="Midpoint availability schedule" />

      <h1 className="text-4xl font-bold text-midpoint-dark">Availability Report</h1>
      <p className="mt-4 max-w-2xl text-midpoint-grey-400">
        The full current availability schedule across the estate — warehouse, office and serviced office space.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {allVacancyListings.map((l) => (
          <VacancyCard key={l.id} listing={l} />
        ))}
      </div>

      <Link href="/contact-us" className="mt-10 inline-block rounded-full bg-midpoint-dark px-6 py-3 text-sm font-medium text-white">
        Request the full schedule
      </Link>
    </section>
  );
}
