import HeroSection from "@/components/HeroSection";
import IntroSection from "@/components/IntroSection";
import FutureOfWorkSection from "@/components/FutureOfWorkSection";
import ListingsGrid from "@/components/ListingsGrid";
import LocationSection from "@/components/LocationSection";
import PromoBanner from "@/components/PromoBanner";
import AmenitiesSection from "@/components/AmenitiesSection";
import BrokerCTASection from "@/components/BrokerCTASection";
import ReadyToMoveSection from "@/components/ReadyToMoveSection";
import GalleryStrip from "@/components/GalleryStrip";
import TenantWall from "@/components/TenantWall";
import DeveloperSection from "@/components/DeveloperSection";
import FaqAccordion from "@/components/FaqAccordion";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <IntroSection />
      <FutureOfWorkSection />
      <ListingsGrid />
      <LocationSection />
      <PromoBanner />
      <AmenitiesSection />
      <BrokerCTASection />
      <ReadyToMoveSection />
      <GalleryStrip />
      <TenantWall />
      <DeveloperSection />
      <FaqAccordion />
    </>
  );
}
