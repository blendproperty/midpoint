"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { syncVacanciesFromListings } from "@/lib/listings-sync";

const SECTOR_VALUES = ["WAREHOUSE", "OFFICE", "SERVICED_OFFICE"] as const;

function parseFeatures(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function revalidateVacancyPaths() {
  revalidatePath("/admin/vacancies");
  revalidatePath("/vacancies");
  revalidatePath("/availability-report");
}

export async function createVacancy(formData: FormData) {
  await requireAdmin();
  const building = String(formData.get("building") || "").trim();
  const unitName = String(formData.get("unitName") || "").trim() || null;
  const sector = String(formData.get("sector") || "OFFICE");
  const sizeSqm = Number(formData.get("sizeSqm") || 0);
  const ratePerSqm = Number(formData.get("ratePerSqm") || 0);
  const availability = String(formData.get("availability") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const features = parseFeatures(String(formData.get("features") || ""));
  const image = String(formData.get("image") || "").trim() || null;
  const status = String(formData.get("status") || "PUBLISHED") as "DRAFT" | "PUBLISHED";
  const sortOrder = Number(formData.get("sortOrder") || 0);

  if (!building || !availability || !description) {
    throw new Error("Building, availability, and description are required");
  }

  await prisma.vacancy.create({
    data: {
      building,
      unitName,
      sector: sector as (typeof SECTOR_VALUES)[number],
      sizeSqm,
      ratePerSqm,
      availability,
      description,
      features,
      image,
      status,
      sortOrder,
    },
  });

  revalidateVacancyPaths();
  redirect("/admin/vacancies");
}

export async function updateVacancy(id: string, formData: FormData) {
  await requireAdmin();
  const building = String(formData.get("building") || "").trim();
  const unitName = String(formData.get("unitName") || "").trim() || null;
  const sector = String(formData.get("sector") || "OFFICE");
  const sizeSqm = Number(formData.get("sizeSqm") || 0);
  const ratePerSqm = Number(formData.get("ratePerSqm") || 0);
  const availability = String(formData.get("availability") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const features = parseFeatures(String(formData.get("features") || ""));
  const image = String(formData.get("image") || "").trim() || null;
  const status = String(formData.get("status") || "PUBLISHED") as "DRAFT" | "PUBLISHED";
  const sortOrder = Number(formData.get("sortOrder") || 0);

  await prisma.vacancy.update({
    where: { id },
    data: {
      building,
      unitName,
      sector: sector as (typeof SECTOR_VALUES)[number],
      sizeSqm,
      ratePerSqm,
      availability,
      description,
      features,
      image,
      status,
      sortOrder,
    },
  });

  revalidateVacancyPaths();
  redirect("/admin/vacancies");
}

export async function deleteVacancy(id: string) {
  await requireAdmin();
  await prisma.vacancy.delete({ where: { id } });
  revalidateVacancyPaths();
}

// Manual trigger for the same sync the VPS crontab calls on a schedule
// (app/api/cron/sync-vacancies/route.ts) — lets an editor run it on demand
// right after publishing something on listings.blendproperty.co.za instead
// of waiting for the next scheduled run. Result is passed back via query
// params since server actions can't return data straight to a redirect.
export async function syncVacanciesNow() {
  await requireAdmin();
  const result = await syncVacanciesFromListings();
  revalidateVacancyPaths();

  const params = new URLSearchParams({
    synced: "1",
    created: String(result.created),
    updated: String(result.updated),
    deprecated: String(result.deprecated),
    skipped: String(result.skipped.length),
  });
  if (result.error) params.set("error", result.error);

  redirect(`/admin/vacancies?${params.toString()}`);
}
