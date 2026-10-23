import { staticPageMetadata } from "@/lib/page-seo";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";

export const dynamic = "force-dynamic";

const description = "Read practical guides to Midrand offices, warehouses, serviced offices and storage. Compare costs, prepare for viewings and check current Midpoint vacancies.";

export async function generateMetadata(): Promise<Metadata> {
  return staticPageMetadata("/blog", "Midrand Property & Leasing Articles", description);
}

export default async function BlogIndexPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });
  const breadcrumbItems = [{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }];

  return (
    <div className="bg-white">
      <BreadcrumbJsonLd items={breadcrumbItems} description={description} />
      <Breadcrumbs items={breadcrumbItems} />
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-8">
        <h1 className="text-4xl font-bold text-midpoint-dark md:text-5xl">Midrand property and leasing articles</h1>
        <p className="mt-4 max-w-2xl text-midpoint-grey-400">{description}</p>

        <h2 className="mt-8 text-2xl font-semibold text-midpoint-dark">Choose your leasing guide</h2>
        <nav aria-label="Property and leasing topics" className="topic-navigation mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/offices">Office space</Link>
          <Link href="/warehouses">Warehouse space</Link>
          <Link href="/services-offices">Serviced offices</Link>
          <Link href="/business-park-midrand">Choosing a business park</Link>
          <Link href="/location">Midrand location and access</Link>
          <Link href="/amenities">Estate amenities</Link>
        </nav>
        <p className="mt-5 text-sm text-midpoint-grey-400">Ready to shortlist? <Link href="/vacancies" className="font-semibold text-midpoint-dark underline">View current vacancies</Link> or <Link href="/vacancies#rental-budget" className="font-semibold text-midpoint-dark underline">estimate monthly rental costs</Link>.</p>

        {posts.length === 0 ? (
          <div className="mt-10 rounded-card bg-midpoint-dark p-10 text-center text-white md:p-16">
            <h2 className="text-2xl font-semibold md:text-3xl">Our first stories are on the way.</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/70">
              We&apos;re putting together news and updates from Midpoint Midrand - check back soon,
              or explore what&apos;s available at the estate right now.
            </p>
            <Link
              href="/vacancies"
              className="mt-6 inline-block rounded-full bg-midpoint-cyan px-5 py-2.5 text-sm font-semibold text-midpoint-dark transition-transform duration-100 ease-out hover:opacity-90 active:scale-[0.97]"
            >
              View current vacancies
            </Link>
          </div>
        ) : (
          <section className="mt-10" aria-labelledby="latest-articles">
            <h2 id="latest-articles" className="text-2xl font-semibold text-midpoint-dark">Latest articles</h2>
          <div className="mt-6 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="block overflow-hidden rounded-card bg-midpoint-dark text-white">
                {post.coverImage && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold">{post.title}</h3>
                  {post.excerpt && <p className="mt-2 text-sm text-white/70">{post.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
          </section>
        )}
      </section>
    </div>
  );
}
