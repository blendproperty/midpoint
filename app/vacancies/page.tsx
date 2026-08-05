import type { Metadata } from "next";
import VacancySchedule from "@/components/VacancySchedule";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import ListingsJsonLd from "@/components/ListingsJsonLd";
import { getVacanciesGroupedBySector, buildVacancyWhatsappMessage, type VacancyListing } from "@/lib/vacancies";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

const description =
  "Current leasing opportunities at Midpoint: warehouse, office and serviced office vacancies in Midrand.";

export const metadata: Metadata = {
  title: "Vacancies",
  description
};

export default async function Vacancies() {
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

      <VacancySchedule listings={all} whatsappUrls={whatsappUrls} />
    </div>
  );
}
