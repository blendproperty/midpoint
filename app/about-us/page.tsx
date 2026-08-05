import type { Metadata } from "next";
import AboutHero from "@/components/AboutHero";
import StrategicGrowth from "@/components/StrategicGrowth";
import RenewedVision from "@/components/RenewedVision";
import SpaceGrid from "@/components/SpaceGrid";
import DeveloperSection from "@/components/DeveloperSection";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getPageSeoOverride } from "@/lib/page-seo";
import { richPageJsonLd, stripSiteNameSuffix } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-settings";
import { pageRobots } from "@/lib/indexing";

export const dynamic = "force-dynamic";

const FALLBACK_TITLE = "About Us";
const FALLBACK_DESCRIPTION =
  "Midpoint is a commercial and industrial estate in Halfway House, Midrand, with offices, OnPoint serviced offices and warehouse space.";

export async function generateMetadata(): Promise<Metadata> {
  const [override, settings] = await Promise.all([getPageSeoOverride("/about-us"), getSiteSettings()]);
  const rawTitle = override?.seoTitle || FALLBACK_TITLE;
  return {
    title: stripSiteNameSuffix(rawTitle, settings.siteName),
    description: override?.seoDescription || FALLBACK_DESCRIPTION,
    robots: pageRobots(override?.noIndex),
  };
}

export default async function AboutUsPage() {
  const override = await getPageSeoOverride("/about-us");
  const description = override?.seoDescription || FALLBACK_DESCRIPTION;
  const breadcrumbItems = [{ name: "Home", path: "/" }, { name: "About Us", path: "/about-us" }];

  // Schema is always generated automatically from real content (address,
  // amenities, Blend Property Group details) — there is no manual override
  // to save a worse or blank version over this.
  const jsonLdNode = richPageJsonLd({
    type: "AboutPage",
    name: FALLBACK_TITLE,
    description,
    path: "/about-us",
  });

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} node={jsonLdNode} />
      <Breadcrumbs items={breadcrumbItems} />
      <AboutHero />
      <StrategicGrowth />
      <RenewedVision />
      <SpaceGrid />
      <DeveloperSection
        image="/images/about/about-footer.jpg"
        imageAlt="Aerial view of Midpoint business estate"
        label="Property Developer"
        heading="Developed by property professionals."
        paragraphs={[
          "Midpoint is owned by Blend Property Group, a South African commercial property company established in 2006.",
          "Blend invests in, develops and redevelops office, industrial and retail property in South Africa. Its Johannesburg office is located at Midpoint."
        ]}
        linkHref="https://www.blendproperty.co.za/"
        linkLabel="www.blend.co.za"
      />
    </>
  );
}
