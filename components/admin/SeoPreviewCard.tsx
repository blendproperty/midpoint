type Props = {
  title: string;
  description: string;
  domain?: string;
  path?: string;
};

// Visual match for the "Google preview" card used in listings.blendproperty.co.za's
// listing SEO assistant — blue result-link title, green breadcrumb-style URL, gray
// snippet text.
export default function SeoPreviewCard({ title, description, domain = "www.mid-point.co.za", path = "" }: Props) {
  return (
    <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">Google preview</p>
      <p className="mt-2 truncate text-lg text-[#1a0dab]">{title || "Your SEO title will appear here"}</p>
      <p className="mt-1 text-xs text-emerald-700">
        {domain}
        {path}
      </p>
      <p className="mt-1 text-sm leading-5 text-slate-600">
        {description || "Write or generate an SEO description to preview the search result snippet."}
      </p>
    </div>
  );
}
