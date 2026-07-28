import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import CustomCodeBlock from "@/components/CustomCodeBlock";
import { getSiteSettings } from "@/lib/site-settings";
import { blogPostingJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

async function getPost(slug: string) {
  return prisma.blogPost.findUnique({ where: { slug } });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post || post.status !== "PUBLISHED") return {};

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || undefined;
  const ogImage = post.ogImage || post.coverImage;

  return {
    title,
    description,
    ...(post.canonicalUrl ? { alternates: { canonical: post.canonicalUrl } } : {}),
    robots: post.noIndex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: post.ogTitle || title,
      description: post.ogDescription || description,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post || post.status !== "PUBLISHED") notFound();

  const settings = await getSiteSettings();
  const description = post.seoDescription || post.excerpt || post.title;

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
      <BreadcrumbJsonLd
        items={[{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }]}
        description={description}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdToRender) }} />

      <section className="mx-auto max-w-3xl px-6 py-16">
        {post.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={post.coverImage} alt={post.title} className="mb-8 h-80 w-full rounded-card object-cover" />
        )}
        <h1 className="text-4xl font-bold text-midpoint-dark">{post.title}</h1>
        {/* Content is authored by trusted admin users only via /admin/blog, not
            public input, so rendering the stored HTML directly is safe. */}
        <div
          className="mt-8 max-w-none space-y-4 text-midpoint-grey-400 [&_a]:text-midpoint-dark [&_a]:underline [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-midpoint-dark [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-midpoint-dark [&_img]:rounded-card [&_li]:ml-5 [&_li]:list-disc"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </section>
      <CustomCodeBlock code={post.bodyCode} />
    </article>
  );
}
