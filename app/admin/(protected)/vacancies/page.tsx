import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteVacancy, syncVacanciesNow } from "./actions";
import type { VacancySyncResult } from "@/lib/listings-sync";

export const dynamic = "force-dynamic";

const SECTOR_LABEL: Record<string, string> = {
  WAREHOUSE: "Warehouse",
  OFFICE: "Office",
  SERVICED_OFFICE: "Serviced office",
};

export default async function VacanciesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ synced?: string; created?: string; updated?: string; deprecated?: string; skipped?: string; error?: string }>;
}) {
  const sp = await searchParams;
  const [vacancies, settings] = await Promise.all([
    prisma.vacancy.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
    prisma.siteSetting.findUnique({ where: { id: "global" }, select: { lastVacancySync: true } }),
  ]);
  const lastSync = settings?.lastVacancySync as unknown as VacancySyncResult | null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Vacancies</h1>
        <div className="flex gap-3">
          <form action={syncVacanciesNow}>
            <button className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700">
              Sync from listings.blendproperty.co.za
            </button>
          </form>
          <Link href="/admin/vacancies/new" className="rounded-full bg-midpoint-dark px-4 py-2 text-sm font-medium text-white">
            New vacancy
          </Link>
        </div>
      </div>

      {sp.synced && (
        <div className={`mt-4 rounded-xl p-4 text-sm ${sp.error ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
          {sp.error ? (
            <p>Sync failed: {sp.error}</p>
          ) : (
            <p>
              Synced from listings.blendproperty.co.za — {sp.created} created, {sp.updated} updated
              {Number(sp.deprecated) > 0 ? `, ${sp.deprecated} no longer listed (set to Draft)` : ""}
              {Number(sp.skipped) > 0 ? `, ${sp.skipped} with an unrecognised sector (defaulted to Office — see below).` : "."}
            </p>
          )}
        </div>
      )}

      {lastSync && lastSync.skipped?.length > 0 && (
        <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
          <h2 className="font-semibold text-amber-800">
            Unrecognised sectors from the last sync ({new Date(lastSync.ranAt).toLocaleString()})
          </h2>
          <p className="mt-1 text-xs text-amber-700">
            These listings came back with a marketSector value the sync doesn't know how to map, so they were
            saved as Office by default. Fix the mapping in lib/listings-sync.ts once you see the real value below,
            or just correct the sector by hand in each row for now.
          </p>
          <ul className="mt-3 space-y-1">
            {lastSync.skipped.map((s) => (
              <li key={s.id}>
                <span className="font-medium">{s.title}:</span> {s.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-500">
            <tr>
              <th className="px-4 py-3">Building</th>
              <th className="px-4 py-3">Sector</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {vacancies.map((v) => (
              <tr key={v.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium">{v.building}</td>
                <td className="px-4 py-3">{SECTOR_LABEL[v.sector]}</td>
                <td className="px-4 py-3">{v.sizeSqm.toLocaleString()} m²</td>
                <td className="px-4 py-3">
                  <span className={v.status === "PUBLISHED" ? "text-emerald-600" : "text-slate-400"}>{v.status}</span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-400">
                  {v.externalId ? "Synced" : "Manual"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/vacancies/${v.id}/edit`} className="mr-3 text-midpoint-dark underline">
                    Edit
                  </Link>
                  <form action={deleteVacancy.bind(null, v.id)} className="inline">
                    <button className="text-red-600 underline">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {vacancies.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  No vacancies yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
