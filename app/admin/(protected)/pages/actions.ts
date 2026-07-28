"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { hashPassword } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { submitToIndexNow } from "@/lib/indexnow";

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

function readCommonFields(formData: FormData) {
  return {
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

// Shared by createPage/updatePage. Never lets a page end up "protected" with
// no password ever set — that would lock out every visitor including
// whoever ticked the box, with no way back in short of clearing it in the
// database directly.
async function readAccessControlFields(formData: FormData, existingHash: string | null) {
  const passwordProtected = formData.get("passwordProtected") === "on";
  const rawPassword = String(formData.get("accessPassword") || "").trim();

  const accessPasswordHash = rawPassword ? await hashPassword(rawPassword) : existingHash;

  return {
    passwordProtected: passwordProtected && Boolean(accessPasswordHash),
    accessPasswordHash,
  };
}

export async function createPage(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const slug = slugify(slugInput || title);
  const contentHtml = String(formData.get("contentHtml") || "");
  const status = String(formData.get("status") || "DRAFT") as "DRAFT" | "PUBLISHED";
  const access = await readAccessControlFields(formData, null);

  if (!title || !slug) throw new Error("Title is required");

  await prisma.page.create({
    data: { title, slug, contentHtml, status, ...readCommonFields(formData), ...access },
  });

  if (status === "PUBLISHED" && !access.passwordProtected) await submitToIndexNow([`/p/${slug}`]);

  revalidatePath("/admin/pages");
  revalidatePath(`/p/${slug}`);
  redirect("/admin/pages");
}

export async function updatePage(id: string, formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const slug = slugify(slugInput || title);
  const contentHtml = String(formData.get("contentHtml") || "");
  const status = String(formData.get("status") || "DRAFT") as "DRAFT" | "PUBLISHED";

  const existing = await prisma.page.findUnique({ where: { id }, select: { accessPasswordHash: true } });
  const access = await readAccessControlFields(formData, existing?.accessPasswordHash ?? null);

  await prisma.page.update({
    where: { id },
    data: { title, slug, contentHtml, status, ...readCommonFields(formData), ...access },
  });

  if (status === "PUBLISHED" && !access.passwordProtected) await submitToIndexNow([`/p/${slug}`]);

  revalidatePath("/admin/pages");
  revalidatePath(`/p/${slug}`);
  redirect("/admin/pages");
}

export async function deletePage(id: string) {
  await requireAdmin();
  const page = await prisma.page.delete({ where: { id } });
  revalidatePath("/admin/pages");
  revalidatePath(`/p/${page.slug}`);
}
