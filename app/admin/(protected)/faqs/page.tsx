import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteFaq } from "./actions";

export const dynamic = "force-dynamic";

export default async function FaqsAdminPage() {
  const faqs = await prisma.faq.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">FAQs</h1>
        <Link href="/admin/faqs/new" className="rounded-full bg-midpoint-dark px-4 py-2 text-sm font-medium text-white">
          New FAQ
        </Link>
      </div>
      <div className="mt-6 space-y-3">
        {faqs.map((f) => (
          <div key={f.id} className="rounded-xl bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <p className="font-medium">{f.question}</p>
              <div className="shrink-0 whitespace-nowrap text-sm">
                <Link href={`/admin/faqs/${f.id}/edit`} className="mr-3 text-midpoint-dark underline">
                  Edit
                </Link>
                <form action={deleteFaq.bind(null, f.id)} className="inline">
                  <button className="text-red-600 underline">Delete</button>
                </form>
              </div>
            </div>
            <p className="mt-2 line-clamp-2 text-sm text-slate-500">{f.answer}</p>
          </div>
        ))}
        {faqs.length === 0 && <p className="text-slate-400">No FAQs yet.</p>}
      </div>
    </div>
  );
}
