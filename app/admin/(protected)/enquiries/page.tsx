import { prisma } from "@/lib/prisma";
import { toggleEnquiryHandled } from "./actions";

export const dynamic = "force-dynamic";

export default async function EnquiriesAdminPage() {
  const enquiries = await prisma.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 200 });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Enquiries</h1>
      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Interest</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Page</th>
              <th className="px-4 py-3">Received</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((e) => (
              <tr key={e.id} className="border-t border-slate-100 align-top">
                <td className="px-4 py-3 font-medium">{[e.firstName, e.lastName].filter(Boolean).join(" ") || "—"}</td>
                <td className="px-4 py-3 text-slate-500">
                  <div>{e.email}</div>
                  {e.phone && <div>{e.phone}</div>}
                </td>
                <td className="px-4 py-3">{e.interest || "—"}</td>
                <td className="max-w-xs px-4 py-3 text-slate-500">{e.message}</td>
                <td className="px-4 py-3 text-slate-500">{e.sourcePath || "—"}</td>
                <td className="px-4 py-3 text-slate-500">{e.createdAt.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <form action={toggleEnquiryHandled.bind(null, e.id, !e.handled)}>
                    <button
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        e.handled ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {e.handled ? "Handled" : "Mark handled"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {enquiries.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-400">
                  No enquiries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
