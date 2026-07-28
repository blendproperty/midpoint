import type { Metadata } from "next";
import AboutHero from "@/components/AboutHero";
import StrategicGrowth from "@/components/StrategicGrowth";
import RenewedVision from "@/components/RenewedVision";
import SpaceGrid from "@/components/SpaceGrid";
import DeveloperSection from "@/components/DeveloperSection";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { getPageSeoOverride } from "@/lib/page-seo";
import { richPageJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

const FALLBACK_TITLE = "About Us";
const FALLBACK_DESCRIPTION =
  "Midpoint is a modern business estate in Midrand offering premium offices, serviced offices, and warehouse facilities. Developed by Blend Property Group.";

export async function generateMetadata(): Promise<Metadata> {
  const override = await getPageSeoOverride("/about-us");
  return {
    title: override?.seoTitle || FALLBACK_TITLE,
    description: override?.seoDescription || FALLBACK_DESCRIPTION,
  };
}

export default async function AboutUsPage() {
  const override = await getPageSeoOverride("/about-us");
  const description = override?.seoDescription || FALLBACK_DESCRIPTION;

  // Prefer a custom schema saved in /admin/page-seo if one exists; otherwise
  // fall back to the rich auto-generated AboutPage schema (real address,
  // amenities, and Blend Property Group details — not a flat, often-blank
  // WebPage like before).
  const autoJsonLd = richPageJsonLd({
    type: "AboutPage",
    name: FALLBACK_TITLE,
    description,
    path: "/about-us",
  });
  const jsonLdNode =
    override?.schemaJson && typeof override.schemaJson === "object" ? override.schemaJson : autoJsonLd;

  return (
    <>
      <BreadcrumbJsonLd
        items={[{ name: "Home", path: "/" }, { name: "About Us", path: "/about-us" }]}
        node={jsonLdNode as Record<string, unknown>}
      />
      <AboutHero />
      <StrategicGrowth />
      <RenewedVision />
      <SpaceGrid />
      <DeveloperSection
        image="https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/69fdc3d8fc1775799f21d373_About-footer-p-1600.jpg"
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
