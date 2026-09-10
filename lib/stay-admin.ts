import { prisma } from "@/lib/prisma";
import { lock, expire, roomWhere, configFor } from "@/lib/stay-service";
import { quoteStay, stayDates, day } from "@/lib/stay-pricing";
import type { Prisma, ReservationStatus } from "@prisma/client";
export async function changeReservation(
  id: string,
  action: string,
  actor: string,
  values: { roomId?: string; checkIn?: string; checkOut?: string } = {},
) {
  return prisma.$transaction(
    async (db) => {
      await lock(db);
      await expire(db);
      const r = await db.reservation.findFirst({
        where: { id, isTest: true },
        include: { category: true },
      });
      if (!r) throw new Error("Test booking not found.");
      const transitions: Record<
        string,
        { from: string[]; to: ReservationStatus }
      > = {
        checkin: { from: ["CONFIRMED"], to: "CHECKED_IN" },
        checkout: { from: ["CHECKED_IN"], to: "CHECKED_OUT" },
        cancel: { from: ["PENDING", "CONFIRMED"], to: "CANCELLED" },
        noshow: { from: ["CONFIRMED"], to: "NO_SHOW" },
      };
      if (action === "settle") {
        if (
          !["CONFIRMED", "CHECKED_IN", "CHECKED_OUT"].includes(r.status) ||
          r.paymentStatus !== "UNPAID"
        )
          throw new Error(
            "Only unpaid confirmed test bookings can be settled.",
          );
        await db.reservation.update({
          where: { id },
          data: { paymentStatus: "PAID" },
        });
      } else if (action === "move") {
        if (!["PENDING", "CONFIRMED"].includes(r.status))
          throw new Error("Only upcoming bookings can be moved.");
        const checkIn = values.checkIn || r.checkIn.toISOString().slice(0, 10),
          checkOut = values.checkOut || r.checkOut.toISOString().slice(0, 10);
        const stay = stayDates(checkIn, checkOut);
        const target = await db.room.findFirst({
          where: {
            id: values.roomId,
            ...roomWhere(r.categoryId, stay.start, stay.end, r.id),
          },
        });
        if (!target)
          throw new Error(
            "The selected room is occupied, blocked, or belongs to another category.",
          );
        const snap = r.snapshot as unknown as {
          attribution?: Prisma.InputJsonValue;
          quote: { code: string; extras: { id: string }[] };
          booker: Prisma.InputJsonValue;
        };
        const quote = quoteStay(
          r.category,
          checkIn,
          checkOut,
          r.adults,
          snap.quote.code,
          snap.quote.extras.map((e) => e.id),
          await configFor(db),
        );
        // Test payment balances are reset when an amendment changes the amount.
        await db.reservation.update({
          where: { id },
          data: {
            roomId: target.id,
            checkIn: stay.start,
            checkOut: stay.end,
            subtotal: quote.roomCents / 100,
            taxes: quote.vatCents / 100,
            rate: quote.roomCents / 100 / quote.nights,
            extrasTotal: (quote.extrasCents + quote.cleaningCents) / 100,
            total: quote.totalCents / 100,
            paymentStatus:
              Number(r.total) !== quote.totalCents / 100
                ? "UNPAID"
                : r.paymentStatus,
            snapshot: {
              quote,
              attribution: snap.attribution || {},
              booker: snap.booker,
            } as unknown as Prisma.InputJsonValue,
          },
        });
      } else {
        const rule = transitions[action];
        if (!rule || !rule.from.includes(r.status))
          throw new Error("This status change is not allowed.");
        await db.reservation.update({
          where: { id },
          data: {
            status: rule.to,
            cancellationRequested: false,
            ...(action === "cancel" && r.paymentStatus === "PAID"
              ? { paymentStatus: "REFUNDED" as const }
              : {}),
          },
        });
        if (action === "cancel")
          await db.bookingMessage.create({
            data: {
              reservationId: id,
              subject: "Test cancellation — " + r.bookingReference,
              body:
                "Your test reservation " +
                r.bookingReference +
                " has been cancelled. Any paid test amount is marked refunded. No real money was transferred.",
            },
          });
      }
      await db.bookingAudit.create({
        data: { actor, action: "admin " + action, target: id },
      });
    },
    { timeout: 15000 },
  );
}
export async function blockRoom(
  roomId: string,
  from: string,
  to: string,
  reason: string,
  actor: string,
) {
  const start = day(from),
    end = day(to);
  if (end <= start || !reason.trim() || reason.length > 300)
    throw new Error("Enter dates and a reason.");
  return prisma.$transaction(async (db) => {
    await lock(db);
    await expire(db);
    const room = await db.room.findUnique({ where: { id: roomId } });
    if (!room) throw new Error("Room not found.");
    const conflict = await db.reservation.count({
      where: {
        roomId,
        status: { in: ["PENDING", "CONFIRMED", "CHECKED_IN"] },
        checkIn: { lt: end },
        checkOut: { gt: start },
      },
    });
    if (conflict)
      throw new Error(
        "Move or cancel the overlapping booking before blocking this room.",
      );
    await db.roomBlock.create({
      data: { roomId, start, end, reason: reason.trim() },
    });
    await db.bookingAudit.create({
      data: { actor, action: "maintenance block", target: roomId },
    });
  });
}
