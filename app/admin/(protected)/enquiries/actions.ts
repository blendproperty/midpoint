"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { revalidatePath } from "next/cache";

export async function toggleEnquiryHandled(id: string, handled: boolean) {
  await requireAdmin();
  await prisma.enquiry.update({ where: { id }, data: { handled } });
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}
