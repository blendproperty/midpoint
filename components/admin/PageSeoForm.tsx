"use client";

import { useState } from "react";
import { generateSeoTitle } from "@/lib/seo-generate";
import SeoPreviewCard from "@/components/admin/SeoPreviewCard";

type Props = {
  action: (formData: FormData) => void;
  path: string;
  label: string;
  defaultValues?: { seoTitle?: string; seoDescription?: string };
};

export default function PageSeoForm({ action, path, label, defaultValues }: Props) {
  const [seoTitle, setSeoTitle] = useState(defaultValues?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(defaultValues?.seoDescription || "");

  function handleGenerate() {
    setSeoTitle(generateSeoTitle(label, "Midpoint Midrand"));
  }

  return (
    <form action={action} className="mt-6 max-w-xl space-y-5 rounded-xl bg-white p-6 shadow-sm">
      <input type="hidden" name="path" value={path} />
      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium">SEO title</label>
          <button type="button" onClick={handleGenerate} className="text-xs font-semibold text-midpoint-dark underline">
            Generate
          </button>
        </div>
        <input
          name="seoTitle"
          value={seoTitle}
          onChange={(e) => setSeoTitle(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">SEO description</label>
        <textarea
          name="seoDescription"
          value={seoDescription}
          onChange={(e) => setSeoDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </div>

      <SeoPreviewCard title={seoTitle} description={seoDescription} path={path} />

      <button type="submit" className="rounded-full bg-midpoint-dark px-5 py-2.5 text-sm font-semibold text-white">
        Save
      </button>
    </form>
  );
}
