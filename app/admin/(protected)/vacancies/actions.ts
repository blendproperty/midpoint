"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
