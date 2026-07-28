import type { Metadata } from "next";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { getPageSeoOverride } from "@/lib/page-seo";
import { getSiteSettings } from "@/lib/site-settings";
import { richPageJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

const FALLBACK_TITLE = "Contact Us | Midpoint";
const description =
  "Contact the Midpoint leasing team about warehouse, office and serviced office space in Midrand.";
// Same hero photo used on the real live site (mid-point.co.za/contact-us).
const HERO_IMAGE =
  "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a0b102015582cba5571f517_contact_banner-p-1600.jpg";

export async function generateMetadata(): Promise<Metadata> {
  const override = await getPageSeoOverride("/contact-us");
  return {
    title: override?.seoTitle || FALLBACK_TITLE,
    description: override?.seoDescription || description,
  };
}

// The real site intentionally has two contact forms: one in a dark
// "introduction" panel directly under the hero (this page's own content,
// below), and a second one in the footer's shared Contact section (rendered
// globally by SiteChrome on every page, alongside the map). They don't look
// duplicated on the real site because the top one is properly styled into a
// dark panel with its own intro copy — the bug in the previous version was
// that this page's own form rendered on a plain white background with no
// styling, sitting awkwardly right above the styled global one. This
// reproduces the real layout instead of removing the top form outright.
export default async function ContactUs() {
  const [settings, override] = await Promise.all([
    getSiteSettings(),
    getPageSeoOverride("/contact-us"),
  ]);
  const pageDescription = override?.seoDescription || description;
  const autoJsonLd = richPageJsonLd({
    type: "ContactPage",
    name: "Contact Us",
    description: pageDescription,
    path: "/contact-us",
  });
  const jsonLdNode =
    override?.schemaJson && typeof override.schemaJson === "object" ? override.schemaJson : autoJsonLd;

  return (
    <>
      <BreadcrumbJsonLd
        items={[{ name: "Home", path: "/" }, { name: "Contact Us", path: "/contact-us" }]}
        node={jsonLdNode as Record<string, unknown>}
      />
      <PageHero
        title="Let's find the right space for your business"
        subtitle="Contact the Midpoint team to discuss available office space, serviced offices, and warehouse opportunities in Midrand."
        image={HERO_IMAGE}
        imageAlt="Midpoint leasing team"
      />

      <section className="bg-midpoint-dark px-6 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div className="space-y-4 text-midpoint-grey-400">
            <p className="font-semibold text-white">
              Whether you are looking for office space, serviced offices, or warehouse facilities in Midrand, the
              Midpoint leasing team is ready to assist. Our team can provide detailed information on current
              vacancies, upcoming developments, space specifications, and leasing options across the estate.
            </p>
            <p>
              We work with both prospective tenants and commercial property brokers to help businesses identify
              premises that align with their operational needs, growth plans, and preferred working environment.
            </p>
            <p className="font-semibold text-white">
              Get in touch today to discuss availability, arrange a site visit, or explore the opportunities
              available at Midpoint.{" "}
              <a href="#Contact" className="text-midpoint-cyan underline">
                Enquire today
              </a>
            </p>
          </div>
          <div>
            <ContactForm siteKey={settings.recaptchaSiteKey} successMessage={settings.enquirySuccessMessage} />
          </div>
        </div>
      </section>
    </>
  );
}
