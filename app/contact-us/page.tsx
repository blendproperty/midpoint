import type { Metadata } from "next";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PageHero from "@/components/PageHero";
import { getPageSeoOverride } from "@/lib/page-seo";

export const dynamic = "force-dynamic";

const FALLBACK_TITLE = "Contact Us | Midpoint";
const description =
  "Contact the Midpoint leasing team about warehouse, office and serviced office space in Midrand.";
const HERO_IMAGE =
  "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a148a5463dac69c69cbc3a8_amenities_banner-p-1600.jpg";

export async function generateMetadata(): Promise<Metadata> {
  const override = await getPageSeoOverride("/contact-us");
  return {
    title: override?.seoTitle || FALLBACK_TITLE,
    description: override?.seoDescription || description,
  };
}

// NOTE: this page deliberately has no form of its own. SiteChrome already
// renders the shared, fully-styled <ContactSection> (form + phone/email +
// map) on every page just above the footer — this page previously also
// rendered its own separate bare-bones form, which stacked directly under
// that shared section and produced the "two contact forms, one of them
// unstyled" bug. Removed rather than restyled, since one well-designed
// contact block beats maintaining two.
export default async function ContactUs() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[{ name: "Home", path: "/" }, { name: "Contact Us", path: "/contact-us" }]}
        description={description}
      />
      <PageHero
        title="Let's find the right space for your business"
        subtitle="Contact the Midpoint team to discuss available office space, serviced offices, and warehouse opportunities in Midrand."
        image={HERO_IMAGE}
        imageAlt="Midpoint leasing team"
      />
    </>
  );
}
