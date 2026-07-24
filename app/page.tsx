import HeroSection from "@/components/HeroSection";
import IntroSection from "@/components/IntroSection";
import FutureOfWorkSection from "@/components/FutureOfWorkSection";
import ListingsGrid from "@/components/ListingsGrid";
import LocationSection from "@/components/LocationSection";
import AmenitiesSection from "@/components/AmenitiesSection";
import BrokerCTASection from "@/components/BrokerCTASection";
import TenantWall from "@/components/TenantWall";
import DeveloperSection from "@/components/DeveloperSection";
import FaqAccordion from "@/components/FaqAccordion";
import ContactSection from "@/components/ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <IntroSection />
      <FutureOfWorkSection />
      <ListingsGrid />
      <LocationSection />
      <AmenitiesSection />
      <BrokerCTASection />
      <TenantWall />
      <DeveloperSection />
      <FaqAccordion />
      <ContactSection />
    </>
  );
}
