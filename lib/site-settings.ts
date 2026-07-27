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
};

const DEFAULT_SOCIAL_IMAGE =
  "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a148a5463dac69c69cbc3a8_amenities_banner-p-1600.jpg";

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
    };
  } catch {
    return FALLBACK;
  }
}
