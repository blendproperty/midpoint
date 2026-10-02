import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { STATIC_PAGES } from "@/lib/static-pages";
import { getSiteSettings } from "@/lib/site-settings";
import { buildSitemap, type SitemapCandidate } from "@/lib/seo-sitemap";

export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings();
  if (!settings.allowIndexing) return [];
  const [posts, pages, pillars, overrides, vacancies, redirects] = await Promise.all([
    prisma.blogPost.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true, noIndex: true, canonicalUrl: true } }),
    prisma.page.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true, noIndex: true, canonicalUrl: true, passwordProtected: true } }),
    prisma.pillarPage.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true, noIndex: true, canonicalUrl: true, passwordProtected: true } }),
    prisma.pageSeoOverride.findMany(),
    prisma.vacancy.findMany({ where: { status: "PUBLISHED" }, select: { id: true, updatedAt: true } }),
    prisma.redirect.findMany({ select: { fromPath: true } }),
  ]);
  const byPath = new Map(overrides.map(o => [o.path, o]));
  const candidates: SitemapCandidate[] = [
    ...STATIC_PAGES.filter(p => p.path !== "/blog" || posts.some(post => !post.noIndex)).map(p => ({ path: p.path, ...byPath.get(p.path) })),
    ...posts.map(p => ({ ...p, path: `/blog/${p.slug}` })),
    ...pages.map(p => ({ ...p, path: `/p/${p.slug}` })),
    ...pillars.map(p => ({ ...p, path: `/${p.slug}` })),
    ...vacancies.map(v => { const path = `/vacancies/${encodeURIComponent(v.id)}`; return { path, updatedAt: v.updatedAt, ...byPath.get(path) }; }),
  ];
  return buildSitemap(settings.domain, settings.allowIndexing, candidates, redirects.map(r => r.fromPath));
}
