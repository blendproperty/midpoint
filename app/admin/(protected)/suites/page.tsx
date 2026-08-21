import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { deleteSuite } from "./actions";

export default async function AdminSuitesPage() {
  await requireAdmin();
  const suites = await prisma.suite.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Suites</h1>
        <div className="flex gap-3">
          <Link
            href="/suites"
            target="_blank"
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm"
          >
            View private preview
          </Link>
          <Link
            href="/admin/suites/new"
            className="rounded-full bg-midpoint-cyan px-4 py-2 text-sm font-semibold text-midpoint-dark"
          >
            New suite
          </Link>
        </div>
      </div>

      <p className="mt-2 text-sm text-neutral-500">
        This preview is only reachable at /suites with the password set in
        SUITES_PREVIEW_PASSWORD, and is not linked from anywhere on the
        public site.
      </p>

      <table className="mt-6 w-full text-sm">
        <thead>
          <tr className="text-left text-neutral-500">
            <th className="py-2">Name</th>
            <th className="py-2">Rate/night</th>
            <th className="py-2">Status</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody>
          {suites.map((suite) => (
            <tr key={suite.id} className="border-t border-neutral-200">
              <td className="py-2">{suite.name}</td>
              <td className="py-2">R{suite.nightlyRate.toLocaleString()}</td>
              <td className="py-2">{suite.status}</td>
              <td className="py-2 text-right">
                <Link href={`/admin/suites/${suite.id}/edit`} className="text-midpoint-cyan">
                  Edit
                </Link>{" "}
                <form action={deleteSuite.bind(null, suite.id)} className="inline">
                  <button type="submit" className="ml-3 text-red-600">
                    Delete
                  </button>
                </form>
              </td>
            </tr>
          ))}
          {suites.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 text-center text-neutral-400">
                No suites yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
