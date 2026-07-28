import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { STATIC_PAGES } from "@/lib/static-pages";
import { getStaticPageContent } from "@/lib/static-page-content";
import { scoreContent, scorePillarPage, scoreStaticPage, scoreVacancyListing, type SeoScoreResult } from "@/lib/seo-score";

export const dynamic = "force-dynamic";

type AuditRow = {
  id: string;
  type: "Blog post" | "Page" | "Pillar page" | "Static page" | "Vacancy listing";
  title: string;
  editHref: string;
  focusKeyword: string;
  result: SeoScoreResult;
};

type PillarFaq = { question: string; answer: string };

const STATUS_STYLES: Record<string, string> = {
  Good: "bg-emerald-100 text-emerald-700",
  "Needs improvement": "bg-amber-100 text-amber-700",
  Poor: "bg-red-100 text-red-700",
};

async function getAuditRows(): Promise<AuditRow[]> {
  const [posts, pages, pillars, overrides, vacancies] = await Promise.all([
    prisma.blogPost.findMany({ where: { status: "PUBLISHED" } }),
    prisma.page.findMany({ where: { status: "PUBLISHED" } }),
    prisma.pillarPage.findMany({ where: { status: "PUBLISHED" } }),
    prisma.pageSeoOverride.findMany(),
    prisma.vacancy.findMany({ where: { status: "PUBLISHED" } }),
  ]);
  const overrideMap = new Map(overrides.map((o) => [o.path, o]));

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
    const faqs = Array.isArray(p.faqs) ? (p.faqs as unknown as PillarFaq[]) : [];
    return {
      id: `pillar-${p.id}`,
      type: "Pillar page",
      title: p.title,
      editHref: `/admin/pillar-pages/${p.id}/edit`,
      focusKeyword: p.focusKeyword?.trim() || "",
      result: scorePillarPage({
        title: p.title,
        slug: p.slug,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        contentHtml: p.contentHtml,
        focusKeyword: p.focusKeyword,
        heroAnswer: p.heroAnswer,
        expertName: p.expertName,
        expertBio: p.expertBio,
        faqs,
        lastReviewedAt: p.lastReviewedAt,
      }),
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

// Two or more published pieces of content targeting the exact same focus
// keyword compete against each other in search instead of either one
// ranking well — Rank Math calls this "keyword cannibalization". Grouped
// case-insensitively; blank focus keywords are ignored (nothing to compare).
// Static pages and vacancy listings don't carry a focus keyword, so they
// never enter this check — that's fine, it's a different kind of problem
// (see the on-page checklist for those row types instead).
function findCannibalization(rows: AuditRow[]): { keyword: string; titles: string[] }[] {
  const groups = new Map<string, string[]>();
  for (const row of rows) {
    if (!row.focusKeyword) continue;
    const key = row.focusKeyword.toLowerCase();
    const existing = groups.get(key) || [];
    existing.push(row.title);
    groups.set(key, existing);
  }
  return [...groups.entries()]
    .filter(([, titles]) => titles.length > 1)
    .map(([keyword, titles]) => ({ keyword, titles }));
}

export default async function SeoAuditPage() {
  const rows = await getAuditRows();
  const cannibalization = findCannibalization(rows);
  const worstCount = rows.filter((r) => r.result.grade !== "Good").length;

  return (
    <div>
      <h1 className="text-2xl font-semibold">SEO audit</h1>
      <p className="mt-1 text-sm text-slate-500">
        Every published blog post, page, pillar page, static page, and vacancy listing scored with the same kind
        of checklist used on each editor, sorted worst-first so weak content is visible without opening every
        item individually.
      </p>

      <div className="mt-4 flex gap-4 text-sm">
        <p className="rounded-full bg-white px-4 py-2 shadow-sm">{rows.length} item(s) audited</p>
        <p className="rounded-full bg-white px-4 py-2 shadow-sm">
          {worstCount} need{worstCount === 1 ? "s" : ""} attention
        </p>
      </div>

      {cannibalization.length > 0 && (
        <div className="mt-6 rounded-xl bg-amber-50 p-4">
          <h2 className="text-sm font-semibold text-amber-800">Keyword cannibalization</h2>
          <p className="mt-1 text-xs text-amber-700">
            These focus keywords are targeted by more than one published page — they'll compete against each
            other in search instead of either one ranking well. Consider giving each page a distinct keyword,
            or merging/redirecting the weaker one.
          </p>
          <ul className="mt-3 space-y-2">
            {cannibalization.map((c) => (
              <li key={c.keyword} className="text-sm text-amber-900">
                <span className="font-medium">"{c.keyword}"</span> — {c.titles.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Focus keyword</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium">{row.title}</td>
                <td className="px-4 py-3 text-slate-500">{row.type}</td>
                <td className="px-4 py-3 text-slate-500">{row.focusKeyword || "—"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[row.result.grade]}`}>
                    {row.result.score}/100 — {row.result.grade}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={row.editHref} className="text-xs font-semibold text-midpoint-dark underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  No published content yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
