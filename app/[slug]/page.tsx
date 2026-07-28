import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import CustomCodeBlock from "@/components/CustomCodeBlock";
import PageAccessGate from "@/components/PageAccessGate";
import PageHero from "@/components/PageHero";
import PillarTableOfContents from "@/components/PillarTableOfContents";
import PillarQuickFacts from "@/components/PillarQuickFacts";
import FeatureIntro from "@/components/FeatureIntro";
import ReadyToMoveSection from "@/components/ReadyToMoveSection";
import ConsiderationsList from "@/components/ConsiderationsList";
import ListingsPreview from "@/components/ListingsPreview";
import PageFaqAccordion from "@/components/PageFaqAccordion";
import TalkToLeasing from "@/components/TalkToLeasing";
import ExploreMore from "@/components/ExploreMore";
import { getSiteSettings } from "@/lib/site-settings";
import { verifyPageAccessToken, pageAccessCookieName } from "@/lib/page-access";
import { midpointPlaceJsonLd, organizationJsonLd } from "@/lib/seo";

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
    // Password-protected pages are never indexable, regardless of noIndex.
    robots:
      pillar.passwordProtected || pillar.noIndex ? { index: false, follow: true } : { index: true, follow: true },
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

  if (pillar.passwordProtected) {
    const cookieStore = await cookies();
    const token = cookieStore.get(pageAccessCookieName(pillar.id))?.value;
    const unlocked = await verifyPageAccessToken(token, pillar.id);
    if (!unlocked) {
      return <PageAccessGate pageId={pillar.id} title={pillar.title} />;
    }
  }

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

  const quickFacts =
    vacancies.length > 0
      ? [
          { label: "Live listings", value: String(vacancies.length) },
          {
            label: "Size range",
            value: `${Math.min(...vacancies.map((v) => v.sizeSqm)).toLocaleString("en-ZA")}–${Math.max(...vacancies.map((v) => v.sizeSqm)).toLocaleString("en-ZA")} m²`,
          },
          { label: "From", value: `R${Math.min(...vacancies.map((v) => v.ratePerSqm)).toLocaleString("en-ZA")} / m²` },
        ]
      : [];

  const tocItems = [
    features.length > 0 ? { id: "features", label: "Highlights" } : null,
    considerations.length > 0 ? { id: "things-to-know", label: "Things to know" } : null,
    listings.length > 0 ? { id: "availability", label: "Availability" } : null,
    hasBody ? { id: "overview", label: "Overview" } : null,
    faqs.length > 0 ? { id: "faqs", label: "FAQs" } : null,
  ].filter((item): item is { id: string; label: string } => item !== null);

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
        about: midpointPlaceJsonLd(),
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

      <PillarTableOfContents items={tocItems} />

      <PillarQuickFacts facts={quickFacts} />

      {trustItems.length > 0 && (
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

      {features.length > 0 && (
        <div id="features">
          <FeatureIntro eyebrow={pillar.primaryEntity ? `${pillar.primaryEntity} at Midpoint` : pillar.title} features={features} />
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

      {listings.length > 0 && (
        <div id="availability">
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
        </div>
      )}

      {hasBody && (
        <section id="overview" className="bg-white px-6 py-10">
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
