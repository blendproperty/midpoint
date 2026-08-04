import type { Metadata } from "next";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { getPageSeoOverride } from "@/lib/page-seo";
import { getSiteSettings } from "@/lib/site-settings";
import { richPageJsonLd, stripSiteNameSuffix } from "@/lib/seo";
import { site } from "@/lib/site";
import { pageRobots } from "@/lib/indexing";

export const dynamic = "force-dynamic";

const FALLBACK_TITLE = "Contact Us";
const description =
  "Contact the Midpoint leasing team about warehouse, office and serviced office space in Midrand.";
// Same hero photo used on the real live site (mid-point.co.za/contact-us).
const HERO_IMAGE =
  "/images/pages/contact-banner.jpg";

export async function generateMetadata(): Promise<Metadata> {
  const [override, settings] = await Promise.all([getPageSeoOverride("/contact-us"), getSiteSettings()]);
  const rawTitle = override?.seoTitle || FALLBACK_TITLE;
  return {
    title: stripSiteNameSuffix(rawTitle, settings.siteName),
    description: override?.seoDescription || description,
    robots: pageRobots(override?.noIndex),
  };
}

function firstValue(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
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
//
// This page also intentionally repeats the phone/email/address "Contact
// Info" card from the shared ContactSection (sourced from lib/site.ts, the
// single source of truth) — SiteChrome suppresses ContactSection here to
// avoid a second form on the page, but that also silently dropped the info
// card, leaving a large empty gap under the intro copy. Restoring just the
// info card (not the form/map that come with it) fixes that without
// reintroducing the duplicate-form problem.
export default async function ContactUs({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const [settings, override, params] = await Promise.all([
    getSiteSettings(),
    getPageSeoOverride("/contact-us"),
    searchParams,
  ]);
  const pageDescription = override?.seoDescription || description;
  const breadcrumbItems = [{ name: "Home", path: "/" }, { name: "Contact Us", path: "/contact-us" }];

  // Set when someone arrives here via a specific VacancyCard's "Enquire"
  // button (?space=1+Kingfisher+Avenue&interest=Warehouse+space) so the form
  // is pre-filled with the space they actually clicked on.
  const spaceName = firstValue(params.space);
  const defaultInterest = firstValue(params.interest);

  // Schema is always generated automatically — no manual override.
  const jsonLdNode = richPageJsonLd({
    type: "ContactPage",
    name: "Contact Us",
    description: pageDescription,
    path: "/contact-us",
  });

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} node={jsonLdNode} />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHero
        title="Let's find the right space for your business"
        subtitle="Contact the Midpoint team to discuss available office space, serviced offices, and warehouse opportunities in Midrand."
        image={HERO_IMAGE}
        imageAlt="Midpoint leasing team"
      />

      <section className="bg-midpoint-dark px-6 py-16 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
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

            <div className="mt-10 flex flex-wrap gap-10 border-t border-white/10 pt-8">
              <div>
                <h3 className="text-sm uppercase tracking-wide text-midpoint-grey-400">Contact Info</h3>
                <p className="mt-1">
                  <a href={site.phoneHref}>{site.phone}</a>
                </p>
                <p>
                  <a href={site.emailHref}>{site.email}</a>
                </p>
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-wide text-midpoint-grey-400">Address</h3>
                <p className="mt-1">
                  {site.address.street}, {site.address.suburb}
                  <br />
                  {site.address.city}, {site.address.postalCode}
                </p>
              </div>
            </div>
          </div>
          <div>
            <ContactForm
              siteKey={settings.recaptchaSiteKey}
              successMessage={settings.enquirySuccessMessage}
              spaceName={spaceName}
              defaultInterest={defaultInterest}
            />
          </div>
        </div>
      </section>
    </>
  );
}
