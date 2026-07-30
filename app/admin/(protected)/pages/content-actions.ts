"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { revalidatePath } from "next/cache";

type EditableContentType = "Blog" | "Page" | "Pillar";
type WorkflowStatus = "DRAFT" | "REVIEW";

async function refreshContentPaths(type: EditableContentType, slug: string) {
  revalidatePath("/admin");
  revalidatePath("/admin/pages");

  if (type === "Blog") {
    revalidatePath("/admin/blog");
    revalidatePath(`/blog/${slug}`);
  } else if (type === "Page") {
    revalidatePath(`/admin/pages`);
    revalidatePath(`/p/${slug}`);
  } else {
    revalidatePath("/admin/pillar-pages");
    revalidatePath(`/${slug}`);
  }
}

export async function setContentWorkflowStatus(
  type: EditableContentType,
  id: string,
  status: WorkflowStatus,
) {
  await requireAdmin();
  if (status !== "DRAFT" && status !== "REVIEW") throw new Error("Invalid content status");

  let slug: string;
  if (type === "Blog") {
    const item = await prisma.blogPost.update({
      where: { id },
      data: { status, publishedAt: null },
      select: { slug: true },
    });
    slug = item.slug;
  } else if (type === "Page") {
    const item = await prisma.page.update({
      where: { id },
      data: { status },
      select: { slug: true },
    });
    slug = item.slug;
  } else if (type === "Pillar") {
    const item = await prisma.pillarPage.update({
      where: { id },
      data: { status, publishedAt: null },
      select: { slug: true },
    });
    slug = item.slug;
  } else {
    throw new Error("Unsupported content type");
  }

  await refreshContentPaths(type, slug);
}

export async function deleteContent(type: EditableContentType, id: string) {
  await requireAdmin();

  let slug: string;
  if (type === "Blog") {
    const item = await prisma.blogPost.delete({ where: { id }, select: { slug: true } });
    slug = item.slug;
  } else if (type === "Page") {
    const item = await prisma.page.delete({ where: { id }, select: { slug: true } });
    slug = item.slug;
  } else if (type === "Pillar") {
    const item = await prisma.pillarPage.delete({ where: { id }, select: { slug: true } });
    slug = item.slug;
  } else {
    throw new Error("Unsupported content type");
  }

  await refreshContentPaths(type, slug);
}
