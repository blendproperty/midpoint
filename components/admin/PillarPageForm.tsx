"use client";

import RichTextEditor from "@/components/admin/RichTextEditor";
import MediaPicker from "@/components/admin/MediaPicker";
import PageSettingsPanel from "@/components/admin/PageSettingsPanel";

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
    relatedSector?: string;
    listingsHeading?: string;
    listingsIntro?: string;
    showReadyToMove?: boolean;
    featuresText?: string;
    considerationsText?: string;
    exploreLinksText?: string;
    contentHtml?: string;
    faqsText?: string;
    faqsHeading?: string;
    ctaHeading?: string;
    ctaText?: string;
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

export default function PillarPageForm({ action, defaultValues, submitLabel = "Save" }: Props) {
  return (
    <form action={action} className="mt-6 max-w-3xl space-y-8">
      <div className="flex justify-end">
        <PageSettingsPanel
          titleField="title"
          titleFallback={defaultValues?.title}
          sourceFields={["heroAnswer", "contentHtml"]}
          previewPath={defaultValues?.slug ? `/${defaultValues.slug}` : "/…"}
          schemaKind="pillar"
          defaultValues={defaultValues}
        />
      </div>
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
        <MediaPicker name="heroImage" label="Hero image" defaultValue={defaultValues?.heroImage} />
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
        <h2 className="text-lg font-semibold">Layout blocks</h2>
        <p className="text-xs text-slate-400">
          These build the comprehensive page sections shown on the live site — a feature grid, a considerations
          section, live listings pulled straight from Vacancies, and explore-more links. Leave any of them blank to
          skip that section entirely.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Related sector (drives live listings below)</label>
            <select name="relatedSector" defaultValue={defaultValues?.relatedSector || ""} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <option value="">None — no live listings section</option>
              <option value="OFFICE">Office</option>
              <option value="WAREHOUSE">Warehouse</option>
              <option value="SERVICED_OFFICE">Serviced office</option>
            </select>
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" name="showReadyToMove" defaultChecked={defaultValues?.showReadyToMove} />
              Show &quot;Ready to move in?&quot; banner
            </label>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Listings section heading</label>
            <input name="listingsHeading" defaultValue={defaultValues?.listingsHeading} placeholder="Current availability at Midpoint" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium">Listings section intro</label>
            <input name="listingsIntro" defaultValue={defaultValues?.listingsIntro} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">
            Feature highlights (image + heading + text blocks). One block per feature, format
            &quot;Heading :: Text :: Image URL&quot;, separated by a blank line. Copy image URLs from the Media
            library.
          </label>
          <textarea
            name="featuresText"
            defaultValue={defaultValues?.featuresText}
            rows={8}
            placeholder={"Flexible office environments. :: Office suites vary in size and configuration... :: https://.../image.jpg"}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Considerations (what to weigh up). One block per item, format &quot;Heading :: Text&quot;, separated by a
            blank line.
          </label>
          <textarea
            name="considerationsText"
            defaultValue={defaultValues?.considerationsText}
            rows={8}
            placeholder={"Staff access and commute :: Midpoint sits directly on the N1..."}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Explore more links. One per line, format &quot;Label :: /href&quot;.
          </label>
          <textarea
            name="exploreLinksText"
            defaultValue={defaultValues?.exploreLinksText}
            rows={4}
            placeholder={"Warehouses to rent :: /warehouses\nAmenities & lifestyle :: /amenities"}
            className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 font-mono text-xs"
          />
        </div>
      </div>

      <div className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Content</h2>
        <div>
          <label className="block text-sm font-medium">Main content — long-form educational sections, comparisons, evidence, process</label>
          <RichTextEditor name="contentHtml" defaultValue={defaultValues?.contentHtml} height={520} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">FAQs section heading</label>
            <input name="faqsHeading" defaultValue={defaultValues?.faqsHeading} placeholder="Frequently asked questions" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
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
        <h2 className="text-lg font-semibold">Call to action</h2>
        <div>
          <label className="block text-sm font-medium">CTA heading</label>
          <input name="ctaHeading" defaultValue={defaultValues?.ctaHeading} placeholder="Talk to the leasing team" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium">CTA text</label>
          <textarea name="ctaText" defaultValue={defaultValues?.ctaText} rows={2} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
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
        <MediaPicker name="expertImage" label="Expert photo" defaultValue={defaultValues?.expertImage} />
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
        <h2 className="text-lg font-semibold">Other</h2>
        <div>
          <label className="block text-sm font-medium">Focus keyword</label>
          <input name="focusKeyword" defaultValue={defaultValues?.focusKeyword} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium">Status</label>
          <select name="status" defaultValue={defaultValues?.status || "DRAFT"} className="mt-1 w-full max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>
      </div>

      <button type="submit" className="rounded-full bg-midpoint-dark px-6 py-3 text-sm font-semibold text-white">
        {submitLabel}
      </button>
    </form>
  );
}
