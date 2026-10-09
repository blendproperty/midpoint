import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import Reveal from "@/components/Reveal";
import BrokerCTASection from "@/components/BrokerCTASection";
import { getPageSeoOverride } from "@/lib/page-seo";
import { richPageJsonLd } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-settings";
import { prisma } from "@/lib/prisma";
import { buildPageMetadata } from "@/lib/seo-metadata";

export const dynamic = "force-dynamic";

const FALLBACK_TITLE = "Midpoint Insights | Midrand Property & Leasing Guides";
const description =
  "Explore Midpoint guides to commercial property in Midrand, offices, warehouses, serviced offices, location and amenities.";

export async function generateMetadata(): Promise<Metadata> {
  const [override, settings] = await Promise.all([getPageSeoOverride("/insights"), getSiteSettings()]);
  return buildPageMetadata({ path: "/insights", title: FALLBACK_TITLE, description, fields: override, settings });
}

export default async function InsightsPage() {
  const [override, pillars] = await Promise.all([
    getPageSeoOverride("/insights"),
    prisma.pillarPage.findMany({
      where: { status: "PUBLISHED", passwordProtected: false },
      orderBy: { title: "asc" },
      select: { id: true, slug: true, title: true, heroAnswer: true, seoDescription: true, heroImage: true },
    }),
  ]);
  const orderedPillars = [...pillars].sort((a, b) =>
    Number(b.slug === "business-park-midrand") - Number(a.slug === "business-park-midrand")
  );
  const pageDescription = override?.seoDescription || description;
  const breadcrumbItems = [{ name: "Home", path: "/" }, { name: "Insights", path: "/insights" }];
  const jsonLdNode = richPageJsonLd({
    type: "CollectionPage",
    name: "Midpoint Insights",
    description: pageDescription,
    path: "/insights",
  });

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} node={jsonLdNode} />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHero
        title="Your guides to Midpoint"
        subtitle="Explore our main guides to the estate, its spaces and working life. Each guide brings together the information and supporting articles for that topic."
        image="/images/sitemap/aerial.jpg"
        imageAlt="Aerial view of Midpoint Business Park in Midrand"
      />

      <section className="bg-[#f4f7f6] px-6 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-midpoint-grey-400">Explore by topic</p>
            <h2 className="mt-3 text-3xl font-semibold text-midpoint-dark md:text-5xl">Start with a guide</h2>
            <p className="mt-5 max-w-2xl leading-7 text-midpoint-grey-400">Choose the topic that matters to your business. Follow each guide to explore its supporting articles and practical advice.</p>
          </Reveal>
          <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {orderedPillars.map((pillar, index) => (
              <Reveal key={pillar.id} delay={index * 80} className="h-full">
                <Link href={`/${pillar.slug}`} className="group flex h-full flex-col overflow-hidden rounded-card bg-white shadow-sm">
                  <div className="relative aspect-[16/10] overflow-hidden bg-midpoint-grey-400">
                    <Image src={pillar.heroImage || "/images/hero/banner.jpg"} alt={pillar.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-semibold text-midpoint-dark">{pillar.title}</h3>
                    {(pillar.seoDescription || pillar.heroAnswer) && <p className="mt-3 flex-1 text-sm leading-6 text-midpoint-grey-400">{pillar.seoDescription || pillar.heroAnswer}</p>}
                    <span className="mt-6 text-sm font-semibold text-midpoint-dark">Explore guide &rarr;</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          {!pillars.length && <p className="mt-10 text-midpoint-grey-400">Our guides are being prepared. Please check back soon.</p>}
          <div className="mt-12 border-t border-midpoint-dark/10 pt-8">
            <p className="text-sm text-midpoint-grey-400">Looking for a particular article?</p>
            <Link href="/blog" className="mt-2 inline-block font-semibold text-midpoint-dark underline">Browse all blog articles &rarr;</Link>
          </div>
        </div>
      </section>

      <BrokerCTASection />
    </>
  );
}
