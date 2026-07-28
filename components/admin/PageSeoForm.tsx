"use client";

import PageSettingsPanel from "@/components/admin/PageSettingsPanel";

type Props = {
  action: (formData: FormData) => void;
  path: string;
  label: string;
  content?: string;
  defaultValues?: {
    seoTitle?: string;
    seoDescription?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    noIndex?: boolean;
    canonicalUrl?: string;
    schemaJson?: string;
    headCode?: string;
    bodyCode?: string;
  };
};

export default function PageSeoForm({ action, path, label, content, defaultValues }: Props) {
  return (
    <form action={action} className="mt-6 max-w-xl space-y-5 rounded-xl bg-white p-6 shadow-sm">
      <input type="hidden" name="path" value={path} />
      {/* This static page's body lives in code, not the database — this hidden
          field carries a maintained plain-text mirror of its real copy so the
          SEO description and JSON-LD "Generate" buttons in Page settings can
          read actual page content instead of just the page label. */}
      <input type="hidden" name="pageContentSource" value={content || ""} readOnly />
      <p className="text-sm text-slate-500">
        This is a static (hand-coded) page, so there&apos;s no content editor here — but Page settings below now
        reads this page&apos;s actual copy to generate its SEO description and schema markup, not just its title.
      </p>
      <PageSettingsPanel
        titleFallback={label}
        sourceFields={["pageContentSource"]}
        previewPath={path}
        schemaKind="webpage"
        defaultValues={defaultValues}
      />
      <button type="submit" className="rounded-full bg-midpoint-dark px-5 py-2.5 text-sm font-semibold text-white">
        Save
      </button>
    </form>
  );
}
