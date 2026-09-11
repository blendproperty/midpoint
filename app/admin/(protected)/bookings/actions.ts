"use server";
import { requireAdmin } from "@/lib/require-admin";
import { changeReservation, blockRoom } from "@/lib/stay-admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { lock } from "@/lib/stay-service";
function refresh() {
  for (const p of [
    "/admin/bookings",
    "/admin/suites",
    "/admin/housekeeping",
    "/admin/calendar",
    "/admin/rooms",
    "/stay",
  ])
    revalidatePath(p);
}
export async function bookingAction(id: string, form: FormData) {
  const session = await requireAdmin();
  let error = "";
  try {
    await changeReservation(id, String(form.get("action")), session.email, {
      roomId: String(form.get("roomId") || ""),
      checkIn: String(form.get("checkIn") || ""),
      checkOut: String(form.get("checkOut") || ""),
    });
  } catch (e) {
    error = (e as Error).message;
  }
  refresh();
  redirect(
    "/admin/bookings/" +
      id +
      (error ? "?error=" + encodeURIComponent(error) : "?saved=1"),
  );
}
export async function addBlock(form: FormData) {
  const session = await requireAdmin();
  let error = "";
  try {
    await blockRoom(
      String(form.get("roomId")),
      String(form.get("start")),
      String(form.get("end")),
      String(form.get("reason")),
      session.email,
    );
  } catch (e) {
    error = (e as Error).message;
  }
  refresh();
  redirect(
    "/admin/calendar" +
      (error ? "?error=" + encodeURIComponent(error) : "?saved=1"),
  );
}
export async function removeBlock(id: string) {
  const session = await requireAdmin();
  await prisma.$transaction(async (db) => {
    await lock(db);
    await db.roomBlock.delete({ where: { id } });
    await db.bookingAudit.create({
      data: { actor: session.email, action: "remove block", target: id },
    });
  });
  refresh();
}
