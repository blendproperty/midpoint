import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SpacesExplore from "@/components/SpacesExplore";
import AmenitiesSection from "@/components/AmenitiesSection";
import ReadyToMoveSection from "@/components/ReadyToMoveSection";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getPageSeoOverride } from "@/lib/page-seo";
import { richPageJsonLd } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-settings";
import { buildPageMetadata } from "@/lib/seo-metadata";

export const dynamic = "force-dynamic";

const FALLBACK_TITLE = "Spaces at Midpoint | Offices, Warehouses & Amenities in Midrand";
const description =
  "Explore Midpoint's office space, warehouse space and on-site amenities in Midrand — a connected business estate between Johannesburg and Pretoria.";

export async function generateMetadata(): Promise<Metadata> {
  const [override, settings] = await Promise.all([getPageSeoOverride("/spaces"), getSiteSettings()]);
  return buildPageMetadata({ path: "/spaces", title: FALLBACK_TITLE, description, fields: override, settings });
}

export default async function SpacesPage() {
  const override = await getPageSeoOverride("/spaces");
  const pageDescription = override?.seoDescription || description;
  const breadcrumbItems = [{ name: "Home", path: "/" }, { name: "Spaces", path: "/spaces" }];

  const jsonLdNode = richPageJsonLd({
    type: "CollectionPage",
    name: "Spaces at Midpoint",
    description: pageDescription,
    path: "/spaces",
  });

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} node={jsonLdNode} />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHero
        title="A better place to do business"
        subtitle="Offices, warehouses and flexible workspace—connected by one secure, amenity-rich business estate in the heart of Midrand."
        image="/images/pages/amenities-banner.jpg"
        imageAlt="Midpoint business estate"
      />
      <SpacesExplore />
      <AmenitiesSection />
      <ReadyToMoveSection />
    </>
  );
}
