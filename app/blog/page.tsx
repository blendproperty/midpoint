import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

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

  return (
    <div className="bg-white">
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }]} description={description} />
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-4xl font-bold text-midpoint-dark md:text-5xl">Blog</h1>
        <p className="mt-4 max-w-2xl text-midpoint-grey-400">{description}</p>

        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="block overflow-hidden rounded-card bg-midpoint-dark text-white">
              {post.coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={post.coverImage} alt={post.title} className="h-48 w-full object-cover" />
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                {post.excerpt && <p className="mt-2 text-sm text-white/70">{post.excerpt}</p>}
              </div>
            </Link>
          ))}
          {posts.length === 0 && <p className="text-midpoint-grey-400">No posts published yet.</p>}
        </div>
      </section>
    </div>
  );
}
