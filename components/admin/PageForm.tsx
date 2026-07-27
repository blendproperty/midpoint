"use client";

type Props = {
  action: (formData: FormData) => void;
  defaultValues?: {
    title?: string;
    slug?: string;
    contentHtml?: string;
    status?: string;
    seoTitle?: string;
    seoDescription?: string;
  };
  submitLabel?: string;
};

export default function PageForm({ action, defaultValues, submitLabel = "Save" }: Props) {
  return (
    <form action={action} className="mt-6 max-w-2xl space-y-5 rounded-xl bg-white p-6 shadow-sm">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input name="title" defaultValue={defaultValues?.title} required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium">
          Slug (leave blank to auto-generate from title). Page will live at /p/&lt;slug&gt;
        </label>
        <input name="slug" defaultValue={defaultValues?.slug} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium">Content (HTML)</label>
        <textarea name="contentHtml" defaultValue={defaultValues?.contentHtml} rows={14} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">SEO title</label>
          <input name="seoTitle" defaultValue={defaultValues?.seoTitle} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select name="status" defaultValue={defaultValues?.status || "DRAFT"} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium">SEO description</label>
        <textarea name="seoDescription" defaultValue={defaultValues?.seoDescription} rows={2} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </div>
      <button type="submit" className="rounded-full bg-midpoint-dark px-5 py-2.5 text-sm font-semibold text-white">
        {submitLabel}
      </button>
    </form>
  );
}
