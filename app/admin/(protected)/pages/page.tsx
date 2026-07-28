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

const TABS: Array<PageType | "All"> = ["All", "Blog", "Page", "Pillar", "Static"];

// Every page on the site — blog posts, standalone Pages, Pillar Pages, and
// the static pages' SEO overrides — in one list, so there's a single "Pages"
// destination in the admin instead of four separate sections. Each row still
// links out to its own type-specific editor, since Blog/Page/Pillar have
// genuinely different fields (splitting them into one mega-form would make
// pillar pages unusable and blog posts bloated).
export default async function PagesHub({ searchParams }: { searchParams: Promise<{ type?: string }> }) {
  const { type } = await searchParams;

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

  const filtered = type ? rows.filter((r) => r.type === type) : rows;
  filtered.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pages</h1>
        <NewPageMenu />
      </div>
      <p className="mt-1 text-sm text-slate-500">
        Every page on the site in one place — blog posts, standalone pages, pillar pages, and the static pages&apos;
        SEO settings.
      </p>

      <div className="mt-4 flex gap-2">
        {TABS.map((t) => (
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

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.key} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium">{r.title}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">{r.type}</span>
                </td>
                <td className="px-4 py-3 text-slate-500">{r.status}</td>
                <td className="px-4 py-3 text-slate-500">
                  {r.updatedAt.getTime() > 0 ? r.updatedAt.toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={r.editHref} className="text-midpoint-dark underline">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  Nothing here yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
