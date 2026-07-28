"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updatePageSeoOverride(formData: FormData) {
  await requireAdmin();
  const path = String(formData.get("path") || "").trim();
  const seoTitle = String(formData.get("seoTitle") || "").trim() || null;
  const seoDescription = String(formData.get("seoDescription") || "").trim() || null;
  if (!path) throw new Error("Missing path");

  await prisma.pageSeoOverride.upsert({
    where: { path },
    update: { seoTitle, seoDescription },
    create: { path, seoTitle, seoDescription },
  });

  revalidatePath("/admin/page-seo");
  revalidatePath(path);
  redirect("/admin/page-seo");
}
