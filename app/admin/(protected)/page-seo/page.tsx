import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { STATIC_PAGES } from "@/lib/static-pages";

export const dynamic = "force-dynamic";

export default async function PageSeoAdminPage() {
  const overrides = await prisma.pageSeoOverride.findMany();
  const overrideMap = new Map(overrides.map((o) => [o.path, o]));

  return (
    <div>
      <h1 className="text-2xl font-semibold">Page SEO</h1>
      <p className="mt-1 text-sm text-slate-500">
        Title and meta description overrides for the site&apos;s static (non-CMS) pages. Blog posts, Pages, and
        Pillar Pages already have their own SEO fields — edit those directly under their own sections.
      </p>
      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-500">
            <tr>
              <th className="px-4 py-3">Page</th>
              <th className="px-4 py-3">SEO title</th>
              <th className="px-4 py-3">SEO description</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {STATIC_PAGES.map((p) => {
              const o = overrideMap.get(p.path);
              return (
                <tr key={p.path} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">
                    {p.label} <span className="text-slate-400">({p.path})</span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {o?.seoTitle || <span className="italic text-slate-300">using page default</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {o?.seoDescription ? (
                      o.seoDescription.slice(0, 60) + (o.seoDescription.length > 60 ? "…" : "")
                    ) : (
                      <span className="italic text-slate-300">using page default</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/page-seo/edit?path=${encodeURIComponent(p.path)}`} className="text-midpoint-dark underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
