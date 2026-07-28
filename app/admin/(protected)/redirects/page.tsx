import { prisma } from "@/lib/prisma";
import { createRedirect, updateRedirect, deleteRedirect } from "./actions";

export const dynamic = "force-dynamic";

export default async function RedirectsAdminPage() {
  const redirects = await prisma.redirect.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Redirects</h1>
      <p className="mt-1 text-sm text-slate-500">
        Send an old or changed URL to a new one with a proper 3xx redirect, so visitors and search engines land
        somewhere real instead of a 404. Takes effect within about a minute of saving. Especially important for
        any path that changes when this site moves off Webflow onto its final domain — without a redirect, that
        page's search ranking and any inbound links to it are lost.
      </p>

      <form action={createRedirect} className="mt-6 flex flex-wrap items-end gap-3 rounded-xl bg-white p-4 shadow-sm">
        <div>
          <label className="block text-xs font-medium text-slate-500">Old path</label>
          <input
            name="fromPath"
            required
            placeholder="/old-page"
            className="mt-1 w-56 rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500">Redirect to</label>
          <input
            name="toPath"
            required
            placeholder="/new-page or https://…"
            className="mt-1 w-56 rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500">Type</label>
          <select name="statusCode" defaultValue="301" className="mt-1 rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="301">301 — Permanent</option>
            <option value="302">302 — Temporary</option>
            <option value="307">307 — Temporary (preserve method)</option>
            <option value="308">308 — Permanent (preserve method)</option>
          </select>
        </div>
        <button type="submit" className="rounded-full bg-midpoint-dark px-4 py-2 text-sm font-medium text-white">
          Add redirect
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">From</th>
              <th className="px-4 py-3">To</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Hits</th>
              <th className="px-4 py-3">Last hit</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {redirects.map((r) => (
              <tr key={r.id} className="border-t border-slate-100">
                <td className="px-4 py-3 font-mono text-xs">{r.fromPath}</td>
                <td className="px-4 py-3">
                  <form action={updateRedirect.bind(null, r.id)} className="flex flex-wrap items-center gap-2">
                    <input
                      name="toPath"
                      defaultValue={r.toPath}
                      className="w-48 rounded border border-slate-200 px-2 py-1 font-mono text-xs"
                    />
                    <select
                      name="statusCode"
                      defaultValue={String(r.statusCode)}
                      className="rounded border border-slate-200 px-2 py-1 text-xs"
                    >
                      <option value="301">301</option>
                      <option value="302">302</option>
                      <option value="307">307</option>
                      <option value="308">308</option>
                    </select>
                    <button type="submit" className="text-xs font-semibold text-midpoint-dark underline">
                      Save
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-slate-500">{r.statusCode}</td>
                <td className="px-4 py-3 text-slate-500">{r.hitCount}</td>
                <td className="px-4 py-3 text-slate-500">
                  {r.lastHitAt ? new Date(r.lastHitAt).toLocaleDateString() : "Never"}
                </td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteRedirect.bind(null, r.id)}>
                    <button className="text-xs text-red-600 underline">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
            {redirects.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  No redirects set up yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
