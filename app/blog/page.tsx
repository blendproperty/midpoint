import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";

export const dynamic = "force-dynamic";

const description = "News, updates, and insights from Midpoint Midrand.";

export const metadata: Metadata = {
  title: "Blog",
  description,
};

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
        <h1 className="text-4xl font-bold text-midpoint-dark md:text-5xl">Blog</h1>
        <p className="mt-4 max-w-2xl text-midpoint-grey-400">{description}</p>

        {posts.length === 0 ? (
          <div className="mt-10 rounded-card bg-midpoint-dark p-10 text-center text-white md:p-16">
            <h2 className="text-2xl font-semibold md:text-3xl">Our first stories are on the way.</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/70">
              We're putting together news and updates from Midpoint Midrand — check back soon,
              or explore what's available at the estate right now.
            </p>
            <Link
              href="/vacancies"
              className="mt-6 inline-block rounded-full bg-midpoint-cyan px-5 py-2.5 text-sm font-semibold text-midpoint-dark transition-transform duration-100 ease-out hover:opacity-90 active:scale-[0.97]"
            >
              View current vacancies
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
                  <h2 className="text-xl font-semibold">{post.title}</h2>
                  {post.excerpt && <p className="mt-2 text-sm text-white/70">{post.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
