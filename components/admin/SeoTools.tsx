import { getSiteSettings } from "@/lib/site-settings";
import Link from "next/link";

export default async function SeoTools() {
  const { domain, allowIndexing } = await getSiteSettings();
  const property = encodeURIComponent(`sc-domain:${new URL(domain).hostname.replace(/^www\./, "")}`);
  const tools = [
    ["Search queries and clicks", `https://search.google.com/search-console/performance/search-analytics?resource_id=${property}`],
    ["Page indexing", `https://search.google.com/search-console/index?resource_id=${property}`],
    ["PageSpeed Insights", `https://pagespeed.web.dev/analysis?url=${encodeURIComponent(domain)}`],
    ["Website sitemap", new URL("/sitemap.xml", domain).href],
    ["Crawler rules", new URL("/robots.txt", domain).href],
  ];
  return <section className="my-6 rounded-xl border border-slate-200 bg-white p-5" aria-label="Search measurement tools">
    <h2 className="text-lg font-semibold">Measure, improve, publish</h2>
    <p className="mt-2 text-sm text-slate-600">Writing checks use saved content. They are not Google indexing or ranking results. Review queries and impressions, improve the relevant page, then compare clicks and enquiries over time.</p>
    {!allowIndexing && <p className="mt-2 text-sm font-semibold text-amber-800">Site indexing is disabled by the site configuration.</p>}
    <div className="mt-4 flex flex-wrap gap-3">{tools.map(([title, href]) => <a key={title} href={href} target="_blank" rel="noopener noreferrer" className="rounded-full border border-slate-300 px-4 py-2 text-sm underline">{title}</a>)}<Link href="/admin/content-ideas" className="rounded-full bg-midpoint-dark px-4 py-2 text-sm text-white">Plan content ideas</Link></div>
    <p className="mt-3 text-xs text-slate-500">Google reports open in your authorised Google account. Ownership and sitemap submission require verification there. Search data is not imported into this CMS.</p>
  </section>;
}
