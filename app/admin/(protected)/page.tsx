import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Building2,
  ChartNoAxesCombined,
  Eye,
  Gauge,
  Layers3,
  MapPin,
  MessageSquareText,
  Ruler,
  Search,
  TrendingUp,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { scoreContent } from "@/lib/seo-score";
import { getAuditRows, summarizeAuditRows } from "@/lib/seo-audit";
import { vacancyReadinessScore } from "@/lib/vacancy-scores";

export const dynamic = "force-dynamic";

const SECTORS = ["WAREHOUSE", "OFFICE", "SERVICED_OFFICE"];
const PERIODS = ["30", "90", "365", "ALL"];

function compact(value: number) {
  return new Intl.NumberFormat("en-ZA", {
    notation: value >= 10_000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

function integer(value: number) {
  return new Intl.NumberFormat("en-ZA", { maximumFractionDigits: 0 }).format(value);
}

function currency(value: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    notation: value >= 1_000_000 ? "compact" : "standard",
    maximumFractionDigits: value >= 1_000_000 ? 1 : 0,
  }).format(value);
}

function label(value: string) {
  return value
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function periodLabel(period: string) {
  return period === "ALL" ? "all recorded activity" : `the last ${period} days`;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function MetricCard({
  title,
  value,
  detail,
  icon: Icon,
  tone = "navy",
}: {
  title: string;
  value: string;
  detail: string;
  icon: typeof Building2;
  tone?: "navy" | "gold" | "green" | "blue";
}) {
  const tones = {
    navy: "bg-[#071b3c] text-white",
    gold: "bg-[#d9ad28] text-[#071b3c]",
    green: "bg-emerald-600 text-white",
    blue: "bg-blue-600 text-white",
  };
  const bars = { navy: "bg-[#071b3c]", gold: "bg-[#d9ad28]", green: "bg-emerald-500", blue: "bg-blue-500" };

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start justify-between p-5">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-black tracking-tight text-[#071b3c]">{value}</p>
          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>
        <span className={`rounded-xl p-3 ${tones[tone]}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className={`h-1 ${bars[tone]}`} />
    </article>
  );
}

function SmallMetric({ icon: Icon, value, label: title }: { icon: typeof Building2; value: number; label: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <span className="rounded-xl bg-slate-100 p-3 text-[#071b3c]">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-2xl font-black text-[#071b3c]">{integer(value)}</p>
        <p className="text-xs text-slate-500">{title}</p>
      </div>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
      <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <h2 className="font-bold text-[#071b3c]">{title}</h2>
          {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
        </div>
        <ChartNoAxesCombined className="h-5 w-5 text-[#d9ad28]" />
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function BarList({ rows, suffix = "" }: { rows: { name: string; value: number; secondary?: string }[]; suffix?: string }) {
  const maximum = Math.max(...rows.map((row) => row.value), 1);
  if (rows.length === 0) return <EmptyState />;

  return (
    <div className="space-y-4">
      {rows.map((row, index) => (
        <div key={row.name}>
          <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
            <span className="truncate font-semibold text-slate-700">{row.name}</span>
            <span className="shrink-0 font-bold text-[#071b3c]">
              {compact(row.value)}
              {suffix} {row.secondary ? <span className="font-normal text-slate-400">· {row.secondary}</span> : null}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={index === 0 ? "h-full rounded-full bg-[#d9ad28]" : "h-full rounded-full bg-[#071b3c]"}
              style={{ width: `${Math.max(4, (row.value / maximum) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function Legend({ color, label: text }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-2 text-slate-600">
      <span className={`h-2.5 w-2.5 rounded-sm ${color}`} />
      {text}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="grid min-h-32 place-items-center text-center">
      <div>
        <MapPin className="mx-auto h-6 w-6 text-slate-300" />
        <p className="mt-2 text-sm text-slate-400">No matching data yet</p>
      </div>
    </div>
  );
}

function FilterSelect({ name, value, options, period = false }: { name: string; value: string; options: string[]; period?: boolean }) {
  return (
    <select name={name} defaultValue={value} className="h-11 rounded-lg border border-white/15 bg-white/10 px-3 text-sm text-white outline-none focus:border-[#d9ad28]">
      {options.map((option) => (
        <option key={option} value={option} className="text-slate-950">
          {period
            ? option === "ALL"
              ? "All activity"
              : `Last ${option} days`
            : option === "ALL"
              ? "All sectors"
              : label(option)}
        </option>
      ))}
    </select>
  );
}

type ScoredContent = {
  id: string;
  type: "Blog" | "Page" | "Pillar";
  title: string;
  status: string;
  updatedAt: Date;
  score: number;
  issue: string | null;
  issueCount: number;
  editHref: string;
};

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ sector?: string; period?: string }>;
}) {
  const filters = await searchParams;
  const sector = SECTORS.includes(filters.sector || "") ? filters.sector! : "ALL";
  const period = PERIODS.includes(filters.period || "") ? filters.period! : "90";
  const since = period === "ALL" ? undefined : new Date(Date.now() - Number(period) * 86_400_000);

  const [vacancies, enquiriesInPeriod, enquiryTotal, enquiryUnhandled, recentEnquiries, pageViews, vacancyEnquireEvents, blogPosts, pages, pillarPages, auditRows] =
    await Promise.all([
      prisma.vacancy.findMany({ orderBy: { updatedAt: "desc" } }),
      prisma.enquiry.findMany({ where: since ? { createdAt: { gte: since } } : undefined, select: { createdAt: true } }),
      prisma.enquiry.count(),
      prisma.enquiry.count({ where: { handled: false } }),
      prisma.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.pageView.findMany({ where: since ? { createdAt: { gte: since } } : undefined, select: { path: true, createdAt: true } }),
      prisma.vacancyEvent.findMany({
        where: { type: "ENQUIRE", ...(since ? { createdAt: { gte: since } } : {}) },
        select: { building: true },
      }),
      prisma.blogPost.findMany({ orderBy: { updatedAt: "desc" } }),
      prisma.page.findMany({ orderBy: { updatedAt: "desc" } }),
      prisma.pillarPage.findMany({ orderBy: { updatedAt: "desc" } }),
      getAuditRows(),
    ]);

  const matchingVacancies = vacancies.filter((v) => sector === "ALL" || v.sector === sector);
  const liveVacancies = matchingVacancies.filter((v) => v.status === "PUBLISHED");
  const buildingCount = new Set(liveVacancies.map((v) => v.building)).size;
  const totalSqm = liveVacancies.reduce((sum, v) => sum + v.sizeSqm, 0);
  const monthlyValue = liveVacancies.reduce((sum, v) => sum + v.sizeSqm * v.ratePerSqm, 0);
  const views = pageViews.length;
  const enquiryCount = enquiriesInPeriod.length;
  const conversionRate = views ? (enquiryCount / views) * 100 : 0;
  const liveRate = matchingVacancies.length ? (liveVacancies.length / matchingVacancies.length) * 100 : 0;

  // Live SEO score — same site-wide audit rows (Blog + Pages + Pillar pages
  // + the 4 static pages + every live vacancy) and the same check-weighted
  // formula as /admin/seo-audit, via the shared lib/seo-audit.ts. This used
  // to be a narrower per-item average across only Blog/Page/Pillar content,
  // which silently excluded static pages and vacancies and produced a
  // different (lower) number than the audit page for the same site.
  const { overallScore: siteWideSeoScore, itemCount: siteWideItemCount } = summarizeAuditRows(auditRows);

  // Content SEO score across every published Blog post, Page and Pillar
  // page — kept separately, purely to drive the "Priority content
  // improvements" list below (which links straight to each item's editor).
  const scoredBlog = blogPosts
    .filter((p) => p.status === "PUBLISHED")
    .map((p) => {
      const result = scoreContent(p);
      return { p, result };
    });
  const scoredPages = pages
    .filter((p) => p.status === "PUBLISHED")
    .map((p) => {
      const result = scoreContent(p);
      return { p, result };
    });
  const scoredPillars = pillarPages
    .filter((p) => p.status === "PUBLISHED")
    .map((p) => {
      const result = auditRows.find((row) => row.id === `pillar-${p.id}`)?.result;
      if (!result) return null;
      return { p, result };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const scoredVacancies = liveVacancies.map((v) => ({ v, result: vacancyReadinessScore(v) }));
  const averageVacancyReadiness = scoredVacancies.length
    ? scoredVacancies.reduce((s, x) => s + x.result.score, 0) / scoredVacancies.length
    : 0;

  const priorityContent: ScoredContent[] = [
    ...scoredBlog.map(({ p, result }) => ({
      id: p.id,
      type: "Blog" as const,
      title: p.title,
      status: p.status,
      updatedAt: p.updatedAt,
      score: result.score,
      issue: result.checks.find((c) => c.status !== "good")?.message || null,
      issueCount: result.checks.filter((c) => c.status !== "good").length,
      editHref: `/admin/blog/${p.id}/edit`,
    })),
    ...scoredPages.map(({ p, result }) => ({
      id: p.id,
      type: "Page" as const,
      title: p.title,
      status: p.status,
      updatedAt: p.updatedAt,
      score: result.score,
      issue: result.checks.find((c) => c.status !== "good")?.message || null,
      issueCount: result.checks.filter((c) => c.status !== "good").length,
      editHref: `/admin/pages/${p.id}/edit`,
    })),
    ...scoredPillars.map(({ p, result }) => ({
      id: p.id,
      type: "Pillar" as const,
      title: p.title,
      status: p.status,
      updatedAt: p.updatedAt,
      score: result.score,
      issue: result.checks.find((c) => c.status !== "good")?.message || null,
      issueCount: result.checks.filter((c) => c.status !== "good").length,
      editHref: `/admin/pillar-pages/${p.id}/edit`,
    })),
  ]
    .filter((item) => item.score < 90)
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);

  const sectorMap = new Map<string, number>();
  const buildingMap = new Map<string, number>();
  for (const v of liveVacancies) {
    sectorMap.set(v.sector, (sectorMap.get(v.sector) || 0) + v.sizeSqm);
    buildingMap.set(v.building, (buildingMap.get(v.building) || 0) + v.sizeSqm);
  }
  const sectorRows = [...sectorMap].map(([name, value]) => ({ name: label(name), value })).sort((a, b) => b.value - a.value);
  const buildingRows = [...buildingMap]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const topPageMap = new Map<string, number>();
  pageViews.forEach((v) => topPageMap.set(v.path, (topPageMap.get(v.path) || 0) + 1));
  const topPageRows = [...topPageMap]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const vacancyInterestMap = new Map<string, number>();
  vacancyEnquireEvents.forEach((e) => {
    const key = e.building || "Unknown listing";
    vacancyInterestMap.set(key, (vacancyInterestMap.get(key) || 0) + 1);
  });
  const vacancyInterestRows = [...vacancyInterestMap]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 6);

  const draftCount =
    blogPosts.filter((p) => p.status === "DRAFT").length +
    pages.filter((p) => p.status === "DRAFT").length +
    pillarPages.filter((p) => p.status === "DRAFT").length;
  const publishedCount =
    blogPosts.filter((p) => p.status === "PUBLISHED").length +
    pages.filter((p) => p.status === "PUBLISHED").length +
    pillarPages.filter((p) => p.status === "PUBLISHED").length;
  const lifecycleRows = [
    { name: "Published", value: publishedCount },
    { name: "Draft", value: draftCount },
  ];

  // 6-bucket trend of page views vs enquiries across the selected window.
  const activityDates = [...pageViews.map((v) => v.createdAt), ...enquiriesInPeriod.map((e) => e.createdAt)];
  const defaultStart = startOfMonth(new Date());
  defaultStart.setMonth(defaultStart.getMonth() - 5);
  const activityStart = since || (activityDates.length ? new Date(Math.min(...activityDates.map((d) => d.getTime()))) : defaultStart);
  const activityEnd = new Date();
  const bucketDuration = Math.max(1, (activityEnd.getTime() - activityStart.getTime()) / 6);
  const months = Array.from({ length: 6 }, (_, index) => {
    const bucketStart = new Date(activityStart.getTime() + bucketDuration * index);
    const bucketEnd = index === 5 ? activityEnd : new Date(activityStart.getTime() + bucketDuration * (index + 1));
    const inBucket = (date: Date) => date >= bucketStart && (index === 5 ? date <= bucketEnd : date < bucketEnd);
    return {
      key: bucketStart.toISOString(),
      label: bucketStart.toLocaleDateString("en-ZA", { day: "2-digit", month: "short" }),
      views: pageViews.filter((v) => inBucket(v.createdAt)).length,
      enquiries: enquiriesInPeriod.filter((e) => inBucket(e.createdAt)).length,
    };
  });
  const trendMaximum = Math.max(...months.flatMap((m) => [m.views, m.enquiries]), 1);

  return (
    <div className="mx-auto max-w-[1600px] space-y-6">
      <div className="overflow-hidden rounded-2xl bg-[#071b3c] text-white shadow-lg">
        <div className="flex flex-col gap-5 px-6 py-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#e0b52e]">Midpoint Intelligence</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight">Executive dashboard</h1>
            <p className="mt-1 text-sm text-slate-300">Live leasing performance, content readiness and enquiry intelligence.</p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <span className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            </span>
            <div>
              <p className="text-xs font-bold">Site data live</p>
              <p className="text-[10px] text-slate-400">Updated from PostgreSQL</p>
            </div>
          </div>
        </div>
        <form className="grid gap-3 border-t border-white/10 bg-black/10 px-6 py-4 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_auto]">
          <FilterSelect name="sector" value={sector} options={["ALL", ...SECTORS]} />
          <FilterSelect name="period" value={period} options={PERIODS} period />
          <button className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#d9ad28] px-5 text-sm font-bold text-[#071b3c] hover:bg-[#e6bd3d]" type="submit">
            <Search className="h-4 w-4" /> Apply filters
          </button>
        </form>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Live availability" value={integer(liveVacancies.length)} detail={`${liveRate.toFixed(0)}% of ${matchingVacancies.length} matching listings`} icon={Layers3} />
        <MetricCard title="Available space" value={`${compact(totalSqm)} m²`} detail={`Across ${buildingCount} buildings`} icon={Ruler} tone="gold" />
        <MetricCard title="Monthly rental value" value={currency(monthlyValue)} detail="Published vacancy inventory" icon={TrendingUp} tone="green" />
        <MetricCard title="Enquiry conversion" value={`${conversionRate.toFixed(1)}%`} detail={`${enquiryCount} enquiries from ${views} page views`} icon={Gauge} tone="blue" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SmallMetric icon={Building2} value={buildingCount} label="Live buildings" />
        <SmallMetric icon={Eye} value={views} label={`Page views · ${periodLabel(period)}`} />
        <SmallMetric icon={MessageSquareText} value={enquiryCount} label={`Enquiries · ${periodLabel(period)}`} />
        <SmallMetric icon={AlertTriangle} value={enquiryUnhandled} label={`Unhandled enquiries of ${enquiryTotal} total`} />
      </div>

      <div className="grid gap-6 xl:grid-cols-4">
        <Link href="/admin/seo-audit" className="block">
          <MetricCard title="Live SEO score" value={`${siteWideSeoScore}%`} detail={`Search readiness across ${siteWideItemCount} published items — see full audit`} icon={Search} tone="blue" />
        </Link>
        <MetricCard title="Vacancy readiness score" value={`${averageVacancyReadiness.toFixed(0)}%`} detail={`Content completeness across ${liveVacancies.length} live listings`} icon={Gauge} tone="green" />
        <Panel title="Top pages" subtitle={`Site-wide page views · ${periodLabel(period)}`}>
          <BarList rows={topPageRows} />
        </Panel>
        <Panel title="Vacancy interest" subtitle={`"Enquire" clicks · ${periodLabel(period)}`}>
          <BarList rows={vacancyInterestRows} />
        </Panel>
      </div>

      <Panel title="Priority content improvements" subtitle="Lowest SEO scores across published Blog posts, Pages and Pillar pages">
        <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-5">
          {priorityContent.map((item) => (
            <Link key={`${item.type}-${item.id}`} href={item.editHref} className="rounded-xl border border-slate-200 p-4 transition hover:border-[#d9ad28] hover:bg-amber-50/40">
              <p className="truncate font-bold text-[#071b3c]">{item.title}</p>
              <p className="mt-1 truncate text-[11px] text-slate-500">
                {item.type} · updated {item.updatedAt.toLocaleDateString("en-ZA", { day: "2-digit", month: "short" })}
              </p>
              <div className="mt-3 flex gap-2 text-xs">
                <span className="rounded-full bg-blue-50 px-2 py-1 font-semibold text-blue-800">SEO {item.score}%</span>
              </div>
              <p className="mt-3 line-clamp-2 text-xs text-slate-500">{item.issue || "Ready to publish"}</p>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">{item.issueCount} checks outstanding</p>
            </Link>
          ))}
          {!priorityContent.length ? <EmptyState /> : null}
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <Panel title="Site engagement trend" subtitle={`Page views and enquiries across ${periodLabel(period)}`}>
          <div className="flex h-64 items-end gap-3 border-b border-slate-200 pt-8">
            {months.map((month) => (
              <div key={month.key} className="flex h-full flex-1 flex-col justify-end">
                <div className="flex flex-1 items-end justify-center gap-1.5">
                  <div title={`${month.views} views`} className="w-[38%] rounded-t bg-[#071b3c]" style={{ height: `${Math.max(3, (month.views / trendMaximum) * 100)}%` }} />
                  <div title={`${month.enquiries} enquiries`} className="w-[38%] rounded-t bg-[#d9ad28]" style={{ height: `${Math.max(3, (month.enquiries / trendMaximum) * 100)}%` }} />
                </div>
                <p className="py-3 text-center text-[10px] font-bold uppercase text-slate-500">{month.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-5 text-xs">
            <Legend color="bg-[#071b3c]" label="Views" />
            <Legend color="bg-[#d9ad28]" label="Enquiries" />
          </div>
        </Panel>

        <Panel title="Availability by sector" subtitle="Live gross lettable area">
          <BarList rows={sectorRows} suffix=" m²" />
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Building concentration" subtitle="Largest live vacancies by total area">
          <BarList rows={buildingRows} suffix=" m²" />
        </Panel>
        <Panel title="Content lifecycle" subtitle="Published vs. draft across Blog, Pages and Pillar pages">
          <BarList rows={lifecycleRows} />
          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs text-slate-600">
            <p><strong className="text-[#071b3c]">{draftCount}</strong> items are still in draft.</p>
          </div>
          <Link href="/admin/pages" className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-[#071b3c] hover:bg-slate-50">
            Manage all pages <ArrowRight className="h-4 w-4" />
          </Link>
        </Panel>
        <Panel title="Vacancy quality" subtitle="Live inventory requiring attention">
          <div className="flex items-center gap-5 rounded-xl bg-amber-50 p-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-amber-100 text-2xl font-black text-amber-800">
              {scoredVacancies.filter((x) => x.result.issues.length > 0).length}
            </div>
            <div>
              <p className="font-bold text-amber-950">of {liveVacancies.length} live listings need attention</p>
              <p className="mt-1 text-xs text-amber-800">Only currently published vacancies are included.</p>
            </div>
          </div>
          <Link href="/admin/vacancies" className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-[#071b3c] hover:bg-slate-50">
            Review vacancies <ArrowRight className="h-4 w-4" />
          </Link>
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Panel title="Top pages" subtitle={`Ranked by views · ${periodLabel(period)}`}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="pb-3">Path</th>
                  <th className="pb-3 text-right">Views</th>
                </tr>
              </thead>
              <tbody>
                {topPageRows.map((row) => (
                  <tr key={row.name} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 pr-4 font-bold text-[#071b3c]">{row.name}</td>
                    <td className="py-3 text-right font-semibold">{integer(row.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!topPageRows.length ? <EmptyState /> : null}
          </div>
        </Panel>

        <Panel title="Latest enquiries" subtitle={`Newest submissions · ${periodLabel(period)}`}>
          <div className="space-y-3">
            {recentEnquiries.map((enquiry) => {
              const name = [enquiry.firstName, enquiry.lastName].filter(Boolean).join(" ") || enquiry.email;
              return (
                <Link key={enquiry.id} href="/admin/enquiries" className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 hover:border-[#d9ad28] hover:bg-amber-50/40">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#071b3c] text-sm font-bold text-white">
                    {name.charAt(0).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-[#071b3c]">{name}</span>
                    <span className="block truncate text-xs text-slate-500">{enquiry.interest || "General enquiry"}</span>
                  </span>
                  <span className="shrink-0 text-[10px] text-slate-400">
                    {enquiry.createdAt.toLocaleDateString("en-ZA", { day: "2-digit", month: "short" })}
                  </span>
                </Link>
              );
            })}
            {!recentEnquiries.length ? <EmptyState /> : null}
          </div>
        </Panel>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-xs text-slate-500 shadow-sm">
        <span className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-600" /> Inventory and quality metrics use currently published vacancies and content.
        </span>
        <span className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-[#d9ad28]" /> Sector filters vacancy inventory; period filters activity and trends.
        </span>
      </div>
    </div>
  );
}
