"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { revalidatePath } from "next/cache";

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

  await prisma.siteSetting.upsert({
    where: { id: "global" },
    update: {
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
    },
    create: {
      id: "global",
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
    },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
}
