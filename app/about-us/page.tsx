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

export const dynamic = "force-dynamic";

const FALLBACK_TITLE = "About Us";
const FALLBACK_DESCRIPTION =
  "Midpoint is a modern business estate in Midrand offering premium offices, serviced offices, and warehouse facilities. Developed by Blend Property Group.";

export async function generateMetadata(): Promise<Metadata> {
  const [override, settings] = await Promise.all([getPageSeoOverride("/about-us"), getSiteSettings()]);
  const rawTitle = override?.seoTitle || FALLBACK_TITLE;
  return {
    title: stripSiteNameSuffix(rawTitle, settings.siteName),
    description: override?.seoDescription || FALLBACK_DESCRIPTION,
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
          "Midpoint is owned by Blend Property Group, a South African property company with extensive experience in the commercial and industrial sectors.",
          "Since 2006, Blend Property Group has specialised in the development and investment of commercial and industrial properties across South Africa. Guided by a commitment to innovation and design excellence, the company has become recognised for creating work environments that are both functional and adaptable to the evolving needs of modern tenants.",
          "Blend’s developments focus on enhancing productivity, operational efficiency, and long-term staff satisfaction. These principles are clearly reflected in the continued evolution of Midpoint."
        ]}
        linkHref="https://www.blendproperty.co.za/"
        linkLabel="www.blend.co.za"
      />
    </>
  );
}
