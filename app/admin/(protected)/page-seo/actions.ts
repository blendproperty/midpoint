"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";

function parseSchemaJson(raw: string): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  const trimmed = raw.trim();
  if (!trimmed) return Prisma.JsonNull;
  try {
    return JSON.parse(trimmed);
  } catch {
    return Prisma.JsonNull;
  }
}

export async function updatePageSeoOverride(formData: FormData) {
  await requireAdmin();
  const path = String(formData.get("path") || "").trim();
  if (!path) throw new Error("Missing path");

  const data = {
    seoTitle: String(formData.get("seoTitle") || "").trim() || null,
    seoDescription: String(formData.get("seoDescription") || "").trim() || null,
    ogTitle: String(formData.get("ogTitle") || "").trim() || null,
    ogDescription: String(formData.get("ogDescription") || "").trim() || null,
    ogImage: String(formData.get("ogImage") || "").trim() || null,
    noIndex: formData.get("noIndex") === "on",
    canonicalUrl: String(formData.get("canonicalUrl") || "").trim() || null,
    schemaJson: parseSchemaJson(String(formData.get("schemaJson") || "")),
    headCode: String(formData.get("headCode") || "").trim() || null,
    bodyCode: String(formData.get("bodyCode") || "").trim() || null,
  };

  await prisma.pageSeoOverride.upsert({
    where: { path },
    update: data,
    create: { path, ...data },
  });

  revalidatePath("/admin/page-seo");
  revalidatePath("/admin/pages");
  revalidatePath(path);
  redirect("/admin/page-seo");
}
