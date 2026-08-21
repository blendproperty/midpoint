"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export type SuiteFormValues = {
  name: string;
  slug: string;
  description: string;
  maxGuests: number;
  nightlyRate: number;
  image?: string;
  features: string[];
  status: "DRAFT" | "REVIEW" | "PUBLISHED";
};

export async function createSuite(values: SuiteFormValues) {
  await requireAdmin();

  await prisma.suite.create({
    data: {
      name: values.name,
      slug: values.slug,
      description: values.description,
      maxGuests: values.maxGuests,
      nightlyRate: values.nightlyRate,
      image: values.image,
      features: values.features,
      status: values.status,
    },
  });

  revalidatePath("/admin/suites");
  revalidatePath("/suites");
  redirect("/admin/suites");
}

export async function updateSuite(id: string, values: SuiteFormValues) {
  await requireAdmin();

  await prisma.suite.update({
    where: { id },
    data: {
      name: values.name,
      slug: values.slug,
      description: values.description,
      maxGuests: values.maxGuests,
      nightlyRate: values.nightlyRate,
      image: values.image,
      features: values.features,
      status: values.status,
    },
  });

  revalidatePath("/admin/suites");
  revalidatePath("/suites");
  redirect("/admin/suites");
}

export async function deleteSuite(id: string) {
  await requireAdmin();
  await prisma.suite.delete({ where: { id } });
  revalidatePath("/admin/suites");
  revalidatePath("/suites");
}
