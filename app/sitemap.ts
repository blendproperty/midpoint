import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { site } from "@/lib/site";
import { STATIC_PAGES } from "@/lib/static-pages";

// Dynamic sitemap, pulled from the database, so every published Blog post,
// Page and Pillar Page is discoverable by search engines and AI crawlers
// the moment it's published — not just the handful of routes that used to
// be hardcoded here.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blogPosts, pages, pillarPages] = await Promise.all([
    prisma.blogPost.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.page.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.pillarPage.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${site.domain}`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${site.domain}/vacancies`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${site.domain}/availability-report`, lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: `${site.domain}/faqs`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${site.domain}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    ...STATIC_PAGES.map((p) => ({
      url: `${site.domain}${p.path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];

  const pillarRoutes: MetadataRoute.Sitemap = pillarPages.map((p) => ({
    url: `${site.domain}/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const pageRoutes: MetadataRoute.Sitemap = pages.map((p) => ({
    url: `${site.domain}/p/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${site.domain}/blog/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...pillarRoutes, ...pageRoutes, ...blogRoutes];
}
