"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function revalidateFaqPaths() {
  revalidatePath("/admin/faqs");
  revalidatePath("/faqs");
  revalidatePath("/");
}

export async function createFaq(formData: FormData) {
  await requireAdmin();
  const question = String(formData.get("question") || "").trim();
  const answer = String(formData.get("answer") || "").trim();
  const sortOrder = Number(formData.get("sortOrder") || 0);

  if (!question || !answer) throw new Error("Question and answer are required");

  await prisma.faq.create({ data: { question, answer, sortOrder } });

  revalidateFaqPaths();
  redirect("/admin/faqs");
}

export async function updateFaq(id: string, formData: FormData) {
  await requireAdmin();
  const question = String(formData.get("question") || "").trim();
  const answer = String(formData.get("answer") || "").trim();
  const sortOrder = Number(formData.get("sortOrder") || 0);

  await prisma.faq.update({ where: { id }, data: { question, answer, sortOrder } });

  revalidateFaqPaths();
  redirect("/admin/faqs");
}

export async function deleteFaq(id: string) {
  await requireAdmin();
  await prisma.faq.delete({ where: { id } });
  revalidateFaqPaths();
}
