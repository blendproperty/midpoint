import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import CustomCodeBlock from "@/components/CustomCodeBlock";
import PageAccessGate from "@/components/PageAccessGate";
import { getSiteSettings } from "@/lib/site-settings";
import { verifyPageAccessToken, pageAccessCookieName } from "@/lib/page-access";

export const dynamic = "force-dynamic";

async function getPage(slug: string) {
  return prisma.page.findUnique({ where: { slug } });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page || page.status !== "PUBLISHED") return {};

  const title = page.seoTitle || page.title;
  const description = page.seoDescription || undefined;

  return {
    title,
    description,
    ...(page.canonicalUrl ? { alternates: { canonical: page.canonicalUrl } } : {}),
    // Password-protected pages are never indexable, regardless of the
    // noIndex field — there's no point letting search engines crawl a page
    // visitors can't actually open without a password.
    robots: page.passwordProtected || page.noIndex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title: page.ogTitle || title,
      description: page.ogDescription || description,
      images: page.ogImage ? [{ url: page.ogImage }] : undefined,
    },
  };
}

export default async function CmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page || page.status !== "PUBLISHED") notFound();

  if (page.passwordProtected) {
    const cookieStore = await cookies();
    const token = cookieStore.get(pageAccessCookieName(page.id))?.value;
    const unlocked = await verifyPageAccessToken(token, page.id);
    if (!unlocked) {
      return <PageAccessGate pageId={page.id} title={page.title} />;
    }
  }

  const settings = await getSiteSettings();
  const description = page.seoDescription || page.title;

  // CMS Pages previously only had breadcrumb schema — now every published
  // Page gets a real WebPage node too (or the admin's own override).
  const autoJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description,
    url: `${settings.domain}/p/${page.slug}`,
  };
  const jsonLdToRender = page.schemaJson && typeof page.schemaJson === "object" ? page.schemaJson : autoJsonLd;

  return (
    <section className="mx-auto max-w-3xl bg-white px-6 py-16">
      <CustomCodeBlock code={page.headCode} />
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: page.title, path: `/p/${page.slug}` }]} description={description} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdToRender) }} />
      <h1 className="text-4xl font-bold text-midpoint-dark">{page.title}</h1>
      {/* Content is authored by trusted admin users only via /admin/pages. */}
      <div
        className="mt-8 max-w-none space-y-4 text-midpoint-grey-400 [&_a]:text-midpoint-dark [&_a]:underline [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-midpoint-dark [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-midpoint-dark [&_img]:rounded-card [&_li]:ml-5 [&_li]:list-disc"
        dangerouslySetInnerHTML={{ __html: page.contentHtml }}
      />
      <CustomCodeBlock code={page.bodyCode} />
    </section>
  );
}
