"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
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

export async function createBlogPost(formData: FormData) {
  const session = await requireAdmin();
  const title = String(formData.get("title") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const slug = slugify(slugInput || title);
  const excerpt = String(formData.get("excerpt") || "").trim() || null;
  const contentHtml = String(formData.get("contentHtml") || "");
  const coverImage = String(formData.get("coverImage") || "").trim() || null;
  const status = String(formData.get("status") || "DRAFT") as "DRAFT" | "PUBLISHED";

  if (!title || !slug) throw new Error("Title is required");

  await prisma.blogPost.create({
    data: {
      title,
      slug,
      excerpt,
      contentHtml,
      coverImage,
      status,
      ...readCommonFields(formData),
      authorId: session.sub,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });

  if (status === "PUBLISHED") await submitToIndexNow([`/blog/${slug}`]);

  revalidatePath("/admin/blog");
  revalidatePath("/admin/pages");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function updateBlogPost(id: string, formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const slug = slugify(slugInput || title);
  const excerpt = String(formData.get("excerpt") || "").trim() || null;
  const contentHtml = String(formData.get("contentHtml") || "");
  const coverImage = String(formData.get("coverImage") || "").trim() || null;
  const status = String(formData.get("status") || "DRAFT") as "DRAFT" | "PUBLISHED";

  const existing = await prisma.blogPost.findUnique({ where: { id } });

  await prisma.blogPost.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt,
      contentHtml,
      coverImage,
      status,
      ...readCommonFields(formData),
      publishedAt: status === "PUBLISHED" ? existing?.publishedAt || new Date() : null,
    },
  });

  if (status === "PUBLISHED") await submitToIndexNow([`/blog/${slug}`]);

  revalidatePath("/admin/blog");
  revalidatePath("/admin/pages");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  await requireAdmin();
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blog");
  revalidatePath("/admin/pages");
  revalidatePath("/blog");
}
