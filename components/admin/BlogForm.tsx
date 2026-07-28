"use client";

import { useRef } from "react";
import { generateSeoTitle, generateSeoDescription } from "@/lib/seo-generate";

type Props = {
  action: (formData: FormData) => void;
  defaultValues?: {
    title?: string;
    slug?: string;
    excerpt?: string;
    contentHtml?: string;
    coverImage?: string;
    status?: string;
    seoTitle?: string;
    seoDescription?: string;
    focusKeyword?: string;
  };
  submitLabel?: string;
};

export default function BlogForm({ action, defaultValues, submitLabel = "Save" }: Props) {
  const titleRef = useRef<HTMLInputElement>(null);
  const excerptRef = useRef<HTMLTextAreaElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const seoTitleRef = useRef<HTMLInputElement>(null);
  const seoDescRef = useRef<HTMLTextAreaElement>(null);

  function handleGenerate() {
    const title = titleRef.current?.value || "";
    const source = excerptRef.current?.value || contentRef.current?.value || title;
    if (seoTitleRef.current) seoTitleRef.current.value = generateSeoTitle(title, "Midpoint Midrand");
    if (seoDescRef.current) seoDescRef.current.value = generateSeoDescription(source);
  }

  return (
    <form action={action} className="mt-6 max-w-2xl space-y-5 rounded-xl bg-white p-6 shadow-sm">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input ref={titleRef} name="title" defaultValue={defaultValues?.title} required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium">Slug (leave blank to auto-generate from title)</label>
        <input name="slug" defaultValue={defaultValues?.slug} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium">Excerpt</label>
        <textarea ref={excerptRef} name="excerpt" defaultValue={defaultValues?.excerpt} rows={2} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium">Cover image URL</label>
        <input name="coverImage" defaultValue={defaultValues?.coverImage} placeholder="Paste a URL from Media" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium">Content (HTML)</label>
        <textarea ref={contentRef} name="contentHtml" defaultValue={defaultValues?.contentHtml} rows={12} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs" />
      </div>
      <div>
        <label className="block text-sm font-medium">Focus keyword (optional)</label>
        <input name="focusKeyword" defaultValue={defaultValues?.focusKeyword} placeholder="e.g. warehouse space Midrand" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        <p className="mt-1 text-xs text-slate-400">Used by the SEO score below to check whether your target phrase appears in the right places.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium">SEO title</label>
            <button type="button" onClick={handleGenerate} className="text-xs font-semibold text-midpoint-dark underline">
              Generate
            </button>
          </div>
          <input ref={seoTitleRef} name="seoTitle" defaultValue={defaultValues?.seoTitle} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
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
        <textarea ref={seoDescRef} name="seoDescription" defaultValue={defaultValues?.seoDescription} rows={2} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
      </div>
      <button type="submit" className="rounded-full bg-midpoint-dark px-5 py-2.5 text-sm font-semibold text-white">
        {submitLabel}
      </button>
    </form>
  );
}
