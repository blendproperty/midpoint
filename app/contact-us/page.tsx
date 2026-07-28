import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { site } from "@/lib/site";
import { getPageSeoOverride } from "@/lib/page-seo";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

const FALLBACK_TITLE = "Contact Us | Midpoint";
const description =
  "Contact the Midpoint leasing team about warehouse, office and serviced office space in Midrand.";

export async function generateMetadata(): Promise<Metadata> {
  const override = await getPageSeoOverride("/contact-us");
  return {
    title: override?.seoTitle || FALLBACK_TITLE,
    description: override?.seoDescription || description,
  };
}

export default async function ContactUs() {
  const settings = await getSiteSettings();

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2">
      <BreadcrumbJsonLd
        items={[{ name: "Home", path: "/" }, { name: "Contact Us", path: "/contact-us" }]}
        description={description}
      />
      <div>
        <h1 className="text-4xl font-bold text-midpoint-dark">Enquire</h1>
        <p className="mt-4 text-midpoint-grey-400">
          Talk to the leasing team about availability, specifications, pricing,
          and lease structures, or to arrange a site visit.
        </p>
        <div className="mt-6 space-y-1 text-sm">
          <a className="block font-medium" href={site.phoneHref}>{site.phone}</a>
          <a className="block font-medium" href={site.emailHref}>{site.email}</a>
        </div>
      </div>
      <ContactForm siteKey={settings.recaptchaSiteKey} />
    </section>
  );
}
