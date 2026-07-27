import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SpacesExplore from "@/components/SpacesExplore";
import ReadyToMoveSection from "@/components/ReadyToMoveSection";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

const description =
  "Explore Midpoint's office space, warehouse space and on-site amenities in Midrand — a connected business estate between Johannesburg and Pretoria.";

export const metadata: Metadata = {
  title: "Spaces at Midpoint | Offices, Warehouses & Amenities in Midrand",
  description
};

export default function SpacesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[{ name: "Home", path: "/" }, { name: "Spaces", path: "/spaces" }]}
        description={description}
      />
      <PageHero
        title="Spaces at Midpoint"
        subtitle="Office space, warehouse space and on-site amenities, all within one connected business estate in Midrand."
        image="https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a148a5463dac69c69cbc3a8_amenities_banner-p-1600.jpg"
        imageAlt="Midpoint business estate"
      />
      <SpacesExplore />
      <ReadyToMoveSection />
    </>
  );
}
