"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { revalidatePath } from "next/cache";
import type { ContactStatus } from "@prisma/client";

const VALID_STATUSES: ContactStatus[] = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST"];

export async function updateContactStatus(contactId: string, formData: FormData) {
  await requireAdmin();
  const raw = String(formData.get("status") || "");
  if (!VALID_STATUSES.includes(raw as ContactStatus)) return;

  await prisma.contact.update({ where: { id: contactId }, data: { status: raw as ContactStatus } });
  revalidatePath("/admin/contacts");
  revalidatePath(`/admin/contacts/${contactId}`);
}

export async function assignContact(contactId: string, formData: FormData) {
  await requireAdmin();
  const assignedToId = String(formData.get("assignedToId") || "") || null;

  await prisma.contact.update({ where: { id: contactId }, data: { assignedToId } });
  revalidatePath("/admin/contacts");
  revalidatePath(`/admin/contacts/${contactId}`);
}

export async function addContactNote(contactId: string, formData: FormData) {
  const session = await requireAdmin();
  const body = String(formData.get("body") || "").trim();
  if (!body) return;

  await prisma.contactNote.create({
    data: { contactId, authorId: session.sub, body },
  });
  revalidatePath(`/admin/contacts/${contactId}`);
}
