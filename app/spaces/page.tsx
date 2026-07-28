import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SpacesExplore from "@/components/SpacesExplore";
import ReadyToMoveSection from "@/components/ReadyToMoveSection";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { getPageSeoOverride } from "@/lib/page-seo";
import { richPageJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

const FALLBACK_TITLE = "Spaces at Midpoint | Offices, Warehouses & Amenities in Midrand";
const description =
  "Explore Midpoint's office space, warehouse space and on-site amenities in Midrand — a connected business estate between Johannesburg and Pretoria.";

export async function generateMetadata(): Promise<Metadata> {
  const override = await getPageSeoOverride("/spaces");
  return {
    title: override?.seoTitle || FALLBACK_TITLE,
    description: override?.seoDescription || description,
  };
}

export default async function SpacesPage() {
  const override = await getPageSeoOverride("/spaces");
  const pageDescription = override?.seoDescription || description;

  const jsonLdNode = richPageJsonLd({
    type: "CollectionPage",
    name: "Spaces at Midpoint",
    description: pageDescription,
    path: "/spaces",
  });

  return (
    <>
      <BreadcrumbJsonLd
        items={[{ name: "Home", path: "/" }, { name: "Spaces", path: "/spaces" }]}
        node={jsonLdNode}
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
