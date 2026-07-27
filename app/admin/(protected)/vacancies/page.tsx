import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteVacancy } from "./actions";

export const dynamic = "force-dynamic";

const SECTOR_LABEL: Record<string, string> = {
  WAREHOUSE: "Warehouse",
  OFFICE: "Office",
  SERVICED_OFFICE: "Serviced office",
};

export default async function VacanciesAdminPage() {
  const vacancies = await prisma.vacancy.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Vacancies</h1>
        <Link href="/admin/vacancies/new" className="rounded-full bg-midpoint-dark px-4 py-2 text-sm font-medium text-white">
          New vacancy
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-500">
            <tr>
              <th className="px-4 py-3">Building</th>
              <th className="px-4 py-3">Sector</th>
              <th className="px-4 py-3">Size</th>
              <th className="px-4 py-3">Status</th>
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
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
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
