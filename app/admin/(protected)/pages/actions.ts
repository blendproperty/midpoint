"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function createPage(formData: FormData) {
  await requireAdmin();
  const title = String(formData.get("title") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const slug = slugify(slugInput || title);
  const contentHtml = String(formData.get("contentHtml") || "");
  const status = String(formData.get("status") || "DRAFT") as "DRAFT" | "PUBLISHED";
  const seoTitle = String(formData.get("seoTitle") || "").trim() || null;
  const seoDescription = String(formData.get("seoDescription") || "").trim() || null;
  const focusKeyword = String(formData.get("focusKeyword") || "").trim() || null;

  if (!title || !slug) throw new Error("Title is required");

  await prisma.page.create({
    data: { title, slug, contentHtml, status, seoTitle, seoDescription, focusKeyword },
  });

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
  const seoTitle = String(formData.get("seoTitle") || "").trim() || null;
  const seoDescription = String(formData.get("seoDescription") || "").trim() || null;
  const focusKeyword = String(formData.get("focusKeyword") || "").trim() || null;

  await prisma.page.update({
    where: { id },
    data: { title, slug, contentHtml, status, seoTitle, seoDescription, focusKeyword },
  });

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
