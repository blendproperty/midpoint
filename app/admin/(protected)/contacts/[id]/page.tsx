import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updateContactStatus, assignContact, addContactNote } from "../actions";
import type { ContactStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

const STATUS_OPTIONS: ContactStatus[] = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"];

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [contact, users] = await Promise.all([
    prisma.contact.findUnique({
      where: { id },
      include: {
        assignedTo: { select: { id: true, name: true, email: true } },
        notes: { orderBy: { createdAt: "desc" }, include: { author: { select: { name: true, email: true } } } },
        enquiries: { orderBy: { createdAt: "desc" } },
      },
    }),
    prisma.user.findMany({ select: { id: true, name: true, email: true }, orderBy: { email: "asc" } }),
  ]);

  if (!contact) notFound();

  return (
    <div className="max-w-4xl">
      <Link href="/admin/contacts" className="text-sm text-slate-500 hover:underline">
        ← Back to contacts
      </Link>
      <h1 className="mt-2 text-2xl font-semibold">
        {[contact.firstName, contact.lastName].filter(Boolean).join(" ") || contact.email}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        {contact.email}
        {contact.phone ? ` · ${contact.phone}` : ""}
        {contact.source ? ` · via ${contact.source}` : ""}
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <label className="block text-sm font-medium">Status</label>
          <form action={updateContactStatus.bind(null, contact.id)} className="mt-2 flex gap-2">
            <select
              name="status"
              defaultValue={contact.status}
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0) + s.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            <button className="rounded-lg bg-midpoint-dark px-4 py-2 text-sm font-medium text-white">Save</button>
          </form>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-sm">
          <label className="block text-sm font-medium">Assigned to</label>
          <form action={assignContact.bind(null, contact.id)} className="mt-2 flex gap-2">
            <select
              name="assignedToId"
              defaultValue={contact.assignedToId || ""}
              className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name || u.email}
                </option>
              ))}
            </select>
            <button className="rounded-lg bg-midpoint-dark px-4 py-2 text-sm font-medium text-white">Save</button>
          </form>
        </div>
      </div>

      <div className="mt-8 rounded-xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Notes</h2>
        <form action={addContactNote.bind(null, contact.id)} className="mt-3 space-y-2">
          <textarea
            name="body"
            required
            rows={3}
            placeholder="Add a note about this contact…"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <button className="rounded-lg bg-midpoint-dark px-4 py-2 text-sm font-medium text-white">Add note</button>
        </form>
        <div className="mt-5 space-y-4">
          {contact.notes.map((n) => (
            <div key={n.id} className="border-t border-slate-100 pt-3 text-sm">
              <p className="whitespace-pre-wrap text-slate-700">{n.body}</p>
              <p className="mt-1 text-xs text-slate-400">
                {n.author?.name || n.author?.email || "Unknown"} · {n.createdAt.toLocaleString()}
              </p>
            </div>
          ))}
          {contact.notes.length === 0 && <p className="mt-4 text-sm text-slate-400">No notes yet.</p>}
        </div>
      </div>

      <div className="mt-8 rounded-xl bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Enquiry history</h2>
        <div className="mt-3 space-y-4">
          {contact.enquiries.map((e) => (
            <div key={e.id} className="border-t border-slate-100 pt-3 text-sm">
              <p className="font-medium">{e.interest || "General enquiry"}</p>
              {e.message && <p className="mt-1 text-slate-600">{e.message}</p>}
              <p className="mt-1 text-xs text-slate-400">
                {e.sourcePath || "—"} · {e.createdAt.toLocaleString()}
              </p>
            </div>
          ))}
          {contact.enquiries.length === 0 && (
            <p className="mt-4 text-sm text-slate-400">No linked enquiries.</p>
          )}
        </div>
      </div>
    </div>
  );
}
