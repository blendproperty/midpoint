import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { site as staticSiteDefaults } from "@/lib/site";
import { DEFAULT_INDEXNOW_KEY } from "@/lib/indexnow";

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
  googleAnalyticsId: string;
  tagManagerId: string;
  clarityId: string;
  indexNowKey: string;
  defaultTitleTemplate: string;
  defaultMetaDescription: string;
  defaultKeywords: string;
  whatsapp: string;
  whatsappTemplate: string;
  enquirySuccessMessage: string;
};

const DEFAULT_SOCIAL_IMAGE =
  "/images/pages/amenities-banner.jpg";

// The key that was hardcoded in ContactForm.tsx originally — kept as the
// fallback so existing behaviour doesn't change until someone sets a new one
// in /admin/settings (e.g. after registering the live domain in Google's
// reCAPTCHA admin console at google.com/recaptcha/admin).
const DEFAULT_RECAPTCHA_SITE_KEY = "6LcKnCYtAAAAAEW_f1jLM5pQgwvr7GRodfsOyfbY";

const DEFAULT_TITLE_TEMPLATE = "%s | Midpoint Midrand";
const DEFAULT_META_DESCRIPTION =
  "Secure warehouse, office & serviced office space in Midrand. Central location between JHB & PTA with N1 access, gym, padel courts & amenities.";
const DEFAULT_KEYWORDS =
  "office space Midrand, warehouse to rent Midrand, serviced offices Midrand, business park Midrand, commercial property Midrand, Midpoint Business Park";
const DEFAULT_WHATSAPP_TEMPLATE = "Hi, I'd like to enquire about space at Midpoint.";
const DEFAULT_ENQUIRY_SUCCESS_MESSAGE = "Thanks — your enquiry is on its way to the leasing team.";

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
  googleAnalyticsId: "",
  tagManagerId: staticSiteDefaults.gtmId,
  clarityId: "",
  indexNowKey: DEFAULT_INDEXNOW_KEY,
  defaultTitleTemplate: DEFAULT_TITLE_TEMPLATE,
  defaultMetaDescription: DEFAULT_META_DESCRIPTION,
  defaultKeywords: DEFAULT_KEYWORDS,
  whatsapp: "",
  whatsappTemplate: DEFAULT_WHATSAPP_TEMPLATE,
  enquirySuccessMessage: DEFAULT_ENQUIRY_SUCCESS_MESSAGE,
};

// Falls back to static/env defaults if the DB is unreachable so a database
// hiccup can never take the whole site down (same defensive pattern used on
// listings.blendproperty.co.za's own site-settings.ts). Edit these values via
// /admin/settings going forward.
//
// Wrapped in React's cache() so the several places that independently call
// getSiteSettings() during a single request (root layout's generateMetadata,
// root layout's own render, the shared ContactSection, individual page
// generateMetadata functions, etc.) all share one Postgres round-trip
// instead of each firing their own — this was one of two causes found for
// pages taking 10+ seconds to render server-side.
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
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
      googleAnalyticsId: row.googleAnalyticsId || "",
      tagManagerId: row.tagManagerId || FALLBACK.tagManagerId,
      clarityId: row.clarityId || "",
      indexNowKey: row.indexNowKey || DEFAULT_INDEXNOW_KEY,
      defaultTitleTemplate: row.defaultTitleTemplate || DEFAULT_TITLE_TEMPLATE,
      defaultMetaDescription: row.defaultMetaDescription || DEFAULT_META_DESCRIPTION,
      defaultKeywords: row.defaultKeywords || DEFAULT_KEYWORDS,
      whatsapp: row.whatsapp || "",
      whatsappTemplate: row.whatsappTemplate || DEFAULT_WHATSAPP_TEMPLATE,
      enquirySuccessMessage: row.enquirySuccessMessage || DEFAULT_ENQUIRY_SUCCESS_MESSAGE,
    };
  } catch {
    return FALLBACK;
  }
});
