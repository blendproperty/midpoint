import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";

export const dynamic = "force-dynamic";

async function getPage(slug: string) {
  return prisma.page.findUnique({ where: { slug } });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page || page.status !== "PUBLISHED") return {};

  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || undefined,
  };
}

export default async function CmsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page || page.status !== "PUBLISHED") notFound();

  const description = page.seoDescription || page.title;

  return (
    <section className="mx-auto max-w-3xl bg-white px-6 py-16">
      <BreadcrumbJsonLd items={[{ name: "Home", path: "/" }, { name: page.title, path: `/p/${page.slug}` }]} description={description} />
      <h1 className="text-4xl font-bold text-midpoint-dark">{page.title}</h1>
      {/* Content is authored by trusted admin users only via /admin/pages. */}
      <div
        className="mt-8 max-w-none space-y-4 text-midpoint-grey-400 [&_a]:text-midpoint-dark [&_a]:underline [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-midpoint-dark [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-midpoint-dark [&_img]:rounded-card [&_li]:ml-5 [&_li]:list-disc"
        dangerouslySetInnerHTML={{ __html: page.contentHtml }}
      />
    </section>
  );
}
