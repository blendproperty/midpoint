"use client";

import RichTextEditor from "@/components/admin/RichTextEditor";
import PageSettingsPanel from "@/components/admin/PageSettingsPanel";

type Props = {
  action: (formData: FormData) => void;
  defaultValues?: {
    title?: string;
    slug?: string;
    contentHtml?: string;
    status?: string;
    passwordProtected?: boolean;
    hasAccessPassword?: boolean;
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
  submitLabel?: string;
};

export default function PageForm({ action, defaultValues, submitLabel = "Save" }: Props) {
  return (
    <form action={action} className="mt-6 max-w-2xl space-y-5">
      <div className="flex justify-end">
        <PageSettingsPanel
          titleField="title"
          titleFallback={defaultValues?.title}
          sourceFields={["contentHtml"]}
          previewPath={defaultValues?.slug ? `/p/${defaultValues.slug}` : "/p/…"}
          schemaKind="webpage"
          defaultValues={defaultValues}
        />
      </div>
      <div className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
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
          <label className="block text-sm font-medium">Content</label>
          <RichTextEditor name="contentHtml" defaultValue={defaultValues?.contentHtml} height={480} />
        </div>
        <div>
          <label className="block text-sm font-medium">Focus keyword (optional)</label>
          <input name="focusKeyword" defaultValue={defaultValues?.focusKeyword} placeholder="e.g. office space Midrand" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
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
      </div>

      <div className="space-y-4 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Access control</h2>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" name="passwordProtected" defaultChecked={defaultValues?.passwordProtected} />
          Require a password to view this page
        </label>
        <div>
          <label className="block text-sm font-medium">
            {defaultValues?.hasAccessPassword ? "Change password" : "Set password"}
          </label>
          <input
            type="text"
            name="accessPassword"
            placeholder={defaultValues?.hasAccessPassword ? "Leave blank to keep the current password" : "Enter a password"}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-slate-400">
            Visitors will need to enter this password before they can view the page. Shown as plain text here so you
            can copy and share it, but stored securely (hashed) in the database. This page is automatically excluded
            from search engines while protected.
          </p>
        </div>
      </div>

      <button type="submit" className="rounded-full bg-midpoint-dark px-5 py-2.5 text-sm font-semibold text-white">
        {submitLabel}
      </button>
    </form>
  );
}
