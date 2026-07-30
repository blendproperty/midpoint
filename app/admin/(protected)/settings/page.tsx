import { getSiteSettings } from "@/lib/site-settings";
import { updateSiteSettings } from "./actions";
import SaveSettingsButton from "@/components/admin/SaveSettingsButton";

export const dynamic = "force-dynamic";

export default async function SettingsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; dropped?: string }>;
}) {
  const settings = await getSiteSettings();
  const sp = await searchParams;

  return (
    <div>
      <h1 className="text-2xl font-semibold">Site Settings</h1>

      {sp.saved && (
        <div className="mt-4 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-700">
          <p>Settings saved.</p>
          {sp.dropped && (
            <p className="mt-1 text-amber-700">
              Note: {sp.dropped} didn&apos;t match the expected format, so {sp.dropped.includes(",") ? "those weren't" : "that wasn't"} saved — everything else was.
            </p>
          )}
        </div>
      )}

      <form action={updateSiteSettings} className="mt-6 max-w-2xl space-y-8">
        <div className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">General</h2>
          <div>
            <label className="block text-sm font-medium">Site name</label>
            <input name="siteName" defaultValue={settings.siteName} required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium">Domain (no trailing slash)</label>
            <input name="domain" defaultValue={settings.domain} required className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input name="phone" defaultValue={settings.phone} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input name="email" defaultValue={settings.email} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Default social share image URL</label>
            <input name="defaultSocialImage" defaultValue={settings.defaultSocialImage} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Default SEO</h2>
          <p className="text-xs text-slate-400">
            Used as the site-wide fallback whenever a page doesn&apos;t set its own title/description/keywords —
            individual Blog posts, Pages and Pillar pages can still override these from their own SEO settings.
            The XML sitemap itself needs no setting here — it&apos;s generated automatically at{" "}
            <span className="font-medium text-slate-600">{settings.domain}/sitemap.xml</span> from whatever is
            currently published; just submit that URL once inside Search Console / Bing Webmaster Tools.
          </p>
          <div>
            <label className="block text-sm font-medium">Default title template</label>
            <input name="defaultTitleTemplate" defaultValue={settings.defaultTitleTemplate} placeholder="%s | Midpoint Midrand" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <p className="mt-1 text-xs text-slate-400">Use %s where the page&apos;s own title should be inserted.</p>
          </div>
          <div>
            <label className="block text-sm font-medium">Default meta description</label>
            <textarea name="defaultMetaDescription" defaultValue={settings.defaultMetaDescription} rows={2} maxLength={160} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium">Default keywords (comma-separated)</label>
            <input name="defaultKeywords" defaultValue={settings.defaultKeywords} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Google Search Console verification code</label>
              <input name="googleVerification" defaultValue={settings.googleVerification || ""} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              <p className="mt-1 text-xs text-slate-400">
                search.google.com/search-console → Add property → HTML tag method → paste just the{" "}
                <span className="font-mono">content=&quot;...&quot;</span> value here, not the whole tag.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium">Bing verification code</label>
              <input name="bingVerification" defaultValue={settings.bingVerification || ""} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              <p className="mt-1 text-xs text-slate-400">
                bing.com/webmasters → Add site → Meta tag method → same idea, just the value.
              </p>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" name="allowIndexing" defaultChecked={settings.allowIndexing} />
              Allow search engines to index this site
            </label>
          </div>
        </div>

        <div className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Analytics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Google Analytics 4 measurement ID</label>
              <input name="googleAnalyticsId" defaultValue={settings.googleAnalyticsId} placeholder="G-XXXXXXXXXX" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              <p className="mt-1 text-xs text-slate-400">
                Must match G-XXXXXXX or it won&apos;t be saved. Find it in analytics.google.com under the
                &quot;Midpoint&quot; property → Admin (gear, bottom left) → Data Streams → the Web stream → the
                Measurement ID shown top-right of that page.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium">Google Tag Manager ID</label>
              <input name="tagManagerId" defaultValue={settings.tagManagerId} placeholder="GTM-XXXXXXX" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              <p className="mt-1 text-xs text-slate-400">Must match GTM-XXXXXXX or it won&apos;t be saved.</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Microsoft Clarity project ID</label>
            <input name="clarityId" defaultValue={settings.clarityId} placeholder="e.g. abc1d2efgh" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <p className="mt-1 text-xs text-slate-400">
              clarity.microsoft.com → your project → Setup → the Installation snippet has a line like{" "}
              <span className="font-mono">&quot;abc1d2efgh&quot;</span> — that short ID is what goes here, not the
              whole script tag. Adds heatmaps and session recordings alongside GA4.
            </p>
          </div>
        </div>

        <div className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">IndexNow</h2>
          <p className="text-xs text-slate-400">
            Not something you get from Bing or Google — this key is generated by this site itself and just proves
            you control the domain. It&apos;s already working: every time a Blog post, Page, or Pillar page is
            published, this site automatically pings Bing/Yandex with the changed URL so they pick it up faster
            than waiting for their normal crawl. You only need to touch this field if you specifically want to
            change the key; leaving it as-is is fine.
          </p>
          <div>
            <label className="block text-sm font-medium">IndexNow key</label>
            <input name="indexNowKey" defaultValue={settings.indexNowKey} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm font-mono" />
            <p className="mt-1 text-xs text-slate-400">
              Letters, numbers, and hyphens only (8-64 characters) — it becomes part of a URL:{" "}
              <span className="font-mono">{settings.domain}/&lt;this-value&gt;.txt</span>. That file is served
              automatically; you never need to create it by hand.
            </p>
          </div>
        </div>

        <div className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">WhatsApp</h2>
          <p className="text-xs text-slate-400">
            Set a number to show a floating WhatsApp button site-wide. Leave blank to hide it entirely.
          </p>
          <div>
            <label className="block text-sm font-medium">WhatsApp number (with country code, digits only)</label>
            <input name="whatsapp" defaultValue={settings.whatsapp} placeholder="27113809400" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium">Pre-filled message</label>
            <input name="whatsappTemplate" defaultValue={settings.whatsappTemplate} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Enquiries</h2>
          <div>
            <label className="block text-sm font-medium">Success message shown after submitting the contact form</label>
            <textarea name="enquirySuccessMessage" defaultValue={settings.enquirySuccessMessage} rows={2} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
        </div>

        <div className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Other</h2>
          <div>
            <label className="block text-sm font-medium">Vacancy data refresh window (seconds)</label>
            <input type="number" name="vacancyRevalidateSeconds" defaultValue={settings.vacancyRevalidateSeconds} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <p className="mt-1 text-xs text-slate-400">604800 = 7 days. Only relevant once a live external listings API is connected.</p>
          </div>
          <div>
            <label className="block text-sm font-medium">Google reCAPTCHA v2 site key</label>
            <input name="recaptchaSiteKey" defaultValue={settings.recaptchaSiteKey} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            <p className="mt-1 text-xs text-slate-400">
              Used on the contact form. If you see &quot;ERROR for site owner: Invalid domain for site key&quot; on the
              live site, that means this domain isn&apos;t registered against the key in Google&apos;s reCAPTCHA admin
              console (google.com/recaptcha/admin) &mdash; open that key there, add the current domain, and save.
            </p>
          </div>
        </div>

        <SaveSettingsButton />
      </form>
    </div>
  );
}
