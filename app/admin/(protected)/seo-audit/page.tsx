import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { STATIC_PAGES } from "@/lib/static-pages";
import { getStaticPageContent } from "@/lib/static-page-content";
import {
  scoreContent,
  scorePillarPage,
  scoreStaticPage,
  scoreVacancyListing,
  STATUS_POINTS,
  type SeoScoreResult,
  type SeoCheckStatus,
} from "@/lib/seo-score";

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

const GRADE_STYLES: Record<string, string> = {
  Good: "bg-emerald-100 text-emerald-700",
  "Needs improvement": "bg-amber-100 text-amber-700",
  Poor: "bg-red-100 text-red-700",
};

const CHECK_STYLES: Record<SeoCheckStatus, string> = {
  good: "bg-emerald-100 text-emerald-700",
  ok: "bg-amber-100 text-amber-700",
  bad: "bg-red-100 text-red-700",
};

const CHECK_ICON: Record<SeoCheckStatus, string> = { good: "✓", ok: "!", bad: "✕" };

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

// A ring gauge like Rank Math/Yoast-style analyzers use for the headline
// score — SVG only, no client JS needed, colored to match the same
// good/ok/poor bands used everywhere else in the admin.
function ScoreGauge({ score }: { score: number }) {
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const color = score >= 80 ? "#059669" : score >= 50 ? "#d97706" : "#dc2626";

  return (
    <div className="relative h-44 w-44 shrink-0">
      <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
        <circle cx="80" cy="80" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="14" />
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-slate-800">{score}</span>
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">/ 100</span>
      </div>
    </div>
  );
}

function StatBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-semibold text-slate-800">
          {count}/{total}
        </span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

const FILTER_TABS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "good", label: "Passed" },
  { key: "ok", label: "Warnings" },
  { key: "bad", label: "Failed" },
];

export default async function SeoAuditPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const activeFilter = filter && ["good", "ok", "bad"].includes(filter) ? filter : "all";

  const rows = await getAuditRows();
  const cannibalization = findCannibalization(rows);

  const allChecks = rows.flatMap((r) => r.result.checks);
  const totalChecks = allChecks.length;
  const goodCount = allChecks.filter((c) => c.status === "good").length;
  const okCount = allChecks.filter((c) => c.status === "ok").length;
  const badCount = allChecks.filter((c) => c.status === "bad").length;
  const overallScore =
    totalChecks > 0
      ? Math.round((allChecks.reduce((sum, c) => sum + STATUS_POINTS[c.status], 0) / totalChecks) * 100)
      : 0;

  const filterCounts: Record<string, number> = { all: totalChecks, good: goodCount, ok: okCount, bad: badCount };

  // Group by content item so each section still links straight to its own
  // editor — only sections with at least one check matching the active
  // filter are shown. Items with no matching checks (e.g. a fully "Good"
  // page under the "Failed" tab) drop out entirely rather than showing an
  // empty section.
  const sections = rows
    .map((row) => ({
      row,
      checks: activeFilter === "all" ? row.result.checks : row.result.checks.filter((c) => c.status === activeFilter),
    }))
    .filter((s) => s.checks.length > 0);

  return (
    <div>
      <h1 className="text-2xl font-semibold">SEO audit</h1>
      <p className="mt-1 text-sm text-slate-500">
        Every published blog post, page, pillar page, static page, and vacancy listing scored with the same kind
        of checklist used on each editor.
      </p>

      <div className="mt-6 flex flex-col gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:flex-row md:items-center">
        <ScoreGauge score={overallScore} />
        <div className="flex-1 space-y-4">
          <StatBar label="Passed tests" count={goodCount} total={totalChecks} color="#059669" />
          <StatBar label="Warnings" count={okCount} total={totalChecks} color="#d97706" />
          <StatBar label="Failed tests" count={badCount} total={totalChecks} color="#dc2626" />
        </div>
        <div className="flex shrink-0 flex-col gap-2 text-sm text-slate-500 md:text-right">
          <span className="rounded-full bg-slate-50 px-4 py-2 font-medium">{rows.length} item(s) audited</span>
          <span className="rounded-full bg-slate-50 px-4 py-2 font-medium">{totalChecks} checks run</span>
        </div>
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

      <div className="mt-6 flex gap-2 border-b border-slate-200">
        {FILTER_TABS.map((tab) => (
          <Link
            key={tab.key}
            href={tab.key === "all" ? "/admin/seo-audit" : `/admin/seo-audit?filter=${tab.key}`}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold ${
              activeFilter === tab.key
                ? "border-midpoint-dark text-midpoint-dark"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
              {filterCounts[tab.key]}
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {sections.map(({ row, checks }) => (
          <details key={row.id} className="group overflow-hidden rounded-xl bg-white shadow-sm" open={row.result.grade !== "Good"}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <span className="text-slate-400 transition group-open:rotate-90">▶</span>
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800">{row.title}</p>
                  <p className="text-xs text-slate-400">
                    {row.type}
                    {row.focusKeyword ? ` · "${row.focusKeyword}"` : ""}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${GRADE_STYLES[row.result.grade]}`}>
                  {row.result.score}/100
                </span>
                <Link href={row.editHref} className="text-xs font-semibold text-midpoint-dark underline">
                  Edit
                </Link>
              </div>
            </summary>
            <ul className="space-y-2 border-t border-slate-100 px-5 py-4">
              {checks.map((check) => (
                <li key={check.id} className="flex items-start gap-3 text-sm">
                  <span
                    className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${CHECK_STYLES[check.status]}`}
                  >
                    {CHECK_ICON[check.status]}
                  </span>
                  <span>
                    <span className="font-medium text-slate-700">{check.label}:</span>{" "}
                    <span className="text-slate-500">{check.message}</span>
                  </span>
                </li>
              ))}
            </ul>
          </details>
        ))}
        {sections.length === 0 && (
          <div className="rounded-xl bg-white px-4 py-10 text-center text-slate-400 shadow-sm">
            {rows.length === 0 ? "No published content yet." : "Nothing matches this filter."}
          </div>
        )}
      </div>
    </div>
  );
}
