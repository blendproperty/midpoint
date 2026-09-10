import HeroSection from "@/components/HeroSection";
import IntroSection from "@/components/IntroSection";
import FutureOfWorkSection from "@/components/FutureOfWorkSection";
import ListingsGrid from "@/components/ListingsGrid";
import LocationSection from "@/components/LocationSection";
import AmenitiesSection from "@/components/AmenitiesSection";
import BrokerCTASection from "@/components/BrokerCTASection";
import ReadyToMoveSection from "@/components/ReadyToMoveSection";
import GalleryStrip from "@/components/GalleryStrip";
import TenantWall from "@/components/TenantWall";
import DeveloperSection from "@/components/DeveloperSection";
import FaqAccordion from "@/components/FaqAccordion";
import { getFaqs } from "@/lib/faqs";
import BookingSearch from "@/components/BookingSearch";
import { isStagingHost } from "@/lib/staging-host";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const faqs = await getFaqs();
  const staging = await isStagingHost();

  return (
    <>
      <HeroSection />
      {staging && (
        <section className="bg-[#f4efe5] px-6 py-12">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-5 text-3xl text-[#27362f]">
              Find your stay at The Suites at Midpoint
            </h2>
            <p className="mb-5 text-sm text-stone-600">
              Test reservations · no charges · sample rates
            </p>
            <BookingSearch />
          </div>
        </section>
      )}
      <IntroSection />
      <FutureOfWorkSection />
      <ListingsGrid />
      <LocationSection />
      <AmenitiesSection />
      <BrokerCTASection />
      <ReadyToMoveSection />
      <GalleryStrip />
      <TenantWall />
      <DeveloperSection />
      <FaqAccordion faqs={faqs} />
    </>
  );
}
