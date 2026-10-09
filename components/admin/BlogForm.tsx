"use client";

import RichTextEditor from "@/components/admin/RichTextEditor";
import MediaPicker from "@/components/admin/MediaPicker";
import PageSettingsPanel from "@/components/admin/PageSettingsPanel";

type Props = {
  action: (formData: FormData) => void;
  defaultValues?: {
    title?: string;
    slug?: string;
    excerpt?: string;
    contentHtml?: string;
    coverImage?: string;
    status?: string;
    pillarPageId?: string;
    seoTitle?: string;
    seoDescription?: string;
    focusKeyword?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    noIndex?: boolean;
    canonicalUrl?: string;
    schemaJson?: string;
    headCode?: string;
    bodyCode?: string;
  };
  pillars: { id: string; title: string }[];
  submitLabel?: string;
};

export default function BlogForm({ action, defaultValues, pillars, submitLabel = "Save" }: Props) {
  return (
    <form action={action} className="mt-6 max-w-2xl space-y-5 rounded-xl bg-white p-6 shadow-sm">
      <div className="flex justify-end">
        <PageSettingsPanel
          titleField="title"
          titleFallback={defaultValues?.title}
          sourceFields={["excerpt", "contentHtml"]}
          previewPath={defaultValues?.slug ? `/blog/${defaultValues.slug}` : "/blog/…"}
          schemaKind="article"
          defaultValues={defaultValues}
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input name="title" defaultValue={defaultValues?.title} required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium">Slug (leave blank to auto-generate from title)</label>
        <input name="slug" defaultValue={defaultValues?.slug} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium">Excerpt</label>
        <textarea name="excerpt" defaultValue={defaultValues?.excerpt} rows={2} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </div>
      <div>
        <label htmlFor="pillarPageId" className="block text-sm font-medium">Pillar guide</label>
        <select id="pillarPageId" name="pillarPageId" defaultValue={defaultValues?.pillarPageId || ""} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="">No pillar guide</option>
          {pillars.map((pillar) => <option key={pillar.id} value={pillar.id}>{pillar.title}</option>)}
        </select>
        <p className="mt-1 text-xs text-slate-500">Assign the main guide this article supports. Published articles appear on that guide and link back to it.</p>
      </div>
      <MediaPicker name="coverImage" label="Cover image" defaultValue={defaultValues?.coverImage} />
      <div>
        <label className="block text-sm font-medium">Content</label>
        <RichTextEditor name="contentHtml" defaultValue={defaultValues?.contentHtml} />
      </div>
      <div>
        <label className="block text-sm font-medium">Focus keyword (optional)</label>
        <input name="focusKeyword" defaultValue={defaultValues?.focusKeyword} placeholder="e.g. warehouse space Midrand" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <p className="mt-1 text-xs text-slate-400">Used by the SEO score below to check whether your target phrase appears in the right places.</p>
      </div>
      <div>
        <label className="block text-sm font-medium">Status</label>
        <select name="status" defaultValue={defaultValues?.status || "DRAFT"} className="mt-1 w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm">
          <option value="DRAFT">Draft</option>
          <option value="REVIEW">Ready for review</option>
          <option value="PUBLISHED">Published</option>
        </select>
      </div>
      <button type="submit" className="rounded-full bg-midpoint-dark px-5 py-2.5 text-sm font-semibold text-white">
        {submitLabel}
      </button>
    </form>
  );
}
