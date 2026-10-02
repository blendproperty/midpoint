"use server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { getSiteSettings } from "@/lib/site-settings";
import { readContentIdea } from "@/lib/content-ideas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveContentIdea(form: FormData) {
  await requireAdmin();
  const settings = await getSiteSettings();
  const data = readContentIdea(form, settings.domain);
  const id = String(form.get("id") || "");
  if (id) await prisma.contentIdea.update({ where: { id }, data });
  else await prisma.contentIdea.create({ data });
  revalidatePath("/admin/content-ideas");
  redirect("/admin/content-ideas");
}

export async function deleteContentIdea(form: FormData) {
  await requireAdmin();
  await prisma.contentIdea.delete({ where: { id: String(form.get("id") || "") } });
  revalidatePath("/admin/content-ideas");
  redirect("/admin/content-ideas");
}
