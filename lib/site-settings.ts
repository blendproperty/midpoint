import { prisma } from "@/lib/prisma";
import { site as staticSiteDefaults } from "@/lib/site";

export type SiteSettings = {
  siteName: string;
  domain: string;
  phone: string;
  email: string;
  defaultSocialImage: string;
  googleVerification?: string | null;
  bingVerification?: string | null;
  allowIndexing: boolean;
  vacancyRevalidateSeconds: number;
  recaptchaSiteKey: string;
};

const DEFAULT_SOCIAL_IMAGE =
  "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a148a5463dac69c69cbc3a8_amenities_banner-p-1600.jpg";

// The key that was hardcoded in ContactForm.tsx originally — kept as the
// fallback so existing behaviour doesn't change until someone sets a new one
// in /admin/settings (e.g. after registering the live domain in Google's
// reCAPTCHA admin console at google.com/recaptcha/admin).
const DEFAULT_RECAPTCHA_SITE_KEY = "6LcKnCYtAAAAAEW_f1jLM5pQgwvr7GRodfsOyfbY";

const FALLBACK: SiteSettings = {
  siteName: staticSiteDefaults.name,
  domain: staticSiteDefaults.domain,
  phone: staticSiteDefaults.phone,
  email: staticSiteDefaults.email,
  defaultSocialImage: DEFAULT_SOCIAL_IMAGE,
  googleVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || null,
  bingVerification: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || null,
  allowIndexing: process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "false",
  vacancyRevalidateSeconds:
    Number(process.env.VACANCY_REVALIDATE_SECONDS) || 60 * 60 * 24 * 7,
  recaptchaSiteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || DEFAULT_RECAPTCHA_SITE_KEY,
};

// Falls back to static/env defaults if the DB is unreachable so a database
// hiccup can never take the whole site down (same defensive pattern used on
// listings.blendproperty.co.za's own site-settings.ts). Edit these values via
// /admin/settings going forward.
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { id: "global" } });
    if (!row) return FALLBACK;
    return {
      siteName: row.siteName,
      domain: row.domain,
      phone: row.phone,
      email: row.email,
      defaultSocialImage: row.defaultSocialImage || DEFAULT_SOCIAL_IMAGE,
      googleVerification: row.googleVerification,
      bingVerification: row.bingVerification,
      allowIndexing: row.allowIndexing,
      vacancyRevalidateSeconds: row.vacancyRevalidateSeconds,
      recaptchaSiteKey: row.recaptchaSiteKey || FALLBACK.recaptchaSiteKey,
    };
  } catch {
    return FALLBACK;
  }
}
