"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateSiteSettings(formData: FormData) {
  await requireAdmin();
  const siteName = String(formData.get("siteName") || "").trim();
  const domain = String(formData.get("domain") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const defaultSocialImage = String(formData.get("defaultSocialImage") || "").trim() || null;
  const googleVerification = String(formData.get("googleVerification") || "").trim() || null;
  const bingVerification = String(formData.get("bingVerification") || "").trim() || null;
  const allowIndexing = formData.get("allowIndexing") === "on";
  const vacancyRevalidateSeconds = Number(formData.get("vacancyRevalidateSeconds") || 604800);
  const recaptchaSiteKey = String(formData.get("recaptchaSiteKey") || "").trim() || null;

  // Same validation pattern as listings.blendproperty.co.za's settings form:
  // silently drop anything that doesn't look like a real GA4/GTM ID rather
  // than saving a typo that then breaks tracking silently.
  const gaRaw = String(formData.get("googleAnalyticsId") || "").trim();
  const googleAnalyticsId = /^G-[A-Z0-9]+$/i.test(gaRaw) ? gaRaw.toUpperCase() : null;
  const gtmRaw = String(formData.get("tagManagerId") || "").trim();
  const tagManagerId = /^GTM-[A-Z0-9]+$/i.test(gtmRaw) ? gtmRaw.toUpperCase() : null;

  // Microsoft Clarity project IDs are a bare alphanumeric string (no fixed
  // prefix like G- or GTM-), e.g. "abc1d2efgh" — from clarity.microsoft.com
  // -> the project's Setup page -> Installation snippet.
  const clarityRaw = String(formData.get("clarityId") || "").trim();
  const clarityId = /^[a-z0-9]{5,20}$/i.test(clarityRaw) ? clarityRaw : null;

  const defaultTitleTemplate = String(formData.get("defaultTitleTemplate") || "").trim() || null;
  const defaultMetaDescription = String(formData.get("defaultMetaDescription") || "").trim().slice(0, 160) || null;
  const defaultKeywords = String(formData.get("defaultKeywords") || "").trim() || null;
  const whatsapp = String(formData.get("whatsapp") || "").trim() || null;
  const whatsappTemplate = String(formData.get("whatsappTemplate") || "").trim() || null;
  const enquirySuccessMessage = String(formData.get("enquirySuccessMessage") || "").trim() || null;

  const data = {
    siteName,
    domain,
    phone,
    email,
    defaultSocialImage,
    googleVerification,
    bingVerification,
    allowIndexing,
    vacancyRevalidateSeconds,
    recaptchaSiteKey,
    googleAnalyticsId,
    tagManagerId,
    clarityId,
    defaultTitleTemplate,
    defaultMetaDescription,
    defaultKeywords,
    whatsapp,
    whatsappTemplate,
    enquirySuccessMessage,
  };

  // Flag anything the browser sent that got silently dropped by the format
  // checks above, so "I saved a GA4 ID and nothing happened" has a visible
  // explanation instead of just failing quietly.
  const dropped: string[] = [];
  if (gaRaw && !googleAnalyticsId) dropped.push("Google Analytics 4 measurement ID");
  if (gtmRaw && !tagManagerId) dropped.push("Google Tag Manager ID");
  if (clarityRaw && !clarityId) dropped.push("Microsoft Clarity project ID");

  await prisma.siteSetting.upsert({
    where: { id: "global" },
    update: data,
    create: { id: "global", ...data },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");

  const params = new URLSearchParams({ saved: "1" });
  if (dropped.length) params.set("dropped", dropped.join(", "));
  redirect(`/admin/settings?${params.toString()}`);
}
