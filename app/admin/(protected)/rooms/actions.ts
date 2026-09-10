"use server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { revalidatePath } from "next/cache";
import { lock, expire } from "@/lib/stay-service";
export async function updateRoom(id: string, form: FormData) {
  const session = await requireAdmin();
  const status = String(form.get("status") || "BLOCKED") as
    | "AVAILABLE"
    | "OCCUPIED"
    | "OUT_OF_SERVICE"
    | "MAINTENANCE"
    | "BLOCKED";
  const categoryId = String(form.get("categoryId") || "") || null,
    active = form.get("active") === "on",
    roomNumber = String(form.get("roomNumber") || "").trim(),
    floor = String(form.get("floor") || "").trim(),
    notes = String(form.get("notes") || "").trim();
  if (
    ![
      "AVAILABLE",
      "OCCUPIED",
      "OUT_OF_SERVICE",
      "MAINTENANCE",
      "BLOCKED",
    ].includes(status) ||
    !roomNumber ||
    roomNumber.length > 80 ||
    floor.length > 80 ||
    notes.length > 2000 ||
    (active && !categoryId)
  )
    throw new Error("Check room details and category.");
  await prisma.$transaction(async (db) => {
    await lock(db);
    await expire(db);
    const current = await db.room.findUniqueOrThrow({ where: { id } });
    const pending = await db.reservation.count({
      where: {
        roomId: id,
        status: { in: ["PENDING", "CONFIRMED", "CHECKED_IN"] },
        checkOut: { gt: new Date() },
      },
    });
    if (
      pending &&
      (current.categoryId !== categoryId ||
        !active ||
        !["AVAILABLE", "OCCUPIED"].includes(status))
    )
      throw new Error(
        "Move existing bookings before reassigning or blocking this room.",
      );
    if (categoryId)
      await db.roomCategory.findUniqueOrThrow({ where: { id: categoryId } });
    await db.room.update({
      where: { id },
      data: {
        roomNumber,
        floor: floor || null,
        notes: notes || null,
        categoryId,
        status,
        active,
      },
    });
    await db.bookingAudit.create({
      data: {
        actor: session.email,
        action: "update room inventory",
        target: id,
      },
    });
  });
  revalidatePath("/admin/rooms");
  revalidatePath("/stay");
}
export async function updateCategory(id: string, form: FormData) {
  const session = await requireAdmin(),
    raw = String(form.get("baseRate") || "").trim(),
    max = String(form.get("maxGuests") || "").trim(),
    rate = raw ? Number(raw) : null,
    capacity = max ? Number(max) : null,
    active = form.get("active") === "on";
  if (
    (rate !== null && (!Number.isFinite(rate) || rate <= 0 || rate > 100000)) ||
    (capacity !== null &&
      (!Number.isInteger(capacity) || capacity < 1 || capacity > 20)) ||
    (active && (!rate || !capacity))
  )
    throw new Error(
      "Active categories need a positive rate and a capacity of 1–20.",
    );
  await prisma.$transaction(async (db) => {
    await lock(db);
    await db.roomCategory.update({
      where: { id },
      data: { baseRate: rate, maxGuests: capacity, active },
    });
    await db.bookingAudit.create({
      data: {
        actor: session.email,
        action: "update category test rate",
        target: id,
      },
    });
  });
  revalidatePath("/admin/rooms");
  revalidatePath("/stay");
}
