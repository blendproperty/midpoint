import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PillarPageForm from "@/components/admin/PillarPageForm";
import SeoScoreCard from "@/components/admin/SeoScoreCard";
import { scorePillarPage } from "@/lib/seo-score";
import { formatPillarFaqs, type PillarFaq } from "@/lib/pillar-faqs";
import { updatePillarPage } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditPillarPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pillar = await prisma.pillarPage.findUnique({ where: { id } });
  if (!pillar) notFound();

  const faqs = Array.isArray(pillar.faqs) ? (pillar.faqs as unknown as PillarFaq[]) : [];
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
          contentHtml: pillar.contentHtml,
          faqsText: formatPillarFaqs(faqs),
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
        }}
      />
      <SeoScoreCard result={result} />
    </div>
  );
}
