"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { parsePillarFaqs } from "@/lib/pillar-faqs";
import { parseFeatures, parseConsiderations, parseLinks } from "@/lib/pillar-blocks";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseSchemaJson(raw: string): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  const trimmed = raw.trim();
  if (!trimmed) return Prisma.JsonNull;
  try {
    return JSON.parse(trimmed);
  } catch {
    return Prisma.JsonNull;
  }
}

function readFields(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const slug = slugify(slugInput || title);
  const status = String(formData.get("status") || "DRAFT") as "DRAFT" | "PUBLISHED";
  const faqs = parsePillarFaqs(String(formData.get("faqsText") || ""));
  const features = parseFeatures(String(formData.get("featuresText") || ""));
  const considerations = parseConsiderations(String(formData.get("considerationsText") || ""));
  const exploreLinks = parseLinks(String(formData.get("exploreLinksText") || ""));
  const lastReviewedRaw = String(formData.get("lastReviewedAt") || "").trim();
  const relatedSectorRaw = String(formData.get("relatedSector") || "").trim();

  return {
    title,
    slug,
    primaryEntity: String(formData.get("primaryEntity") || "").trim() || null,
    primaryAudience: String(formData.get("primaryAudience") || "").trim() || null,
    decisionStage: String(formData.get("decisionStage") || "").trim() || null,
    primarySearchIntent: String(formData.get("primarySearchIntent") || "").trim() || null,
    primaryConversion: String(formData.get("primaryConversion") || "").trim() || null,
    heroAnswer: String(formData.get("heroAnswer") || "").trim() || null,
    heroImage: String(formData.get("heroImage") || "").trim() || null,
    trustStrip: String(formData.get("trustStrip") || "").trim() || null,
    relatedSector: relatedSectorRaw ? (relatedSectorRaw as "WAREHOUSE" | "OFFICE" | "SERVICED_OFFICE") : null,
    listingsHeading: String(formData.get("listingsHeading") || "").trim() || null,
    listingsIntro: String(formData.get("listingsIntro") || "").trim() || null,
    showReadyToMove: formData.get("showReadyToMove") === "on",
    features,
    considerations,
    exploreLinks,
    contentHtml: String(formData.get("contentHtml") || ""),
    faqs,
    faqsHeading: String(formData.get("faqsHeading") || "").trim() || null,
    ctaHeading: String(formData.get("ctaHeading") || "").trim() || null,
    ctaText: String(formData.get("ctaText") || "").trim() || null,
    expertName: String(formData.get("expertName") || "").trim() || null,
    expertRole: String(formData.get("expertRole") || "").trim() || null,
    expertBio: String(formData.get("expertBio") || "").trim() || null,
    expertImage: String(formData.get("expertImage") || "").trim() || null,
    reviewOwner: String(formData.get("reviewOwner") || "").trim() || null,
    lastReviewedAt: lastReviewedRaw ? new Date(lastReviewedRaw) : null,
    status,
    seoTitle: String(formData.get("seoTitle") || "").trim() || null,
    seoDescription: String(formData.get("seoDescription") || "").trim() || null,
    focusKeyword: String(formData.get("focusKeyword") || "").trim() || null,
    ogTitle: String(formData.get("ogTitle") || "").trim() || null,
    ogDescription: String(formData.get("ogDescription") || "").trim() || null,
    ogImage: String(formData.get("ogImage") || "").trim() || null,
    noIndex: formData.get("noIndex") === "on",
    canonicalUrl: String(formData.get("canonicalUrl") || "").trim() || null,
    schemaJson: parseSchemaJson(String(formData.get("schemaJson") || "")),
    headCode: String(formData.get("headCode") || "").trim() || null,
    bodyCode: String(formData.get("bodyCode") || "").trim() || null,
  };
}

export async function createPillarPage(formData: FormData) {
  await requireAdmin();
  const fields = readFields(formData);
  if (!fields.title || !fields.slug) throw new Error("Title is required");

  await prisma.pillarPage.create({
    data: {
      ...fields,
      publishedAt: fields.status === "PUBLISHED" ? new Date() : null,
    },
  });

  revalidatePath("/admin/pillar-pages");
  revalidatePath("/admin/pages");
  revalidatePath(`/${fields.slug}`);
  redirect("/admin/pillar-pages");
}

export async function updatePillarPage(id: string, formData: FormData) {
  await requireAdmin();
  const fields = readFields(formData);
  const existing = await prisma.pillarPage.findUnique({ where: { id } });

  await prisma.pillarPage.update({
    where: { id },
    data: {
      ...fields,
      publishedAt: fields.status === "PUBLISHED" ? existing?.publishedAt || new Date() : null,
    },
  });

  revalidatePath("/admin/pillar-pages");
  revalidatePath("/admin/pages");
  revalidatePath(`/${fields.slug}`);
  redirect("/admin/pillar-pages");
}

export async function deletePillarPage(id: string) {
  await requireAdmin();
  const pillar = await prisma.pillarPage.delete({ where: { id } });
  revalidatePath("/admin/pillar-pages");
  revalidatePath("/admin/pages");
  revalidatePath(`/${pillar.slug}`);
}
