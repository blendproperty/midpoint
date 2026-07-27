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

export async function createBlogPost(formData: FormData) {
  const session = await requireAdmin();
  const title = String(formData.get("title") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const slug = slugify(slugInput || title);
  const excerpt = String(formData.get("excerpt") || "").trim() || null;
  const contentHtml = String(formData.get("contentHtml") || "");
  const coverImage = String(formData.get("coverImage") || "").trim() || null;
  const status = String(formData.get("status") || "DRAFT") as "DRAFT" | "PUBLISHED";
  const seoTitle = String(formData.get("seoTitle") || "").trim() || null;
  const seoDescription = String(formData.get("seoDescription") || "").trim() || null;

  if (!title || !slug) throw new Error("Title is required");

  await prisma.blogPost.create({
    data: {
      title,
      slug,
      excerpt,
      contentHtml,
      coverImage,
      status,
      seoTitle,
      seoDescription,
      authorId: session.sub,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });

  revalidatePath("/admin/blog");
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
  const seoTitle = String(formData.get("seoTitle") || "").trim() || null;
  const seoDescription = String(formData.get("seoDescription") || "").trim() || null;

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
      seoTitle,
      seoDescription,
      publishedAt: status === "PUBLISHED" ? existing?.publishedAt || new Date() : null,
    },
  });

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  redirect("/admin/blog");
}

export async function deleteBlogPost(id: string) {
  await requireAdmin();
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
