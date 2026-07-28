import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PillarPageForm from "@/components/admin/PillarPageForm";
import SeoScoreCard from "@/components/admin/SeoScoreCard";
import { scorePillarPage } from "@/lib/seo-score";
import { formatPillarFaqs, type PillarFaq } from "@/lib/pillar-faqs";
import { formatFeatures, formatConsiderations, formatLinks, type PillarFeature, type PillarConsideration, type PillarLink } from "@/lib/pillar-blocks";
import { updatePillarPage } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditPillarPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pillar = await prisma.pillarPage.findUnique({ where: { id } });
  if (!pillar) notFound();

  const faqs = Array.isArray(pillar.faqs) ? (pillar.faqs as unknown as PillarFaq[]) : [];
  const features = Array.isArray(pillar.features) ? (pillar.features as unknown as PillarFeature[]) : [];
  const considerations = Array.isArray(pillar.considerations)
    ? (pillar.considerations as unknown as PillarConsideration[])
    : [];
  const exploreLinks = Array.isArray(pillar.exploreLinks) ? (pillar.exploreLinks as unknown as PillarLink[]) : [];
  const action = updatePillarPage.bind(null, id);
  const result = scorePillarPage({ ...pillar, faqs });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Edit pillar page</h1>
      <PillarPageForm
        action={action}
        submitLabel="Save changes"
        defaultValues={{
          title: pillar.title,
          slug: pillar.slug,
          primaryEntity: pillar.primaryEntity || "",
          primaryAudience: pillar.primaryAudience || "",
          decisionStage: pillar.decisionStage || "",
          primarySearchIntent: pillar.primarySearchIntent || "",
          primaryConversion: pillar.primaryConversion || "",
          heroAnswer: pillar.heroAnswer || "",
          heroImage: pillar.heroImage || "",
          trustStrip: pillar.trustStrip || "",
          relatedSector: pillar.relatedSector || "",
          listingsHeading: pillar.listingsHeading || "",
          listingsIntro: pillar.listingsIntro || "",
          showReadyToMove: pillar.showReadyToMove,
          featuresText: formatFeatures(features),
          considerationsText: formatConsiderations(considerations),
          exploreLinksText: formatLinks(exploreLinks),
          contentHtml: pillar.contentHtml,
          faqsText: formatPillarFaqs(faqs),
          faqsHeading: pillar.faqsHeading || "",
          ctaHeading: pillar.ctaHeading || "",
          ctaText: pillar.ctaText || "",
          expertName: pillar.expertName || "",
          expertRole: pillar.expertRole || "",
          expertBio: pillar.expertBio || "",
          expertImage: pillar.expertImage || "",
          reviewOwner: pillar.reviewOwner || "",
          lastReviewedAt: pillar.lastReviewedAt ? pillar.lastReviewedAt.toISOString().slice(0, 10) : "",
          status: pillar.status,
          seoTitle: pillar.seoTitle || "",
          seoDescription: pillar.seoDescription || "",
          focusKeyword: pillar.focusKeyword || "",
          ogTitle: pillar.ogTitle || "",
          ogDescription: pillar.ogDescription || "",
          ogImage: pillar.ogImage || "",
          noIndex: pillar.noIndex,
          canonicalUrl: pillar.canonicalUrl || "",
          schemaJson: pillar.schemaJson ? JSON.stringify(pillar.schemaJson, null, 2) : "",
          headCode: pillar.headCode || "",
          bodyCode: pillar.bodyCode || "",
        }}
      />
      <SeoScoreCard result={result} />
    </div>
  );
}
