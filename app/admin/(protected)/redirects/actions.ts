"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const VALID_STATUS_CODES = new Set([301, 302, 307, 308]);

function normalizePath(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export async function createRedirect(formData: FormData) {
  await requireAdmin();
  const fromPath = normalizePath(String(formData.get("fromPath") || ""));
  const toPathRaw = String(formData.get("toPath") || "").trim();
  const toPath = toPathRaw.startsWith("http") ? toPathRaw : normalizePath(toPathRaw);
  const statusCode = Number(formData.get("statusCode")) || 301;

  if (!fromPath || !toPath) throw new Error("Both the old path and the destination are required");
  if (fromPath.startsWith("/admin") || fromPath.startsWith("/api")) {
    throw new Error("Can't redirect an /admin or /api path — that would break the admin panel or an internal route");
  }
  if (fromPath === toPath) throw new Error("A redirect can't point to itself");
  if (!VALID_STATUS_CODES.has(statusCode)) throw new Error("Invalid status code");

  await prisma.redirect.create({ data: { fromPath, toPath, statusCode } });

  revalidatePath("/admin/redirects");
  redirect("/admin/redirects");
}

export async function updateRedirect(id: string, formData: FormData) {
  await requireAdmin();
  const toPathRaw = String(formData.get("toPath") || "").trim();
  const toPath = toPathRaw.startsWith("http") ? toPathRaw : normalizePath(toPathRaw);
  const statusCode = Number(formData.get("statusCode")) || 301;

  if (!toPath) throw new Error("Destination is required");
  if (!VALID_STATUS_CODES.has(statusCode)) throw new Error("Invalid status code");

  await prisma.redirect.update({ where: { id }, data: { toPath, statusCode } });
  revalidatePath("/admin/redirects");
}

export async function deleteRedirect(id: string) {
  await requireAdmin();
  await prisma.redirect.delete({ where: { id } });
  revalidatePath("/admin/redirects");
}
