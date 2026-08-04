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
import { pageRobots } from "@/lib/indexing";

export const dynamic = "force-dynamic";

const FALLBACK_TITLE = "Midpoint Insights | Midrand Property & Leasing Guides";
const description =
  "Read Midpoint insights about commercial property in Midrand, precinct access, workplace amenities and practical leasing decisions.";

export async function generateMetadata(): Promise<Metadata> {
  const [override, settings] = await Promise.all([getPageSeoOverride("/insights"), getSiteSettings()]);
  const rawTitle = override?.seoTitle || FALLBACK_TITLE;
  return {
    title: stripSiteNameSuffix(rawTitle, settings.siteName),
    description: override?.seoDescription || description,
    robots: pageRobots(override?.noIndex),
  };
}

const resources = [
  {
    number: "01",
    eyebrow: "Getting here",
    title: "Location and access",
    description:
      "Understand Midpoint's position on the N1 between Johannesburg and Pretoria, including the routes that matter to staff, clients and operations.",
    href: "/location",
    image: "/images/pillars/warehouses/johannesburg-pretoria-corridor.webp",
    imageAlt: "Map showing Midpoint between Johannesburg and Pretoria",
  },
  {
    number: "02",
    eyebrow: "Working at Midpoint",
    title: "Amenities and working life",
    description:
      "Explore the restaurants, fitness facilities, padel courts and outdoor spaces that shape the working day at Midpoint.",
    href: "/amenities",
    image: "/images/gallery/gallery-10-restaurant.jpg",
    imageAlt: "Restaurant amenity at Midpoint Business Park",
  },
  {
    number: "03",
    eyebrow: "Leasing guidance",
    title: "Leasing questions answered",
    description:
      "Find straightforward answers about access, amenities, availability and the process of arranging an inspection.",
    href: "/faqs",
    image: "/images/pages/faq-banner.jpg",
    imageAlt: "Midpoint leasing questions and answers",
  },
];

export default async function InsightsPage() {
  const [override, businessParkPillar, latestPosts] = await Promise.all([
    getPageSeoOverride("/insights"),
    prisma.pillarPage.findFirst({
      where: { slug: "business-park-midrand", status: "PUBLISHED" },
      select: { slug: true },
    }),
    prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      take: 6,
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

  const businessParkHref = businessParkPillar ? "/business-park-midrand" : "/about-us";
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
        title="Ideas and guidance for better property decisions"
        subtitle="Precinct updates, practical leasing guidance and useful context for businesses considering Midpoint and commercial property in Midrand."
        image="/images/sitemap/aerial.jpg"
        imageAlt="Aerial view of Midpoint Business Park in Midrand"
      />

      <section className="relative overflow-hidden bg-white px-6 py-24">
        <div className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-midpoint-cyan/25 blur-3xl" />
        <div className="relative mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-midpoint-grey-400">Precinct overview</p>
            <div className="mt-4 grid overflow-hidden rounded-card bg-midpoint-dark text-white lg:grid-cols-[1.15fr_0.85fr]">
              <div className="relative min-h-[360px] lg:min-h-[500px]">
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
                  Start with the bigger picture
                </span>
                <h2 className="mt-5 text-3xl font-semibold leading-tight md:text-5xl">Why businesses choose Midpoint</h2>
                <p className="mt-5 text-sm leading-7 text-white/75">
                  Understand the estate, its central Gauteng location, property mix, resilience infrastructure,
                  amenities and the team responsible for the precinct.
                </p>
                <Link
                  href={businessParkHref}
                  className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-midpoint-cyan px-5 py-3 text-sm font-semibold text-midpoint-dark transition-transform duration-150 hover:translate-x-1"
                >
                  Understand Midpoint <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {latestPosts.length > 0 && (
        <section className="bg-[#f4f7f6] px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-5">
              <Reveal>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-midpoint-grey-400">Latest from Midpoint</p>
                <h2 className="mt-3 text-3xl font-semibold text-midpoint-dark md:text-5xl">News and articles</h2>
              </Reveal>
              <Link href="/blog" className="text-sm font-semibold text-midpoint-dark underline">View all articles</Link>
            </div>
            <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post, index) => (
                <Reveal key={post.id} delay={index * 80} className="h-full">
                  <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col overflow-hidden rounded-card bg-white shadow-sm">
                    <div className="relative aspect-[16/10] overflow-hidden bg-midpoint-grey-400">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={post.coverImage || "/images/hero/banner.jpg"} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      {post.publishedAt && <p className="text-xs font-semibold uppercase tracking-wide text-midpoint-grey-400">{post.publishedAt.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}</p>}
                      <h3 className="mt-3 text-xl font-semibold text-midpoint-dark">{post.title}</h3>
                      {post.excerpt && <p className="mt-3 flex-1 text-sm leading-6 text-midpoint-grey-400">{post.excerpt}</p>}
                      <span className="mt-6 text-sm font-semibold text-midpoint-dark">Read article &rarr;</span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#f4f7f6] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-midpoint-grey-400">Practical resources</p>
            <h2 className="mt-3 max-w-3xl text-3xl font-semibold text-midpoint-dark md:text-5xl">Understand the place before choosing the space.</h2>
            <p className="mt-5 max-w-2xl leading-7 text-midpoint-grey-400">
              Insights explains the location, working environment and leasing process. For offices, warehouses,
              serviced offices and live availability, go directly to Spaces.
            </p>
            <Link href="/spaces" className="mt-7 inline-flex items-center gap-2 rounded-full bg-midpoint-dark px-5 py-3 text-sm font-semibold text-white transition-transform hover:translate-x-1">
              Browse available spaces <span aria-hidden="true">&rarr;</span>
            </Link>
          </Reveal>

          <div className="mt-14 divide-y divide-midpoint-dark/10 border-y border-midpoint-dark/10">
            {resources.map((resource, index) => (
              <Reveal key={resource.title} delay={index * 80}>
                <Link href={resource.href} className="group grid items-center gap-7 py-8 md:grid-cols-[64px_220px_1fr_auto]">
                  <span className="text-sm font-semibold text-midpoint-grey-400">{resource.number}</span>
                  <div className="relative aspect-[16/10] overflow-hidden rounded-card">
                    <Image src={resource.image} alt={resource.imageAlt} fill sizes="(min-width: 768px) 220px, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-midpoint-grey-400">{resource.eyebrow}</p>
                    <h3 className="mt-2 text-2xl font-semibold text-midpoint-dark">{resource.title}</h3>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-midpoint-grey-400">{resource.description}</p>
                  </div>
                  <span className="text-sm font-semibold text-midpoint-dark transition-transform group-hover:translate-x-1">Read insight &rarr;</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <BrokerCTASection />
    </>
  );
}
