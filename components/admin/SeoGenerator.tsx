"use client";

import { useRef, useState } from "react";
import SeoPreviewCard from "@/components/admin/SeoPreviewCard";

type Preview = { title: string; description: string };

function truncate(value: string, length: number) {
  return value.length <= length ? value : `${value.slice(0, length - 1).trimEnd()}…`;
}

function stripHtml(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function field(form: HTMLFormElement, name: string) {
  const control = form.elements.namedItem(name);
  if (control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement || control instanceof HTMLSelectElement) {
    return control.value.trim();
  }
  return "";
}

function setField(form: HTMLFormElement, name: string, value: string) {
  const control = form.elements.namedItem(name);
  if (control instanceof HTMLInputElement || control instanceof HTMLTextAreaElement) {
    control.value = value;
    control.dispatchEvent(new Event("input", { bubbles: true }));
    control.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

type Props = {
  titleField?: string;
  sourceFields?: string[];
  seoTitleField?: string;
  seoDescriptionField?: string;
  siteName?: string;
  previewDomain?: string;
  previewPath?: string;
};

// Same pattern as the SEO assistant on listings.blendproperty.co.za
// (components/listings/seo-generator.tsx there): reads the surrounding
// <form>'s own fields by name — no per-form ref plumbing needed — writes an
// editable suggestion straight into the SEO title/description inputs, and
// shows a live Google-style result preview. Rule-based, no paid AI service.
export default function SeoGenerator({
  titleField = "title",
  sourceFields = ["contentHtml"],
  seoTitleField = "seoTitle",
  seoDescriptionField = "seoDescription",
  siteName = "Midpoint Midrand",
  previewDomain = "www.mid-point.co.za",
  previewPath = "",
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<Preview>({ title: "", description: "" });

  function form() {
    return rootRef.current?.closest("form") ?? null;
  }

  function generate() {
    const f = form();
    if (!f) return;

    const title = field(f, titleField);
    const source = sourceFields.map((name) => stripHtml(field(f, name))).find(Boolean) || title;

    const withBrand = `${title} | ${siteName}`;
    const generatedTitle = truncate(withBrand.length <= 60 ? withBrand : title, 60);
    const generatedDescription = truncate(source, 155);

    setField(f, seoTitleField, generatedTitle);
    setField(f, seoDescriptionField, generatedDescription);
    setPreview({ title: generatedTitle, description: generatedDescription });
  }

  function reset() {
    const f = form();
    if (!f) return;
    setField(f, seoTitleField, "");
    setField(f, seoDescriptionField, "");
    setPreview({ title: "", description: "" });
  }

  return (
    <div ref={rootRef} className="rounded-2xl border border-[#d4af37]/40 bg-[#fffaf0] p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-950">✨ Automatic SEO assistant</h3>
          <p className="mt-1 text-xs text-slate-600">
            Generates an editable suggestion from the fields above. No paid AI service is used.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={generate}
            className="rounded-full bg-[#d4af37] px-4 py-2 text-xs font-bold text-slate-950"
          >
            Generate SEO
          </button>
        </div>
      </div>

      <SeoPreviewCard title={preview.title} description={preview.description} domain={previewDomain} path={previewPath} />
    </div>
  );
}
