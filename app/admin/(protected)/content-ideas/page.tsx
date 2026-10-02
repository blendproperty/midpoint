import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { IDEA_FORMATS, IDEA_PRIORITIES, IDEA_STATUSES } from "@/lib/content-ideas";
import { saveContentIdea, deleteContentIdea } from "./actions";

export const dynamic = "force-dynamic";
const input = "mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm";
const label = (value: string) => ({ idea: "New idea", ready: "Ready to write", page: "Website page", guide: "Leasing guide", faq: "FAQ" } as Record<string, string>)[value] || value[0].toUpperCase() + value.slice(1);

export default async function ContentIdeasPage({ searchParams }: { searchParams: Promise<{ edit?: string; q?: string }> }) {
  await requireAdmin();
  const { edit, q = "" } = await searchParams;
  const ideas = await prisma.contentIdea.findMany({ where: q ? { OR: [{ title: { contains: q, mode: "insensitive" } }, { keyword: { contains: q, mode: "insensitive" } }] } : {}, orderBy: { updatedAt: "desc" } });
  const idea = edit ? await prisma.contentIdea.findUnique({ where: { id: edit } }) : null;
  if (edit && !idea) notFound();
  return <div>
    <h1 className="text-2xl font-semibold">Content ideas</h1>
    <p className="mt-2 text-sm text-slate-600">Plan useful Midpoint content before writing a page or article. Ideas stay private to signed-in editors. Changing progress never publishes a website page.</p>
    <form className="my-5 flex gap-2"><label className="flex-1 text-sm">Search ideas<input name="q" defaultValue={q} className={input} /></label><button className="self-end rounded-full bg-midpoint-dark px-4 py-2 text-white">Search</button></form>
    <div className="grid gap-6 xl:grid-cols-2">
      <section className="space-y-3" aria-label="Saved ideas">
        {ideas.length ? ideas.map(row => <article key={row.id} className="rounded-xl border bg-white p-4">
          <Link href={`/admin/content-ideas?edit=${row.id}`} className="font-semibold underline">{row.title}</Link>
          <p className="mt-1 text-sm text-slate-600">{label(row.status)} · {label(row.format)} · {label(row.priority)} priority{row.targetDate ? ` · ${row.targetDate.toISOString().slice(0, 10)}` : ""}</p>
          {row.keyword && <p className="mt-2 text-sm">Search phrase: {row.keyword}</p>}
          {row.publishedUrl && <a href={row.publishedUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm underline">Finished content</a>}
        </article>) : <p className="rounded-xl bg-white p-5 text-slate-600">No ideas found. Add your first customer question or leasing topic.</p>}
      </section>
      <section className="rounded-xl border bg-white p-5">
        <h2 className="text-lg font-semibold">{idea ? "Edit idea" : "New idea"}</h2>
        {idea && <Link href="/admin/content-ideas" className="text-sm underline">Add another idea</Link>}
        <form key={idea?.id || "new"} action={saveContentIdea} className="mt-4 space-y-4">
          <input type="hidden" name="id" value={idea?.id || ""} />
          <label className="block text-sm">Content idea<input name="title" required maxLength={200} defaultValue={idea?.title} className={input} /></label>
          <label className="block text-sm">Target search phrase<input name="keyword" defaultValue={idea?.keyword || ""} className={input} /></label>
          <label className="block text-sm">Who is it for?<input name="audience" defaultValue={idea?.audience || ""} className={input} /></label>
          <label className="block text-sm">Idea and writing brief<textarea name="brief" aria-label="Idea and writing brief" rows={5} defaultValue={idea?.brief || ""} className={input} /></label>
          <label className="block text-sm">Research and inspiration<textarea name="research" aria-label="Research and inspiration" rows={4} defaultValue={idea?.research || ""} className={input} /></label>
          <p className="text-xs text-slate-500">Save customer questions, source links and Search Console findings. Confirm facts; do not assume search volumes or rankings.</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block text-sm">Progress<select name="status" defaultValue={idea?.status || "idea"} className={input}>{IDEA_STATUSES.map(v => <option key={v} value={v}>{label(v)}</option>)}</select></label>
            <label className="block text-sm">Format<select name="format" aria-label="Format" defaultValue={idea?.format || "guide"} className={input}>{IDEA_FORMATS.map(v => <option key={v} value={v}>{label(v)}</option>)}</select></label>
            <label className="block text-sm">Priority<select name="priority" aria-label="Priority" defaultValue={idea?.priority || "normal"} className={input}>{IDEA_PRIORITIES.map(v => <option key={v} value={v}>{label(v)}</option>)}</select></label>
          </div>
          <label className="block text-sm">Target publish date<input type="date" name="targetDate" defaultValue={idea?.targetDate?.toISOString().slice(0, 10)} className={input} /></label>
          <label className="block text-sm">Finished content link<input type="url" name="publishedUrl" defaultValue={idea?.publishedUrl || ""} placeholder="https://www.mid-point.co.za/..." className={input} /></label>
          <button className="rounded-full bg-midpoint-dark px-5 py-2 text-white">Save idea</button>
        </form>
        {idea && <form action={deleteContentIdea} className="mt-5"><input type="hidden" name="id" value={idea.id} /><button className="text-sm text-red-700 underline">Delete idea</button></form>}
      </section>
    </div>
  </div>;
}
