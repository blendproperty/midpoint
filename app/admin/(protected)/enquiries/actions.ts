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

// Only removes the raw submission-log row itself (this Enquiry record) —
// the linked Contact (if any) and its notes/history are untouched, since
// someone might submit several test enquiries under a real Contact and only
// want the junk log entries gone, not the person record.
export async function deleteEnquiry(id: string) {
  await requireAdmin();
  await prisma.enquiry.delete({ where: { id } });
  revalidatePath("/admin/enquiries");
  revalidatePath("/admin");
}
