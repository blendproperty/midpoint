import type { Metadata } from "next";
import VacancySchedule from "@/components/VacancySchedule";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import ListingsJsonLd from "@/components/ListingsJsonLd";
import { getVacanciesGroupedBySector, buildVacancyWhatsappMessage, type VacancyListing } from "@/lib/vacancies";
import { getSiteSettings } from "@/lib/site-settings";
import { calculateSpaceRange, type SpaceCalculatorValues } from "@/lib/space-calculator";

export const dynamic = "force-dynamic";

const description =
  "Current leasing opportunities at Midpoint: warehouse, office and serviced office vacancies in Midrand.";

export const metadata: Metadata = {
  title: "Vacancies",
  description
};

export default async function Vacancies({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const initialQuery = typeof params.q === "string" ? params.q : "";
  const calculatorRequested = params.calculate === "1";
  const initialSector = calculatorRequested ? "Office" : (["Office", "Warehouse", "Serviced office"].includes(String(params.sector)) ? String(params.sector) as "Office" | "Warehouse" | "Serviced office" : "ALL");
  const initialAvailability = typeof params.availability === "string" ? params.availability : "ALL";
  const numberParam = (key: string, fallback: number) => {
    const value = Number(params[key]);
    return Number.isFinite(value) ? Math.max(0, value) : fallback;
  };
  const calculatorValues: SpaceCalculatorValues = {
    employees: numberParam("employees", 20),
    privateOffices: numberParam("privateOffices", 2),
    meetingRooms: numberParam("meetingRooms", 2),
    collaborationSeats: numberParam("collaborationSeats", 8),
  };
  const initialCalculatedRange = calculatorRequested ? calculateSpaceRange(calculatorValues) : null;
  const requestedSize = typeof params.size === "string" ? params.size : "ALL";
  const initialSize = initialCalculatedRange ? "CALCULATED" : (["ALL", "UP_TO_250", "250_500", "500_1000", "OVER_1000"].includes(requestedSize) ? requestedSize : "ALL");
  const [{ all }, settings] = await Promise.all([
    getVacanciesGroupedBySector(),
    getSiteSettings(),
  ]);

  const whatsappDigits = settings.whatsapp.replace(/\D/g, "");

  // Built once per listing here (server-side) rather than in VacancyCard,
  // since the WhatsApp number/template live in Site Settings and this is a
  // server component that already has them to hand.
  function whatsappUrlFor(listing: VacancyListing) {
    if (!whatsappDigits) return null;
    const message = buildVacancyWhatsappMessage(settings.whatsappTemplate, listing, settings.domain);
    return `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(message)}`;
  }

  const whatsappUrls = Object.fromEntries(all.map((listing) => [listing.id, whatsappUrlFor(listing) || ""]));
  const breadcrumbItems = [{ name: "Home", path: "/" }, { name: "Vacancies", path: "/vacancies" }];

  return (
    <div className="bg-white">
      <BreadcrumbJsonLd items={breadcrumbItems} description={description} />
      <Breadcrumbs items={breadcrumbItems} />
      <ListingsJsonLd listings={all} path="/vacancies" name="Midpoint vacancies" />

      <section className="mx-auto max-w-7xl px-6 pb-16 pt-8">
        <h1 className="text-4xl font-bold text-midpoint-dark md:text-5xl">Vacancies</h1>
        <p className="mt-4 max-w-2xl text-midpoint-grey-400">
          Current warehouse, office and serviced office space available to lease at Midpoint, Midrand.
        </p>
      </section>

      <VacancySchedule listings={all} whatsappUrls={whatsappUrls} initialQuery={initialQuery} initialSector={initialSector} initialAvailability={initialAvailability} initialSize={initialSize as "ALL" | "UP_TO_250" | "250_500" | "500_1000" | "OVER_1000" | "CALCULATED"} initialCalculatedRange={initialCalculatedRange} calculatorValues={calculatorValues} />
    </div>
  );
}
