"use client";

import { useRef } from "react";
import { generateSeoTitle } from "@/lib/seo-generate";

type Props = {
  action: (formData: FormData) => void;
  path: string;
  label: string;
  defaultValues?: { seoTitle?: string; seoDescription?: string };
};

export default function PageSeoForm({ action, path, label, defaultValues }: Props) {
  const titleRef = useRef<HTMLInputElement>(null);

  function handleGenerate() {
    if (titleRef.current) {
      titleRef.current.value = generateSeoTitle(label, "Midpoint Midrand");
    }
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
          ref={titleRef}
          name="seoTitle"
          defaultValue={defaultValues?.seoTitle}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">SEO description</label>
        <textarea
          name="seoDescription"
          defaultValue={defaultValues?.seoDescription}
          rows={3}
          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </div>
      <button type="submit" className="rounded-full bg-midpoint-dark px-5 py-2.5 text-sm font-semibold text-white">
        Save
      </button>
    </form>
  );
}
