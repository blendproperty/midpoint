import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { ContactStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const STATUS_TABS: { value: ContactStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "QUALIFIED", label: "Qualified" },
  { value: "WON", label: "Won" },
  { value: "LOST", label: "Lost" },
];

const STATUS_STYLES: Record<ContactStatus, string> = {
  NEW: "bg-blue-100 text-blue-700",
  CONTACTED: "bg-amber-100 text-amber-700",
  QUALIFIED: "bg-purple-100 text-purple-700",
  WON: "bg-emerald-100 text-emerald-700",
  LOST: "bg-slate-200 text-slate-600",
};

function StatusBadge({ status }: { status: ContactStatus }) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

export default async function ContactsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const params = await searchParams;
  const statusFilter = (params.status || "ALL") as ContactStatus | "ALL";
  const q = params.q?.trim() || "";

  const contacts = await prisma.contact.findMany({
    where: {
      ...(statusFilter !== "ALL" ? { status: statusFilter } : {}),
      ...(q
        ? {
            OR: [
              { firstName: { contains: q, mode: "insensitive" as const } },
              { lastName: { contains: q, mode: "insensitive" as const } },
              { email: { contains: q, mode: "insensitive" as const } },
              { phone: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    },
    include: {
      assignedTo: { select: { name: true, email: true } },
      _count: { select: { enquiries: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: 200,
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold">Contacts</h1>
      <p className="mt-1 text-sm text-slate-500">
        Every person who has enquired, deduplicated by email, with status and follow-up tracking.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => (
            <Link
              key={tab.value}
              href={`/admin/contacts?status=${tab.value}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${
                statusFilter === tab.value ? "bg-midpoint-dark text-white" : "bg-white text-slate-600 shadow-sm"
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
        <form className="flex gap-2">
          <input type="hidden" name="status" value={statusFilter} />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search name, email, phone…"
            className="w-64 rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <button className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white">Search</button>
        </form>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-100 text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Assigned to</th>
              <th className="px-4 py-3">Enquiries</th>
              <th className="px-4 py-3">Last activity</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/admin/contacts/${c.id}`} className="hover:underline">
                    {[c.firstName, c.lastName].filter(Boolean).join(" ") || "—"}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-500">
                  <div>{c.email}</div>
                  {c.phone && <div>{c.phone}</div>}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={c.status} />
                </td>
                <td className="px-4 py-3 text-slate-500">{c.assignedTo?.name || c.assignedTo?.email || "Unassigned"}</td>
                <td className="px-4 py-3 text-slate-500">{c._count.enquiries}</td>
                <td className="px-4 py-3 text-slate-500">{c.updatedAt.toLocaleDateString()}</td>
              </tr>
            ))}
            {contacts.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                  No contacts match this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
