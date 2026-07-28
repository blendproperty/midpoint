"use client";

type Props = {
  action: (formData: FormData) => void;
  defaultValues?: {
    title?: string;
    slug?: string;
    primaryEntity?: string;
    primaryAudience?: string;
    decisionStage?: string;
    primarySearchIntent?: string;
    primaryConversion?: string;
    heroAnswer?: string;
    heroImage?: string;
    trustStrip?: string;
    contentHtml?: string;
    faqsText?: string;
    expertName?: string;
    expertRole?: string;
    expertBio?: string;
    expertImage?: string;
    reviewOwner?: string;
    lastReviewedAt?: string;
    status?: string;
    seoTitle?: string;
    seoDescription?: string;
    focusKeyword?: string;
  };
  submitLabel?: string;
};

export default function PillarPageForm({ action, defaultValues, submitLabel = "Save" }: Props) {
  return (
    <form action={action} className="mt-6 max-w-3xl space-y-8">
      <div className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Strategy</h2>
        <div>
          <label className="block text-sm font-medium">Title (H1)</label>
          <input name="title" defaultValue={defaultValues?.title} required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium">Slug (leave blank to auto-generate). Page will live at /&lt;slug&gt;</label>
          <input name="slug" defaultValue={defaultValues?.slug} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Primary entity</label>
            <input name="primaryEntity" defaultValue={defaultValues?.primaryEntity} placeholder="e.g. Office space" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium">Primary audience</label>
            <input name="primaryAudience" defaultValue={defaultValues?.primaryAudience} placeholder="e.g. Tenant rep, business owner" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Decision stage</label>
            <input name="decisionStage" defaultValue={defaultValues?.decisionStage} placeholder="e.g. Comparing options" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium">Primary search intent</label>
            <input name="primarySearchIntent" defaultValue={defaultValues?.primarySearchIntent} placeholder="e.g. Commercial investigation" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Primary conversion</label>
          <input name="primaryConversion" defaultValue={defaultValues?.primaryConversion} placeholder="e.g. View office listings / book a tour" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        </div>
      </div>

      <div className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Hero</h2>
        <div>
          <label className="block text-sm font-medium">Hero image URL</label>
          <input name="heroImage" defaultValue={defaultValues?.heroImage} placeholder="Paste a URL from Media" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium">Hero direct answer (40–80 words)</label>
          <textarea name="heroAnswer" defaultValue={defaultValues?.heroAnswer} rows={3} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium">Trust strip (one item per line)</label>
          <textarea
            name="trustStrip"
            defaultValue={defaultValues?.trustStrip}
            rows={3}
            placeholder={"Named area specialist\nVerified live listings\n15+ years local market knowledge"}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Content</h2>
        <div>
          <label className="block text-sm font-medium">Main content (HTML) — educational sections, comparisons, evidence, process</label>
          <textarea name="contentHtml" defaultValue={defaultValues?.contentHtml} rows={20} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs" />
        </div>
        <div>
          <label className="block text-sm font-medium">
            FAQs (10–18 recommended). One block per FAQ, format "Question :: Answer", separated by a blank line.
          </label>
          <textarea
            name="faqsText"
            defaultValue={defaultValues?.faqsText}
            rows={10}
            placeholder={"How much does office space cost to rent in Midrand? :: Answer here...\n\nWhich parts of Midrand are best for office space? :: Answer here..."}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs"
          />
        </div>
      </div>

      <div className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Expert / E-E-A-T</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Expert name</label>
            <input name="expertName" defaultValue={defaultValues?.expertName} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium">Expert role</label>
            <input name="expertRole" defaultValue={defaultValues?.expertRole} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Expert bio / relevant experience</label>
          <textarea name="expertBio" defaultValue={defaultValues?.expertBio} rows={3} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium">Expert photo URL</label>
          <input name="expertImage" defaultValue={defaultValues?.expertImage} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Review owner</label>
            <input name="reviewOwner" defaultValue={defaultValues?.reviewOwner} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium">Last reviewed date</label>
            <input type="date" name="lastReviewedAt" defaultValue={defaultValues?.lastReviewedAt} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
        </div>
      </div>

      <div className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">SEO</h2>
        <div>
          <label className="block text-sm font-medium">Focus keyword</label>
          <input name="focusKeyword" defaultValue={defaultValues?.focusKeyword} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
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
      </div>

      <button type="submit" className="rounded-full bg-midpoint-dark px-6 py-3 text-sm font-semibold text-white">
        {submitLabel}
      </button>
    </form>
  );
}
