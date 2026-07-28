import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import { getSiteSettings } from "@/lib/site-settings";

// Root-level catch-all for published Pillar Pages, e.g.
// /office-space-to-rent-midrand — per the blueprint's URL pattern. Next.js
// always resolves a literal folder (like app/about-us) ahead of this dynamic
// segment, so it cannot shadow any existing static route.
export const dynamic = "force-dynamic";

type PillarFaq = { question: string; answer: string };

async function getPillar(slug: string) {
  return prisma.pillarPage.findUnique({ where: { slug } });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const pillar = await getPillar(slug);
  if (!pillar || pillar.status !== "PUBLISHED") return {};

  return {
    title: pillar.seoTitle || pillar.title,
    description: pillar.seoDescription || undefined,
  };
}

export default async function PillarPagePublic({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pillar = await getPillar(slug);
  if (!pillar || pillar.status !== "PUBLISHED") notFound();

  const settings = await getSiteSettings();
  const description = pillar.seoDescription || pillar.title;
  const faqs = Array.isArray(pillar.faqs) ? (pillar.faqs as unknown as PillarFaq[]) : [];
  const trustItems = (pillar.trustStrip || "").split("\n").map((s) => s.trim()).filter(Boolean);

  const jsonLd = {
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

  return (
    <article className="bg-white">
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: pillar.title, path: `/${pillar.slug}` }]} description={description} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {pillar.heroImage && (
        <div className="relative h-96 w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={pillar.heroImage} alt={pillar.title} className="h-full w-full object-cover" />
        </div>
      )}

      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-bold text-midpoint-dark md:text-5xl">{pillar.title}</h1>
        {pillar.heroAnswer && <p className="mt-6 text-lg text-midpoint-grey-400">{pillar.heroAnswer}</p>}

        {trustItems.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {trustItems.map((item) => (
              <span key={item} className="rounded-full bg-midpoint-cyan/20 px-4 py-1.5 text-sm font-medium text-midpoint-dark">
                {item}
              </span>
            ))}
          </div>
        )}

        <div
          className="mt-10 max-w-none space-y-4 text-midpoint-grey-400 [&_a]:text-midpoint-dark [&_a]:underline [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-midpoint-dark [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-midpoint-dark [&_img]:rounded-card [&_li]:ml-5 [&_li]:list-disc [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-midpoint-grey-100 [&_td]:p-2 [&_th]:border [&_th]:border-midpoint-grey-100 [&_th]:p-2"
          dangerouslySetInnerHTML={{ __html: pillar.contentHtml }}
        />

        {faqs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-midpoint-dark">Frequently asked questions</h2>
            <div className="mt-6 divide-y divide-midpoint-grey-100">
              {faqs.map((f) => (
                <div key={f.question} className="py-4">
                  <p className="font-semibold text-midpoint-dark">{f.question}</p>
                  <p className="mt-2 text-sm text-midpoint-grey-400">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {pillar.expertName && (
          <div className="mt-12 rounded-card bg-midpoint-dark p-6 text-white">
            <p className="text-xs uppercase tracking-wide text-white/50">Reviewed by</p>
            <p className="mt-1 text-lg font-semibold">{pillar.expertName}</p>
            {pillar.expertRole && <p className="text-sm text-white/70">{pillar.expertRole}</p>}
            {pillar.expertBio && <p className="mt-3 text-sm text-white/70">{pillar.expertBio}</p>}
            {pillar.lastReviewedAt && (
              <p className="mt-3 text-xs text-white/50">Last reviewed {pillar.lastReviewedAt.toLocaleDateString()}</p>
            )}
          </div>
        )}
      </section>
    </article>
  );
}
