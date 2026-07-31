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

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const faqs = await getFaqs();

  return (
    <>
      <HeroSection />
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
