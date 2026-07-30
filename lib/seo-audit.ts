// Shared "whole site" SEO audit row-builder. Both the SEO audit page
// (/admin/seo-audit) and the executive dashboard's "Live SEO score" card
// import this same function so the two headline numbers are always computed
// from the exact same pool of content (Blog posts + Pages + Pillar pages +
// the 4 static pages + every live Vacancy listing) instead of silently
// drifting apart — which is what caused the dashboard to show 44% while the
// audit page showed 74/100 for the same site: the dashboard used to only
// average Blog/Page/Pillar scores and completely left out static pages and
// vacancies.
import { prisma } from "@/lib/prisma";
import { STATIC_PAGES } from "@/lib/static-pages";
import { getStaticPageContent } from "@/lib/static-page-content";
import { buildMediaAltByUrl, pillarScoreInput } from "@/lib/pillar-score-data";
import {
  scoreContent,
  scorePillarPage,
  scoreStaticPage,
  scoreVacancyListing,
  STATUS_POINTS,
  type SeoScoreResult,
} from "@/lib/seo-score";

export type AuditRow = {
  id: string;
  type: "Blog post" | "Page" | "Pillar page" | "Static page" | "Vacancy listing";
  title: string;
  editHref: string;
  focusKeyword: string;
  result: SeoScoreResult;
};

export async function getAuditRows(): Promise<AuditRow[]> {
  const [posts, pages, pillars, overrides, vacancies, media] = await Promise.all([
    prisma.blogPost.findMany({ where: { status: "PUBLISHED" } }),
    prisma.page.findMany({ where: { status: "PUBLISHED" } }),
    prisma.pillarPage.findMany({ where: { status: "PUBLISHED" } }),
    prisma.pageSeoOverride.findMany(),
    prisma.vacancy.findMany({ where: { status: "PUBLISHED" } }),
    prisma.media.findMany({ select: { url: true, alt: true } }),
  ]);
  const overrideMap = new Map(overrides.map((o) => [o.path, o]));
  const mediaAltByUrl = buildMediaAltByUrl(media);

  const postRows: AuditRow[] = posts.map((p) => ({
    id: `blog-${p.id}`,
    type: "Blog post",
    title: p.title,
    editHref: `/admin/blog/${p.id}/edit`,
    focusKeyword: p.focusKeyword?.trim() || "",
    result: scoreContent({
      title: p.title,
      slug: p.slug,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      contentHtml: p.contentHtml,
      focusKeyword: p.focusKeyword,
    }),
  }));

  const pageRows: AuditRow[] = pages.map((p) => ({
    id: `page-${p.id}`,
    type: "Page",
    title: p.title,
    editHref: `/admin/pages/${p.id}/edit`,
    focusKeyword: p.focusKeyword?.trim() || "",
    result: scoreContent({
      title: p.title,
      slug: p.slug,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      contentHtml: p.contentHtml,
      focusKeyword: p.focusKeyword,
    }),
  }));

  const pillarRows: AuditRow[] = pillars.map((p) => {
    return {
      id: `pillar-${p.id}`,
      type: "Pillar page",
      title: p.title,
      editHref: `/admin/pillar-pages/${p.id}/edit`,
      focusKeyword: p.focusKeyword?.trim() || "",
      result: scorePillarPage(pillarScoreInput(p, mediaAltByUrl)),
    };
  });

  const staticRows: AuditRow[] = STATIC_PAGES.map((s) => {
    const o = overrideMap.get(s.path);
    return {
      id: `static-${s.path}`,
      type: "Static page",
      title: s.label,
      editHref: `/admin/page-seo/edit?path=${encodeURIComponent(s.path)}`,
      focusKeyword: "",
      result: scoreStaticPage({
        title: s.label,
        path: s.path,
        seoTitle: o?.seoTitle,
        seoDescription: o?.seoDescription,
        ogImage: o?.ogImage,
        pageContent: getStaticPageContent(s.path),
      }),
    };
  });

  const vacancyRows: AuditRow[] = vacancies.map((v) => ({
    id: `vacancy-${v.id}`,
    type: "Vacancy listing",
    title: v.building,
    editHref: `/admin/vacancies/${v.id}/edit`,
    focusKeyword: "",
    result: scoreVacancyListing({
      building: v.building,
      description: v.description,
      image: v.image,
      features: v.features,
    }),
  }));

  return [...postRows, ...pageRows, ...pillarRows, ...staticRows, ...vacancyRows].sort(
    (a, b) => a.result.score - b.result.score
  );
}

export type SiteWideSeoSummary = {
  overallScore: number;
  itemCount: number;
  totalChecks: number;
  goodCount: number;
  okCount: number;
  badCount: number;
};

// The one true "site-wide SEO score" — a STATUS_POINTS-weighted average
// across every individual pass/warn/fail check on every published item
// (not a per-item average of per-item scores, which is a different number).
export function summarizeAuditRows(rows: AuditRow[]): SiteWideSeoSummary {
  const allChecks = rows.flatMap((r) => r.result.checks);
  const totalChecks = allChecks.length;
  const goodCount = allChecks.filter((c) => c.status === "good").length;
  const okCount = allChecks.filter((c) => c.status === "ok").length;
  const badCount = allChecks.filter((c) => c.status === "bad").length;
  const overallScore =
    totalChecks > 0
      ? Math.round((allChecks.reduce((sum, c) => sum + STATUS_POINTS[c.status], 0) / totalChecks) * 100)
      : 0;

  return { overallScore, itemCount: rows.length, totalChecks, goodCount, okCount, badCount };
}
