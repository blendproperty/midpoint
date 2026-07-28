import { getSiteSettings } from "@/lib/site-settings";
import { updateSiteSettings } from "./actions";

export const dynamic = "force-dynamic";

export default async function SettingsAdminPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Site Settings</h1>
      <form action={updateSiteSettings} className="mt-6 max-w-2xl space-y-5 rounded-xl bg-white p-6 shadow-sm">
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Google Search Console verification code</label>
            <input name="googleVerification" defaultValue={settings.googleVerification || ""} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium">Bing verification code</label>
            <input name="bingVerification" defaultValue={settings.bingVerification || ""} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input type="checkbox" name="allowIndexing" defaultChecked={settings.allowIndexing} />
            Allow search engines to index this site
          </label>
        </div>
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
            console (google.com/recaptcha/admin) &mdash; open that key there, add the current domain (e.g.
            midpoint.onpointoffices.co.za and/or www.mid-point.co.za) under &quot;Domains&quot;, and save. If you
            create a brand new key instead, paste its site key here so it takes effect without a code deploy.
          </p>
        </div>
        <button type="submit" className="rounded-full bg-midpoint-dark px-5 py-2.5 text-sm font-semibold text-white">
          Save settings
        </button>
      </form>
    </div>
  );
}
