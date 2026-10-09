import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";
import CustomCodeBlock from "@/components/CustomCodeBlock";
import { getSiteSettings } from "@/lib/site-settings";
import { blogPostingJsonLd } from "@/lib/seo";
import { buildPageMetadata } from "@/lib/seo-metadata";
import { removeDuplicateCoverImage } from "@/lib/blog-content";
import { safeJsonLd } from "@/lib/json-ld";

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  return prisma.blogPost.findUnique({ where: { slug }, include: { pillarPage: { select: { slug: true, title: true, status: true, passwordProtected: true } } } });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post || post.status !== "PUBLISHED") return {};

  const settings = await getSiteSettings();
  return buildPageMetadata({ path: `/blog/${post.slug}`, title: post.title, description: post.excerpt, image: post.coverImage, fields: post, settings, article: true });
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post || post.status !== "PUBLISHED") notFound();

  const pillar = post.pillarPage?.status === "PUBLISHED" && !post.pillarPage.passwordProtected ? post.pillarPage : null;
  const settings = await getSiteSettings();
  const description = post.seoDescription || post.excerpt || post.title;
  const articleContent = removeDuplicateCoverImage(post.contentHtml, post.coverImage);
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: post.title, path: `/blog/${post.slug}` },
  ];

  // Always auto-generated from the post's real fields — no manual override
  // path left to save a worse or blank version over this.
  const jsonLdToRender = blogPostingJsonLd({
    title: post.title,
    description,
    image: post.coverImage || settings.defaultSocialImage,
    path: `/blog/${post.slug}`,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
  });

  return (
    <article className="bg-white">
      <CustomCodeBlock code={post.headCode} />
      <BreadcrumbJsonLd items={breadcrumbItems} description={description} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLdToRender) }} />
      <Breadcrumbs items={breadcrumbItems} />

      <section className="mx-auto max-w-3xl px-6 py-16">
        {post.coverImage && (
          <div className="relative mb-8 h-80 w-full overflow-hidden rounded-card">
            <Image src={post.coverImage} alt={post.title} fill sizes="(min-width: 768px) 768px, 100vw" className="object-cover" priority />
          </div>
        )}
        {pillar && (
          <aside className="mb-8 rounded-card bg-midpoint-cyan/15 p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-midpoint-grey-400">Part of our guide</p>
            <Link href={`/${pillar.slug}`} className="mt-2 inline-block font-semibold text-midpoint-dark underline">{pillar.title} &rarr;</Link>
            <p className="mt-2 text-sm text-midpoint-grey-400">Explore the full guide and its supporting articles.</p>
          </aside>
        )}
        <h1 className="text-4xl font-bold text-midpoint-dark">{post.title}</h1>
        {/* Content is authored by trusted admin users only via /admin/blog, not
            public input, so rendering the stored HTML directly is safe. */}
        <div
          className="mt-8 max-w-none space-y-4 text-midpoint-grey-400 [&_a]:text-midpoint-dark [&_a]:underline [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-midpoint-dark [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-midpoint-dark [&_img]:rounded-card [&_li]:ml-5 [&_li]:list-disc"
          dangerouslySetInnerHTML={{ __html: articleContent }}
        />
      </section>
      <CustomCodeBlock code={post.bodyCode} />
    </article>
  );
}
