import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePage } from "./actions";
import { scoreContent } from "@/lib/seo-score";
import SeoScoreBadge from "@/components/admin/SeoScoreBadge";

export const dynamic = "force-dynamic";

export default async function PagesAdminPage() {
  const pages = await prisma.page.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pages</h1>
        <Link href="/admin/pages/new" className="rounded-full bg-midpoint-dark px-4 py-2 text-sm font-medium text-white">
          New page
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">URL</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">SEO</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p) => {
              const { score } = scoreContent(p);
              return (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3 text-slate-500">/p/{p.slug}</td>
                  <td className="px-4 py-3">
                    <span className={p.status === "PUBLISHED" ? "text-emerald-600" : "text-slate-400"}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <SeoScoreBadge score={score} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/pages/${p.id}/edit`} className="mr-3 text-midpoint-dark underline">
                      Edit
                    </Link>
                    <form action={deletePage.bind(null, p.id)} className="inline">
                      <button className="text-red-600 underline">Delete</button>
                    </form>
                  </td>
                </tr>
              );
            })}
            {pages.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  No pages yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
