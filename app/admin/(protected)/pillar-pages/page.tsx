import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { scorePillarPage } from "@/lib/seo-score";
import SeoScoreBadge from "@/components/admin/SeoScoreBadge";
import { buildMediaAltByUrl, pillarScoreInput } from "@/lib/pillar-score-data";
import ContentRowActions from "@/components/admin/ContentRowActions";
import { deleteContent, setContentWorkflowStatus } from "../pages/content-actions";

export const dynamic = "force-dynamic";

export default async function PillarPagesAdminPage() {
  const [pillars, media] = await Promise.all([
    prisma.pillarPage.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.media.findMany({ select: { url: true, alt: true } }),
  ]);
  const mediaAltByUrl = buildMediaAltByUrl(media);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pillar pages</h1>
        <Link href="/admin/pillar-pages/new" className="rounded-full bg-midpoint-dark px-4 py-2 text-sm font-medium text-white">
          New pillar page
        </Link>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        Long-form decision guides built to the Midpoint pillar page blueprint (E-E-A-T, technical SEO, AI search).
        The blueprint recommends six: Office Space, Warehouses, Business Parks, Serviced Offices, Doing Business in
        Midrand, and the Midpoint Precinct guide.
      </p>
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
            {pillars.map((p) => {
              const { score } = scorePillarPage(pillarScoreInput(p, mediaAltByUrl));
              return (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3 text-slate-500">/{p.slug}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        p.status === "PUBLISHED"
                          ? "text-emerald-600"
                          : p.status === "REVIEW"
                            ? "text-amber-700"
                            : "text-slate-400"
                      }
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <SeoScoreBadge score={score} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <ContentRowActions
                      editHref={`/admin/pillar-pages/${p.id}/edit`}
                      title={p.title}
                      status={p.status}
                      draftAction={setContentWorkflowStatus.bind(null, "Pillar", p.id, "DRAFT")}
                      reviewAction={setContentWorkflowStatus.bind(null, "Pillar", p.id, "REVIEW")}
                      deleteAction={deleteContent.bind(null, "Pillar", p.id)}
                    />
                  </td>
                </tr>
              );
            })}
            {pillars.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  No pillar pages yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
