import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import CustomCodeBlock from "@/components/CustomCodeBlock";
import PageHero from "@/components/PageHero";
import FeatureIntro from "@/components/FeatureIntro";
import ReadyToMoveSection from "@/components/ReadyToMoveSection";
import ConsiderationsList from "@/components/ConsiderationsList";
import ListingsPreview from "@/components/ListingsPreview";
import PageFaqAccordion from "@/components/PageFaqAccordion";
import TalkToLeasing from "@/components/TalkToLeasing";
import ExploreMore from "@/components/ExploreMore";
import { getSiteSettings } from "@/lib/site-settings";

// Root-level catch-all for published Pillar Pages. Next.js always resolves a
// literal folder (like app/about-us) ahead of this dynamic segment, so it
// cannot shadow any existing static route. This is the comprehensive pillar
// template: hero, trust strip, feature grid, considerations, live listings
// pulled straight from Vacancy, long-form body, FAQ accordion, E-E-A-T
// review box, CTA and explore-more links — the same level of section
// richness as the hand-coded marketing pages (Offices, Warehouses,
// Amenities, Location) this template now serves.
export const dynamic = "force-dynamic";

type PillarFaq = { question: string; answer: string };
type PillarFeature = { heading: string; text: string; image: string };
type PillarConsideration = { heading: string; text: string };
type PillarLink = { label: string; href: string };

const FALLBACK_HERO_IMAGE =
  "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a148a5463dac69c69cbc3a8_amenities_banner-p-1600.jpg";

async function getPillar(slug: string) {
  return prisma.pillarPage.findUnique({ where: { slug } });
}

function sectorLabel(sector: string) {
  return sector
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pillar = await getPillar(slug);
  if (!pillar || pillar.status !== "PUBLISHED") return {};

  const title = pillar.seoTitle || pillar.title;
  const description = pillar.seoDescription || undefined;
  const ogImage = pillar.ogImage || pillar.heroImage;

  return {
    title,
    description,
    ...(pillar.canonicalUrl ? { alternates: { canonical: pillar.canonicalUrl } } : {}),
    robots: pillar.noIndex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: pillar.ogTitle || title,
      description: pillar.ogDescription || description,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function PillarPagePublic({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pillar = await getPillar(slug);
  if (!pillar || pillar.status !== "PUBLISHED") notFound();

  const settings = await getSiteSettings();
  const description = pillar.seoDescription || pillar.title;
  const faqs = Array.isArray(pillar.faqs) ? (pillar.faqs as unknown as PillarFaq[]) : [];
  const features = Array.isArray(pillar.features) ? (pillar.features as unknown as PillarFeature[]) : [];
  const considerations = Array.isArray(pillar.considerations)
    ? (pillar.considerations as unknown as PillarConsideration[])
    : [];
  const exploreLinks = Array.isArray(pillar.exploreLinks) ? (pillar.exploreLinks as unknown as PillarLink[]) : [];
  const trustItems = (pillar.trustStrip || "").split("\n").map((s) => s.trim()).filter(Boolean);
  const hasBody = Boolean(pillar.contentHtml && pillar.contentHtml.replace(/<[^>]*>/g, "").trim());

  // Live listings for this pillar's related sector, straight from Vacancy —
  // always current, never goes stale like a hand-typed listings block would.
  const vacancies = pillar.relatedSector
    ? await prisma.vacancy.findMany({
        where: { status: "PUBLISHED", sector: pillar.relatedSector },
        orderBy: { sortOrder: "asc" },
        take: 4,
      })
    : [];
  const listings = vacancies.map((v) => ({
    title: `${v.building} — ${v.sizeSqm.toLocaleString("en-ZA")} m²`,
    text: `${sectorLabel(v.sector)} | Available from ${v.availability}. ${
      v.description.length > 130 ? `${v.description.slice(0, 130).trim()}…` : v.description
    }`,
  }));

  const autoJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${settings.domain}/${pillar.slug}#webpage`,
        url: `${settings.domain}/${pillar.slug}`,
        name: pillar.title,
        description,
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
  // An admin override replaces the whole auto-generated graph above if set.
  const jsonLdToRender = pillar.schemaJson && typeof pillar.schemaJson === "object" ? pillar.schemaJson : autoJsonLd;

  return (
    <article className="bg-white">
      <CustomCodeBlock code={pillar.headCode} />
      <BreadcrumbJsonLd
        items={[{ name: "Home", path: "/" }, { name: pillar.title, path: `/${pillar.slug}` }]}
        description={description}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdToRender) }} />

      <PageHero
        title={pillar.title}
        subtitle={pillar.heroAnswer || undefined}
        image={pillar.heroImage || FALLBACK_HERO_IMAGE}
        imageAlt={pillar.title}
      />

      {trustItems.length > 0 && (
        <div className="mx-auto max-w-7xl px-6 pt-10">
          <div className="flex flex-wrap gap-3">
            {trustItems.map((item) => (
              <span key={item} className="rounded-full bg-midpoint-cyan/20 px-4 py-1.5 text-sm font-medium text-midpoint-dark">
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {features.length > 0 && (
        <FeatureIntro eyebrow={pillar.primaryEntity ? `${pillar.primaryEntity} at Midpoint` : pillar.title} features={features} />
      )}

      {pillar.showReadyToMove && <ReadyToMoveSection />}

      {considerations.length > 0 && (
        <ConsiderationsList
          eyebrow={`What to know about ${(pillar.primaryEntity || pillar.title).toLowerCase()}`}
          items={considerations}
        />
      )}

      {listings.length > 0 && (
        <ListingsPreview
          eyebrow={pillar.listingsHeading || "Current availability at Midpoint"}
          intro={
            pillar.listingsIntro ||
            "A snapshot of what's currently available. Full specifications, floor plans, rates and photos are on the live vacancy schedule."
          }
          listings={listings}
          ctaHref="/availability-report"
          ctaLabel="View full availability and floor plans"
        />
      )}

      {hasBody && (
        <section className="bg-white px-6 py-10">
          <div
            className="mx-auto max-w-4xl space-y-4 text-midpoint-grey-400 [&_a]:text-midpoint-dark [&_a]:underline [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-midpoint-dark [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-midpoint-dark [&_img]:rounded-card [&_li]:ml-5 [&_li]:list-disc [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-midpoint-grey-100 [&_td]:p-2 [&_th]:border [&_th]:border-midpoint-grey-100 [&_th]:p-2"
            dangerouslySetInnerHTML={{ __html: pillar.contentHtml }}
          />
        </section>
      )}

      {faqs.length > 0 && <PageFaqAccordion heading={pillar.faqsHeading || "Frequently asked questions"} faqs={faqs} />}

      {pillar.expertName && (
        <section className="bg-white px-6 pb-4">
          <div className="mx-auto max-w-4xl rounded-card bg-midpoint-dark p-6 text-white">
            <p className="text-xs uppercase tracking-wide text-white/50">Reviewed by</p>
            <p className="mt-1 text-lg font-semibold">{pillar.expertName}</p>
            {pillar.expertRole && <p className="text-sm text-white/70">{pillar.expertRole}</p>}
            {pillar.expertBio && <p className="mt-3 text-sm text-white/70">{pillar.expertBio}</p>}
            {pillar.lastReviewedAt && (
              <p className="mt-3 text-xs text-white/50">Last reviewed {pillar.lastReviewedAt.toLocaleDateString()}</p>
            )}
          </div>
        </section>
      )}

      <TalkToLeasing
        heading={pillar.ctaHeading || "Talk to the leasing team"}
        text={pillar.ctaText || `Reach out on ${settings.phone} or ${settings.email} to discuss availability or arrange a viewing.`}
      />

      {exploreLinks.length > 0 && <ExploreMore links={exploreLinks} />}

      <CustomCodeBlock code={pillar.bodyCode} />
    </article>
  );
}
