"use client";

import PageSettingsPanel from "@/components/admin/PageSettingsPanel";

type Props = {
  action: (formData: FormData) => void;
  path: string;
  label: string;
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

export default function PageSeoForm({ action, path, label, defaultValues }: Props) {
  return (
    <form action={action} className="mt-6 max-w-xl space-y-5 rounded-xl bg-white p-6 shadow-sm">
      <input type="hidden" name="path" value={path} />
      <p className="text-sm text-slate-500">
        This static page has no title/content field to generate from — open Page settings to write or generate
        its SEO title, description, Open Graph info, schema markup, and any custom code.
      </p>
      <PageSettingsPanel titleFallback={label} sourceFields={[]} previewPath={path} schemaKind="webpage" defaultValues={defaultValues} />
      <button type="submit" className="rounded-full bg-midpoint-dark px-5 py-2.5 text-sm font-semibold text-white">
        Save
      </button>
    </form>
  );
}
