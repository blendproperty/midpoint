import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { STATIC_PAGES } from "@/lib/static-pages";
import NewPageMenu from "@/components/admin/NewPageMenu";

export const dynamic = "force-dynamic";

type PageType = "Blog" | "Page" | "Pillar" | "Static";

type Row = {
  key: string;
  type: PageType;
  title: string;
  status: string;
  updatedAt: Date;
  editHref: string;
};

const TYPE_TABS: Array<PageType | "All"> = ["All", "Blog", "Page", "Pillar", "Static"];
const STATUS_OPTIONS = ["All", "PUBLISHED", "DRAFT", "CUSTOMIZED", "DEFAULT"];
const LIMIT_OPTIONS = ["10", "25", "50", "All"];

const STATUS_STYLES: Record<string, string> = {
  PUBLISHED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  DRAFT: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  CUSTOMIZED: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  DEFAULT: "bg-slate-50 text-slate-500 ring-1 ring-slate-200",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[status] || STATUS_STYLES.DEFAULT}`}>
      {status}
    </span>
  );
}

// Every page on the site — blog posts, standalone Pages, Pillar Pages, and
// the static pages' SEO overrides — in one filterable, searchable list, so
// there's a single "Pages" destination in the admin instead of four separate
// sections. Each row still links out to its own type-specific editor, since
// Blog/Page/Pillar have genuinely different fields.
export default async function PagesHub({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string; q?: string; limit?: string }>;
}) {
  const { type, status, q, limit } = await searchParams;

  const [blogPosts, pages, pillarPages, overrides] = await Promise.all([
    prisma.blogPost.findMany({ orderBy: { updatedAt: "desc" } }),
    prisma.page.findMany({ orderBy: { updatedAt: "desc" } }),
    prisma.pillarPage.findMany({ orderBy: { updatedAt: "desc" } }),
    prisma.pageSeoOverride.findMany(),
  ]);
  const overrideMap = new Map(overrides.map((o) => [o.path, o]));

  const rows: Row[] = [
    ...blogPosts.map((p) => ({
      key: `blog-${p.id}`,
      type: "Blog" as const,
      title: p.title,
      status: p.status,
      updatedAt: p.updatedAt,
      editHref: `/admin/blog/${p.id}/edit`,
    })),
    ...pages.map((p) => ({
      key: `page-${p.id}`,
      type: "Page" as const,
      title: p.title,
      status: p.status,
      updatedAt: p.updatedAt,
      editHref: `/admin/pages/${p.id}/edit`,
    })),
    ...pillarPages.map((p) => ({
      key: `pillar-${p.id}`,
      type: "Pillar" as const,
      title: p.title,
      status: p.status,
      updatedAt: p.updatedAt,
      editHref: `/admin/pillar-pages/${p.id}/edit`,
    })),
    ...STATIC_PAGES.map((s) => {
      const o = overrideMap.get(s.path);
      return {
        key: `static-${s.path}`,
        type: "Static" as const,
        title: s.label,
        status: o ? "CUSTOMIZED" : "DEFAULT",
        updatedAt: o?.updatedAt || new Date(0),
        editHref: `/admin/page-seo/edit?path=${encodeURIComponent(s.path)}`,
      };
    }),
  ];

  let filtered = type ? rows.filter((r) => r.type === type) : rows;
  if (status && status !== "All") filtered = filtered.filter((r) => r.status === status);
  if (q && q.trim()) {
    const needle = q.trim().toLowerCase();
    filtered = filtered.filter((r) => r.title.toLowerCase().includes(needle));
  }
  filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  const limitNum = limit && limit !== "All" ? Number(limit) : undefined;
  const shown = limitNum ? filtered.slice(0, limitNum) : filtered;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Pages</h1>
          <p className="mt-1 text-sm text-slate-500">
            Every page on the site in one place — blog posts, standalone pages, pillar pages, and the static pages&apos;
            SEO settings.
          </p>
        </div>
        <NewPageMenu />
      </div>

      <div className="mt-4 flex gap-2">
        {TYPE_TABS.map((t) => (
          <Link
            key={t}
            href={t === "All" ? "/admin/pages" : `/admin/pages?type=${t}`}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              (t === "All" && !type) || type === t ? "bg-midpoint-dark text-white" : "bg-white text-slate-600"
            }`}
          >
            {t}
          </Link>
        ))}
      </div>

      <form method="get" className="mt-4 grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-4">
        {type && <input type="hidden" name="type" value={type} />}
        <div>
          <label className="block text-xs font-medium text-slate-500">Show</label>
          <select name="limit" defaultValue={limit || "10"} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
            {LIMIT_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n === "All" ? "All entries" : `${n} entries`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500">Status</label>
          <select name="status" defaultValue={status || "All"} className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All statuses" : s}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-slate-500">Search</label>
          <div className="mt-1 flex gap-2">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search pages by title…"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
            />
            <button className="shrink-0 rounded-xl bg-midpoint-dark px-4 py-2 text-sm font-semibold text-white">Filter</button>
          </div>
        </div>
      </form>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.key} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-800">{r.title}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{r.type}</span>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {r.updatedAt.getTime() > 0 ? r.updatedAt.toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={r.editHref} className="font-medium text-midpoint-dark underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  No matching pages.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-400">
          <span>
            Showing {shown.length} of {filtered.length} pages
          </span>
        </div>
      </div>
    </div>
  );
}
