import { midpointPlaceJsonLd, organizationJsonLd } from "@/lib/seo";

type PillarSchemaInput = {
  slug: string; title: string; seoDescription: string | null; heroImage: string | null;
  updatedAt: Date; lastReviewedAt: Date | null;
  expertName: string | null; expertRole: string | null; expertBio: string | null; expertImage: string | null;
};

export function pillarPageJsonLd(pillar: PillarSchemaInput, faqs: { question: string; answer: string }[], domain: string, hasListings: boolean) {
  const root = domain.replace(/\/$/, "");
  const url = new URL(`/${pillar.slug}`, root).href;
  const hasReviewer = !!pillar.expertName && pillar.slug !== "business-park-midrand";
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": hasListings ? "CollectionPage" : "WebPage",
        "@id": `${url}#webpage`, url, name: pillar.title,
        description: pillar.seoDescription || pillar.title,
        inLanguage: "en-ZA",
        isPartOf: { "@id": `${root}/#website` },
        dateModified: pillar.updatedAt.toISOString(),
        image: pillar.heroImage ? new URL(pillar.heroImage, root).href : undefined,
        about: { ...midpointPlaceJsonLd(), "@id": `${root}/#midpoint` },
        mentions: organizationJsonLd(),
        ...(hasListings ? { mainEntity: { "@id": `${url}#availability` } } : {}),
        ...(faqs.length ? { hasPart: { "@id": `${url}#faq` } } : {}),
        ...(pillar.lastReviewedAt ? { lastReviewed: pillar.lastReviewedAt.toISOString() } : {}),
        ...(hasReviewer && pillar.lastReviewedAt ? { reviewedBy: { "@id": `${url}#property-contact` } } : {}),
      },
      ...(faqs.length ? [{
        "@type": "FAQPage", "@id": `${url}#faq`, url: `${url}#faqs`,
        isPartOf: { "@id": `${url}#webpage` },
        mainEntity: faqs.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
      }] : []),
      ...(pillar.expertName ? [{
        "@type": "Person", "@id": `${url}#property-contact`, name: pillar.expertName,
        jobTitle: pillar.expertRole || undefined, description: pillar.expertBio || undefined,
        image: pillar.expertImage ? new URL(pillar.expertImage, root).href : undefined,
      }] : []),
    ],
  };
}
