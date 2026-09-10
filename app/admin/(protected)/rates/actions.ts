"use server";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { validateConfig } from "@/lib/stay-pricing";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { lock } from "@/lib/stay-service";
export async function saveRates(form: FormData) {
  const session = await requireAdmin();
  let error = "";
  try {
    const raw = String(form.get("config") || "");
    if (raw.length > 50000) throw new Error("Settings too large.");
    const data = validateConfig(JSON.parse(raw));
    await prisma.$transaction(async (db) => {
      await lock(db);
      await db.bookingConfig.upsert({
        where: { id: "staging" },
        create: { id: "staging", data: JSON.parse(JSON.stringify(data)) },
        update: { data: JSON.parse(JSON.stringify(data)) },
      });
      await db.bookingAudit.create({
        data: {
          actor: session.email,
          action: "update test rates and policies",
          target: "staging",
        },
      });
    });
  } catch (e) {
    error = (e as Error).message;
  }
  revalidatePath("/stay");
  revalidatePath("/admin/rates");
  redirect(
    "/admin/rates" +
      (error ? "?error=" + encodeURIComponent(error) : "?saved=1"),
  );
}
