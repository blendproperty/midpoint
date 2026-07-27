"use server";

import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/require-admin";
import { hashPassword } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createUser(formData: FormData) {
  await requireSuperAdmin();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const name = String(formData.get("name") || "").trim() || null;
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "EDITOR") as "SUPER_ADMIN" | "EDITOR";

  if (!email || password.length < 8) {
    throw new Error("Email and a password of at least 8 characters are required");
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.create({ data: { email, name, passwordHash, role } });

  revalidatePath("/admin/users");
  redirect("/admin/users");
}

export async function deleteUser(id: string) {
  const session = await requireSuperAdmin();
  if (session.sub === id) {
    throw new Error("You can't delete your own account");
  }
  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}
