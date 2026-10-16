import SupportingArticles from "@/components/SupportingArticles";
import TenantServices from "@/components/TenantServices";
import { supportingAmenityFeatures } from "@/lib/amenity-showcase";
import AmenitiesSection from "@/components/AmenitiesSection";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import CustomCodeBlock from "@/components/CustomCodeBlock";
import PageAccessGate from "@/components/PageAccessGate";
import PageHero from "@/components/PageHero";
import PillarTableOfContents from "@/components/PillarTableOfContents";
import PillarQuickFacts from "@/components/PillarQuickFacts";
import FeatureIntro from "@/components/FeatureIntro";
import ReadyToMoveSection from "@/components/ReadyToMoveSection";
import ConsiderationsList from "@/components/ConsiderationsList";
import LeaseAvailability from "@/components/LeaseAvailability";
import PageFaqAccordion from "@/components/PageFaqAccordion";
import TalkToLeasing from "@/components/TalkToLeasing";
import ExploreMore from "@/components/ExploreMore";
import { getSiteSettings } from "@/lib/site-settings";
import { verifyPageAccessToken, pageAccessCookieName } from "@/lib/page-access";
import { getAllVacancies, vacancySector } from "@/lib/vacancies";
import { midpointPlaceJsonLd, organizationJsonLd } from "@/lib/seo";
import { buildPageMetadata } from "@/lib/seo-metadata";
import { safeJsonLd } from "@/lib/json-ld";

export const dynamic = "force-dynamic";

type PillarFaq = { question: string; answer: string };
type PillarFeature = { heading: string; text: string; image: string; alt?: string };
type PillarConsideration = { heading: string; text: string };
type PillarLink = { label: string; href: string };

const FALLBACK_HERO_IMAGE =
  "/images/pages/amenities-banner.jpg";

async function getPillar(slug: string) {
  return prisma.pillarPage.findUnique({ where: { slug } });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [pillar, settings] = await Promise.all([getPillar(slug), getSiteSettings()]);
  if (!pillar || pillar.status !== "PUBLISHED") return {};

  return buildPageMetadata({ path: `/${pillar.slug}`, title: pillar.title, description: undefined, image: pillar.heroImage, fields: pillar, settings, article: false });
}

export default async function PillarPagePublic({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pillar = await getPillar(slug);
  if (!pillar || pillar.status !== "PUBLISHED") notFound();

  if (pillar.passwordProtected) {
    const cookieStore = await cookies();
    const token = cookieStore.get(pageAccessCookieName(pillar.id))?.value;
    const unlocked = await verifyPageAccessToken(token, pillar.id);
    if (!unlocked) {
      return <PageAccessGate pageId={pillar.id} title={pillar.title} />;
    }
  }

  const supportingPosts = await prisma.blogPost.findMany({
    where: { pillarPageId: pillar.id, status: "PUBLISHED" },
    orderBy: [{ publishedAt: "desc" }, { title: "asc" }],
    select: { id: true, slug: true, title: true, excerpt: true, coverImage: true },
  });
  const settings = await getSiteSettings();
  const description = pillar.seoDescription || pillar.title;
  const faqs = Array.isArray(pillar.faqs) ? (pillar.faqs as unknown as PillarFaq[]) : [];
  const storedFeatures = Array.isArray(pillar.features) ? (pillar.features as unknown as PillarFeature[]) : [];
  const featureMedia = storedFeatures.some((feature) => feature.image)
    ? await prisma.media.findMany({
        where: { url: { in: storedFeatures.map((feature) => feature.image).filter(Boolean) } },
        select: { url: true, alt: true },
      })
    : [];
  const featureAltByUrl = Object.fromEntries(featureMedia.map((item) => [item.url, item.alt.trim()]));
  const displayedFeatures = pillar.slug === "amenities" ? supportingAmenityFeatures(storedFeatures) : storedFeatures;
  const features = displayedFeatures.map((feature) => ({
    ...feature,
    alt: feature.alt?.trim() || featureAltByUrl[feature.image] || feature.heading,
  }));
  const considerations = Array.isArray(pillar.considerations)
    ? (pillar.considerations as unknown as PillarConsideration[])
    : [];
  const exploreLinks = Array.isArray(pillar.exploreLinks) ? (pillar.exploreLinks as unknown as PillarLink[]) : [];
  const trustItems = (pillar.trustStrip || "").split("\n").map((s) => s.trim()).filter(Boolean);
  const hasBody = Boolean(pillar.contentHtml && pillar.contentHtml.replace(/<[^>]*>/g, "").trim());
  const isBusinessParkGuide = pillar.slug === "business-park-midrand";
  const breadcrumbItems = [{ name: "Home", path: "/" }, { name: "Insights", path: "/insights" }, { name: pillar.title, path: `/${pillar.slug}` }];

  const relatedSector = pillar.relatedSector || ({ warehouses: "WAREHOUSE", offices: "OFFICE", "services-offices": "SERVICED_OFFICE" } as const)[pillar.slug as "warehouses" | "offices" | "services-offices"];
  const sector = relatedSector ? vacancySector(relatedSector, "") : null;
  const vacancies = sector ? (await getAllVacancies()).filter(v => v.sector === sector) : [];
  const sizes = vacancies.map(v => v.sizeSqm).filter(n => Number.isFinite(n) && n > 0);
  const rates = vacancies.map(v => v.ratePerSqm).filter(n => Number.isFinite(n) && n > 0);

  // Below the vacancies branch, trustItems is also rendered verbatim as the
  // pill-badge strip further down the page. Only pull an item into the
  // quick-facts cards when it actually starts with a number ("31 km to
  // Pretoria", "1,470 meters of N1 highway frontage") — that's the only
  // shape PillarQuickFacts is designed to present well. Prose-style trust
  // items ("Fond restaurant and bar") don't match, and previously fell
  // through into a fact card under a meaningless "At a glance" label,
  // duplicating the exact same text as the pill strip immediately below it.
  const quickFacts =
    pillar.slug === "amenities"
      ? [
          { label: "Landscaped trails", value: "1.8 km" },
          { label: "Padel courts", value: "3" },
        ]
      : vacancies.length > 0
      ? [
          { label: "Live listings", value: String(vacancies.length) },
          {
            label: "Size range",
            value: sizes.length ? `${Math.min(...sizes).toLocaleString("en-ZA")}–${Math.max(...sizes).toLocaleString("en-ZA")} m²` : "On request",
          },
          { label: "From", value: rates.length ? `R${Math.min(...rates).toLocaleString("en-ZA")} / m² / month` : "On request" },
        ]
      : trustItems
          .map((item) => {
            const match = item.match(/^([~\d,.]+(?:\s*(?:km|metres?|m))?)\s+(.*)$/i);
            return match ? { value: match[1], label: match[2] } : null;
          })
          .filter((fact): fact is { value: string; label: string } => fact !== null);

  const guideSections = [
    { id: "choose-your-space", label: "Compare spaces" },
    { id: "midrand-location", label: "Location" },
    { id: "leasing-costs", label: "Costs" },
    { id: "building-checklist", label: "Viewing checklist" },
    { id: "working-at-midpoint", label: "Working here" },
    { id: "leasing-process", label: "Next steps" },
  ].filter((item) => pillar.contentHtml?.includes(`id="${item.id}"`));
  const tocItems = isBusinessParkGuide && guideSections.length > 0
    ? [...guideSections, ...(faqs.length > 0 ? [{ id: "faqs", label: "FAQs" }] : [])]
    : [
    pillar.slug === "amenities" ? { id: "Amenities", label: "Highlights" } : null,
    features.length > 0 ? { id: "features", label: pillar.slug === "amenities" ? "Estate facilities" : "Highlights" } : null,
    considerations.length > 0 ? { id: "things-to-know", label: "Things to know" } : null,
    sector ? { id: "availability", label: "Availability" } : null,
    hasBody ? { id: "overview", label: "Overview" } : null,
    faqs.length > 0 ? { id: "faqs", label: "FAQs" } : null,
  ].filter((item): item is { id: string; label: string } => item !== null);

  const bodySection = hasBody && (
    <section id="overview" className="bg-white px-6 py-10">
      <div
        className={`mx-auto max-w-4xl space-y-4 text-midpoint-grey-400 [&_a]:text-midpoint-dark [&_a]:underline [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-midpoint-dark [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-midpoint-dark [&_img]:rounded-card [&_li]:ml-5 [&_li]:list-disc [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-midpoint-grey-100 [&_td]:p-2 [&_th]:border [&_th]:border-midpoint-grey-100 [&_th]:p-2 ${isBusinessParkGuide ? "leading-relaxed [&_h2]:scroll-mt-40 [&_ol>li]:list-decimal [&_li]:mb-3 [&_caption]:mb-3 [&_caption]:text-left [&_caption]:font-semibold [&_caption]:text-midpoint-dark [&_th]:bg-midpoint-cyan/10 [&_th]:text-left [&_th]:text-midpoint-dark [&_td]:align-top [&_th]:align-top [&_table]:text-sm" : ""}`}
        dangerouslySetInnerHTML={{ __html: pillar.contentHtml }}
      />
    </section>
  );

  // Always auto-generated from this pillar's real content (FAQs, expert bio,
  // Midpoint's address/amenities, Blend Property Group) — there is no manual
  // override path left to accidentally downgrade this.
  const jsonLdToRender = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${settings.domain}/${pillar.slug}#webpage`,
        url: `${settings.domain}/${pillar.slug}`,
        name: pillar.title,
        description,
        ...(isBusinessParkGuide ? { dateModified: pillar.updatedAt.toISOString() } : {}),
        // This guide distinguishes operating facilities from future plans in
        // its visible copy; do not add the shared, unconditional amenity list.
        about: { ...midpointPlaceJsonLd(), amenityFeature: undefined },
        mentions: organizationJsonLd(),
        ...(pillar.lastReviewedAt ? { lastReviewed: pillar.lastReviewedAt.toISOString() } : {}),
      },
      ...(faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            },
          ]
        : []),
      ...(pillar.expertName
        ? [
            {
              "@type": "Person",
              name: pillar.expertName,
              jobTitle: pillar.expertRole || undefined,
              description: pillar.expertBio || undefined,
              image: pillar.expertImage || undefined,
            },
          ]
        : []),
    ],
  };

  return (
    <article className="bg-white">
      <CustomCodeBlock code={pillar.headCode} />
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLdToRender) }} />
      <Breadcrumbs items={breadcrumbItems} />

      <PageHero
        title={pillar.title}
        subtitle={pillar.heroAnswer || undefined}
        image={pillar.heroImage || FALLBACK_HERO_IMAGE}
        imageAlt={pillar.title}
      />

      <PillarTableOfContents items={supportingPosts.length ? [...tocItems, { id: "supporting-articles", label: "Articles" }] : tocItems} />

      {pillar.slug === "amenities" && <AmenitiesSection detail />}

      <PillarQuickFacts
        facts={quickFacts}
        title={pillar.slug === "amenities" ? "Estate fact sheet" : undefined}
      />

      {pillar.slug !== "amenities" && trustItems.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 pb-10 pt-6">
          <div className="flex flex-wrap gap-3">
            {trustItems.map((item) => (
              <span key={item} className="rounded-full bg-midpoint-cyan/20 px-4 py-1.5 text-sm font-medium text-midpoint-dark">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {sector && <LeaseAvailability listings={vacancies} sector={sector} path={`/${pillar.slug}`} />}

      {isBusinessParkGuide && bodySection}

      {features.length > 0 && (
        <div id="features">
          <FeatureIntro
            eyebrow={
              pillar.primaryEntity
                ? pillar.primaryEntity.toLowerCase().includes("midpoint")
                  ? pillar.primaryEntity
                  : `${pillar.primaryEntity} at Midpoint`
                : pillar.title
            }
            features={features}
          />
        </div>
      )}

      {pillar.showReadyToMove && <ReadyToMoveSection />}

      {considerations.length > 0 && (
        <div id="things-to-know">
          <ConsiderationsList
            eyebrow={`What to know about ${(pillar.primaryEntity || pillar.title).toLowerCase()}`}
            items={considerations}
          />
        </div>
      )}

      {!isBusinessParkGuide && bodySection}

      {faqs.length > 0 && <PageFaqAccordion heading={pillar.faqsHeading || "Frequently asked questions"} faqs={faqs} />}

      {pillar.expertName && (
        <section className="bg-white px-6 pb-4">
          <div className="mx-auto max-w-4xl rounded-card bg-midpoint-dark p-6 text-white">
            <p className="text-xs uppercase tracking-wide text-white/50">{isBusinessParkGuide ? "Property contact" : "Reviewed by"}</p>
            <p className="mt-1 text-lg font-semibold">{pillar.expertName}</p>
            {pillar.expertRole && <p className="text-sm text-white/70">{pillar.expertRole}</p>}
            {pillar.expertBio && <p className="mt-3 text-sm text-white/70">{pillar.expertBio}</p>}
            {pillar.lastReviewedAt && (
              <p className="mt-3 text-xs text-white/50">Last reviewed {pillar.lastReviewedAt.toLocaleDateString()}</p>
            )}
          </div>
        </section>
      )}

      <SupportingArticles posts={supportingPosts} />
      {["amenities", "business-park-midrand", "services-offices"].includes(pillar.slug) && <TenantServices />}

      <TalkToLeasing
        heading={pillar.ctaHeading || "Talk to the leasing team"}
        text={pillar.ctaText || `Reach out on ${settings.phone} or ${settings.email} to discuss availability or arrange a viewing.`}
      />

      {exploreLinks.length > 0 && <ExploreMore links={exploreLinks} />}

      <CustomCodeBlock code={pillar.bodyCode} />
    </article>
  );
}
