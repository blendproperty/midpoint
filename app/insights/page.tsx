import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import Reveal from "@/components/Reveal";
import BrokerCTASection from "@/components/BrokerCTASection";
import { getPageSeoOverride } from "@/lib/page-seo";
import { richPageJsonLd, stripSiteNameSuffix } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-settings";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const FALLBACK_TITLE = "Midpoint Insights | Midrand Property & Leasing Guides";
const description =
  "Explore practical Midpoint guides covering commercial property in Midrand, location, offices, warehouses, amenities and common leasing questions.";

export async function generateMetadata(): Promise<Metadata> {
  const [override, settings] = await Promise.all([getPageSeoOverride("/insights"), getSiteSettings()]);
  const rawTitle = override?.seoTitle || FALLBACK_TITLE;
  return {
    title: stripSiteNameSuffix(rawTitle, settings.siteName),
    description: override?.seoDescription || description,
  };
}

type GuideCard = {
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
  eyebrow: string;
  detail: string;
};

export default async function InsightsPage() {
  const [override, publishedPillars, latestPosts] = await Promise.all([
    getPageSeoOverride("/insights"),
    prisma.pillarPage.findMany({
      where: { status: "PUBLISHED" },
      select: { slug: true },
    }),
    prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: {
        id: true,
        slug: true,
        title: true,
        excerpt: true,
        coverImage: true,
        publishedAt: true,
      },
    }),
  ]);

  const publishedSlugs = new Set(publishedPillars.map((pillar) => pillar.slug));
  const businessParkHref = publishedSlugs.has("business-park-midrand") ? "/business-park-midrand" : "/about-us";
  const pageDescription = override?.seoDescription || description;
  const breadcrumbItems = [{ name: "Home", path: "/" }, { name: "Insights", path: "/insights" }];

  const jsonLdNode = richPageJsonLd({
    type: "CollectionPage",
    name: "Midpoint Insights",
    description: pageDescription,
    path: "/insights",
  });

  const guides: GuideCard[] = [
    {
      title: "Location and access",
      description:
        "Understand Midpoint's position on the N1 between Johannesburg and Pretoria, including the routes that matter to staff, clients and operations.",
      href: "/location",
      image: "/images/pillars/warehouses/johannesburg-pretoria-corridor.webp",
      imageAlt: "Map showing Midpoint between Johannesburg and Pretoria",
      eyebrow: "Location guide",
      detail: "Routes, distances and access",
    },
    {
      title: "Office space in Midrand",
      description:
        "Compare suites, location, amenities, resilience and the practical factors to review before choosing a Midpoint office.",
      href: "/offices",
      image: "/images/listings/2-weaver-avenue.png",
      imageAlt: "Modern office space at Midpoint Business Park",
      eyebrow: "Workspace guide",
      detail: "Live availability included",
    },
    {
      title: "Warehouse space in Midrand",
      description:
        "Assess clear height, loading, yards, power, office components and complete occupancy cost alongside current opportunities.",
      href: "/warehouses",
      image: "/images/pillars/warehouses/warehouse-exterior.webp",
      imageAlt: "Modern warehouse facility at Midpoint Business Park",
      eyebrow: "Industrial guide",
      detail: "12 leasing FAQs",
    },
    {
      title: "Amenities and working life",
      description:
        "Explore the restaurants, fitness facilities, padel courts and outdoor spaces that shape the working day at Midpoint.",
      href: "/amenities",
      image: "/images/gallery/gallery-10-restaurant.jpg",
      imageAlt: "Restaurant amenity at Midpoint Business Park",
      eyebrow: "Precinct guide",
      detail: "Current and planned amenities",
    },
    {
      title: "Serviced offices at OnPoint",
      description:
        "Review the flexible-workspace option for smaller teams, projects and businesses establishing a Midrand presence.",
      href: "/services-offices",
      image: "/images/listings/onpoint.jpeg",
      imageAlt: "OnPoint serviced office reception and meeting area",
      eyebrow: "Flexible workspace",
      detail: "OnPoint at Midpoint",
    },
    {
      title: "Leasing questions answered",
      description:
        "Find straightforward answers about space, access, amenities, availability and the process of arranging an inspection.",
      href: "/faqs",
      image: "/images/pages/faq-banner.jpg",
      imageAlt: "Midpoint leasing questions and answers",
      eyebrow: "Frequently asked questions",
      detail: "Practical answers in one place",
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} node={jsonLdNode} />
      <Breadcrumbs items={breadcrumbItems} />
      <PageHero
        title="Insights for better property decisions"
        subtitle="Practical guides to Midpoint, commercial property in Midrand, location, workplace experience and the questions to ask before choosing space."
        image="/images/sitemap/aerial.jpg"
        imageAlt="Aerial view of Midpoint Business Park in Midrand"
      />

      <section className="relative overflow-hidden bg-white px-6 py-24">
        <div className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-midpoint-cyan/25 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-midpoint-grey-400">Featured guide</p>
            <div className="mt-4 grid overflow-hidden rounded-card bg-midpoint-dark text-white lg:grid-cols-[1.15fr_0.85fr]">
              <div className="relative min-h-[360px] lg:min-h-[520px]">
                <Image
                  src="/images/hero/banner.jpg"
                  alt="Wide view across Midpoint Business Park in Midrand"
                  fill
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-midpoint-dark/30" />
              </div>
              <div className="flex flex-col justify-center p-8 md:p-12">
                <span className="w-fit rounded-full bg-midpoint-cyan px-3 py-1 text-xs font-semibold text-midpoint-dark">
                  Midpoint precinct
                </span>
                <h2 className="mt-5 text-3xl font-semibold leading-tight md:text-5xl">
                  Midpoint Business Park in Midrand
                </h2>
                <p className="mt-5 text-sm leading-7 text-white/75">
                  Explore the estate, its central Gauteng location, property mix, resilience infrastructure,
                  amenities and the Blend Property Group team behind it.
                </p>
                <Link
                  href={businessParkHref}
                  className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-midpoint-cyan px-5 py-3 text-sm font-semibold text-midpoint-dark transition-transform duration-150 hover:translate-x-1"
                >
                  Explore Midpoint <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#f4f7f6] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-midpoint-grey-400">
              Property and precinct guides
            </p>
            <h2 className="mt-3 max-w-3xl text-3xl font-semibold text-midpoint-dark md:text-5xl">
              Research the space, location and working environment.
            </h2>
            <p className="mt-5 max-w-2xl leading-7 text-midpoint-grey-400">
              Use these guides to narrow the options before speaking to the leasing team or arranging an inspection.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide, index) => (
              <Reveal key={guide.title} delay={index * 80} className="h-full">
                <Link
                  href={guide.href}
                  className="group flex h-full flex-col overflow-hidden rounded-card bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={guide.image}
                      alt={guide.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-midpoint-dark/90 px-3 py-1 text-xs font-semibold text-white">
                      {guide.eyebrow}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-2xl font-semibold text-midpoint-dark">{guide.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-6 text-midpoint-grey-400">{guide.description}</p>
                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-xs font-medium text-midpoint-grey-400">{guide.detail}</span>
                      <span className="text-sm font-semibold text-midpoint-dark transition-transform group-hover:translate-x-1">
                        Read guide →
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {latestPosts.length > 0 && (
        <section className="bg-white px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <Reveal>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-midpoint-grey-400">
                  Latest from Midpoint
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-midpoint-dark md:text-5xl">News and articles</h2>
              </Reveal>
              <Link href="/blog" className="text-sm font-semibold text-midpoint-dark underline">
                View all articles
              </Link>
            </div>

            <div className="mt-12 grid gap-7 md:grid-cols-3">
              {latestPosts.map((post, index) => (
                <Reveal key={post.id} delay={index * 100} className="h-full">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-card bg-midpoint-dark text-white"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-midpoint-grey-400">
                      {/* Blog editors may use either local media or an external cover URL. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.coverImage || "/images/hero/banner.jpg"}
                        alt={post.title}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      {post.publishedAt && (
                        <p className="text-xs font-medium uppercase tracking-wide text-midpoint-cyan">
                          {post.publishedAt.toLocaleDateString("en-ZA", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </p>
                      )}
                      <h3 className="mt-3 text-xl font-semibold">{post.title}</h3>
                      {post.excerpt && <p className="mt-3 flex-1 text-sm leading-6 text-white/70">{post.excerpt}</p>}
                      <span className="mt-6 text-sm font-semibold text-midpoint-cyan">Read article →</span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <BrokerCTASection />
    </>
  );
}
