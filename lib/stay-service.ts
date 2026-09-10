import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { createHash, randomBytes } from "node:crypto";
import {
  defaultConfig,
  validateConfig,
  quoteStay,
  stayDates,
  type StayQuote,
} from "@/lib/stay-pricing";

export type Tx = Prisma.TransactionClient;
export const digest = (v: string) =>
  createHash("sha256").update(v).digest("hex");
export async function configFor(db: Tx = prisma) {
  const row = await db.bookingConfig.findUnique({ where: { id: "staging" } });
  return row ? validateConfig(row.data) : defaultConfig;
}
export async function lock(db: Tx) {
  await db.$queryRaw`SELECT pg_advisory_xact_lock(741819)::text`;
}
export async function expire(db: Tx) {
  await db.reservation.updateMany({
    where: { isTest: true, status: "PENDING", expiresAt: { lt: new Date() } },
    data: { status: "CANCELLED" },
  });
}
export function roomWhere(
  categoryId: string,
  start: Date,
  end: Date,
  exceptId?: string,
) {
  return {
    categoryId,
    active: true,
    status: { in: ["AVAILABLE", "OCCUPIED"] as ("AVAILABLE" | "OCCUPIED")[] },
    blocks: { none: { start: { lt: end }, end: { gt: start } } },
    reservations: {
      none: {
        id: exceptId ? { not: exceptId } : undefined,
        status: {
          in: ["PENDING", "CONFIRMED", "CHECKED_IN"] as (
            | "PENDING"
            | "CONFIRMED"
            | "CHECKED_IN"
          )[],
        },
        checkIn: { lt: end },
        checkOut: { gt: start },
        OR: [
          { status: { not: "PENDING" as const } },
          { expiresAt: null },
          { expiresAt: { gte: new Date() } },
        ],
      },
    },
  };
}
export async function searchStay(
  checkIn: string,
  checkOut: string,
  guests: number,
  code = "",
) {
  const stay = stayDates(checkIn, checkOut),
    config = await configFor();
  const categories = await prisma.roomCategory.findMany({
    where: { active: true },
    orderBy: { code: "asc" },
  });
  const rows = await Promise.all(
    categories.map(async (category) => {
      let quote: StayQuote;
      try {
        quote = quoteStay(
          category,
          checkIn,
          checkOut,
          guests,
          code,
          [],
          config,
        );
      } catch (e) {
        return {
          category,
          available: 0,
          quote: null,
          reason: (e as Error).message,
        };
      }
      const available = await prisma.room.count({
        where: roomWhere(category.id, stay.start, stay.end),
      });
      return {
        category,
        available,
        quote,
        reason: available ? "" : "Sold out for these dates",
      };
    }),
  );
  return { rows, config };
}
type BookingAttribution = {
  firstTouch?: { source: string; medium: string; campaign: string };
  lastTouch?: { source: string; medium: string; campaign: string };
};
function attribution(value: unknown): BookingAttribution {
  const result: BookingAttribution = {};
  if (!value || typeof value !== "object") return result;
  for (const key of ["firstTouch", "lastTouch"] as const) {
    const touch = (value as Record<string, unknown>)[key];
    if (touch && typeof touch === "object") {
      const t = touch as Record<string, unknown>;
      result[key] = {
        source: String(t.source || "direct").slice(0, 100),
        medium: String(t.medium || "none").slice(0, 100),
        campaign: String(t.campaign || "").slice(0, 200),
      };
    }
  }
  return result;
}
export type BookingInput = {
  attribution?: BookingAttribution;
  categoryId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  code: string;
  extras: string[];
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  country: string;
  company: string;
  vatNumber: string;
  poNumber: string;
  costCentre: string;
  guestFirstName: string;
  guestLastName: string;
  requests: string;
  consent: boolean;
  idempotencyKey: string;
};
function text(value: unknown, max: number, required = false) {
  if (
    typeof value !== "string" ||
    (required && !value.trim()) ||
    value.length > max
  )
    throw new Error("Check your guest details.");
  return value.trim();
}
export function validateInput(body: Record<string, unknown>): BookingInput {
  const firstName = text(body.firstName, 80, true),
    lastName = text(body.lastName, 80, true),
    email = text(body.email, 200, true).toLowerCase(),
    mobile = text(body.mobile, 30, true);
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !/^\+?[0-9 ()-]{7,30}$/.test(mobile) ||
    body.consent !== true
  )
    throw new Error(
      "Enter a valid email and mobile, and accept the test booking terms.",
    );
  if (
    !Array.isArray(body.extras) ||
    body.extras.length > 30 ||
    !body.extras.every((x) => typeof x === "string")
  )
    throw new Error("Invalid extras.");
  const key = text(body.idempotencyKey, 100, true);
  if (!/^[a-zA-Z0-9-]{16,100}$/.test(key))
    throw new Error("Invalid checkout session.");
  return {
    attribution: attribution(body.attribution),
    categoryId: text(body.categoryId, 100, true),
    checkIn: text(body.checkIn, 10, true),
    checkOut: text(body.checkOut, 10, true),
    guests: Number(body.guests),
    code: text(body.code || "", 30),
    extras: body.extras as string[],
    firstName,
    lastName,
    email,
    mobile,
    country: text(body.country, 80, true),
    company: text(body.company || "", 150),
    vatNumber: text(body.vatNumber || "", 50),
    poNumber: text(body.poNumber || "", 100),
    costCentre: text(body.costCentre || "", 100),
    guestFirstName: text(body.guestFirstName || firstName, 80, true),
    guestLastName: text(body.guestLastName || lastName, 80, true),
    requests: text(body.requests || "", 2000),
    consent: true,
    idempotencyKey: key,
  };
}
export async function reserve(input: BookingInput, accessToken: string) {
  return prisma.$transaction(
    async (db) => {
      await lock(db);
      await expire(db);
      const existing = await db.reservation.findUnique({
        where: { idempotencyKey: input.idempotencyKey },
      });
      if (existing) {
        if (existing.accessHash !== digest(accessToken))
          throw new Error("Checkout session already used.");
        return existing;
      }
      const category = await db.roomCategory.findFirst({
        where: { id: input.categoryId, active: true },
      });
      if (!category) throw new Error("Room category unavailable.");
      const config = await configFor(db);
      const quote = quoteStay(
        category,
        input.checkIn,
        input.checkOut,
        input.guests,
        input.code,
        input.extras,
        config,
      );
      const stay = stayDates(input.checkIn, input.checkOut);
      const room = await db.room.findFirst({
        where: roomWhere(category.id, stay.start, stay.end),
        orderBy: { roomNumber: "asc" },
      });
      if (!room)
        throw new Error(
          "Unfortunately this room was just booked. Please select another available option.",
        );
      const reference =
        "TEST-" +
        new Date().toISOString().slice(2, 10).replaceAll("-", "") +
        "-" +
        randomBytes(5).toString("hex").toUpperCase();
      const result = await db.reservation.create({
        data: {
          bookingReference: reference,
          categoryId: category.id,
          roomId: room.id,
          checkIn: stay.start,
          checkOut: stay.end,
          adults: input.guests,
          guestFirstName: input.guestFirstName,
          guestLastName: input.guestLastName,
          guestEmail: input.email,
          guestMobile: input.mobile,
          company: input.company || null,
          notes: input.requests || null,
          isTest: true,
          status: "PENDING",
          paymentStatus: "UNPAID",
          expiresAt: new Date(Date.now() + 15 * 60000),
          accessHash: digest(accessToken),
          idempotencyKey: input.idempotencyKey,
          rate: quote.roomCents / 100 / quote.nights,
          subtotal: quote.roomCents / 100,
          taxes: quote.vatCents / 100,
          extrasTotal: (quote.extrasCents + quote.cleaningCents) / 100,
          total: quote.totalCents / 100,
          source: "staging-booking",
          snapshot: {
            quote,
            attribution: input.attribution || {},
            booker: {
              firstName: input.firstName,
              lastName: input.lastName,
              country: input.country,
              vatNumber: input.vatNumber,
              poNumber: input.poNumber,
              costCentre: input.costCentre,
            },
          } as unknown as Prisma.InputJsonValue,
        },
      });
      await db.bookingAudit.create({
        data: {
          actor: "guest",
          action: "test reservation held",
          target: result.id,
        },
      });
      return result;
    },
    { timeout: 15000 },
  );
}
export async function owned(reference: string, token: string) {
  if (!token || token.length > 200) return null;
  return prisma.reservation.findFirst({
    where: {
      bookingReference: reference,
      accessHash: digest(token),
      isTest: true,
    },
    include: { category: true, messages: { orderBy: { createdAt: "desc" } } },
  });
}
export async function payTest(
  reference: string,
  token: string,
  outcome: "success" | "declined" | "corporate",
) {
  return prisma.$transaction(
    async (db) => {
      await lock(db);
      await expire(db);
      const r = await db.reservation.findFirst({
        where: {
          bookingReference: reference,
          accessHash: digest(token),
          isTest: true,
        },
        include: { category: true },
      });
      if (!r) throw new Error("Booking not found.");
      if (r.status === "CONFIRMED") return r;
      if (r.status !== "PENDING")
        throw new Error(
          "This hold has expired or was cancelled. Search again.",
        );
      if (outcome === "declined") {
        await db.bookingAudit.create({
          data: {
            actor: "test gateway",
            action: "payment declined",
            target: r.id,
          },
        });
        return r;
      }
      if (outcome === "corporate") {
        const config = await configFor(db),
          snap = r.snapshot as unknown as { quote: StayQuote };
        if (
          !r.company ||
          !config.codes.some((c) => c.corporate && c.code === snap.quote.code)
        )
          throw new Error(
            "Use a configured corporate code and company for this test option.",
          );
      }
      const next = await db.reservation.update({
        where: { id: r.id },
        data: {
          status: "CONFIRMED",
          expiresAt: null,
          paymentStatus: outcome === "corporate" ? "UNPAID" : "PAID",
        },
      });
      await db.bookingMessage.create({
        data: {
          reservationId: r.id,
          subject: "Test booking confirmed — " + reference,
          body:
            "THE SUITES AT MIDPOINT\n\nHello " +
            r.guestFirstName +
            ",\n\nYour TEST reservation is confirmed. No money has been charged and this is not a real accommodation reservation.\n\nReference: " +
            reference +
            "\nRoom: " +
            r.category.name +
            "\nArrival: " +
            r.checkIn.toISOString().slice(0, 10) +
            "\nDeparture: " +
            r.checkOut.toISOString().slice(0, 10) +
            "\nTotal: R" +
            Number(r.total).toFixed(2) +
            "\nPayment: " +
            next.paymentStatus +
            " (test)\n\nManage your stay on the staging website using your booking reference, email and private access code.\n\nThe Suites at Midpoint team",
        },
      });
      await db.bookingAudit.create({
        data: {
          actor: "test gateway",
          action:
            outcome === "corporate"
              ? "corporate test confirmed"
              : "test payment succeeded",
          target: r.id,
        },
      });
      return next;
    },
    { timeout: 15000 },
  );
}
export async function requestCancellation(reference: string, token: string) {
  return prisma.$transaction(async (db) => {
    await lock(db);
    const r = await db.reservation.findFirst({
      where: {
        bookingReference: reference,
        accessHash: digest(token),
        isTest: true,
      },
    });
    if (!r || !["PENDING", "CONFIRMED"].includes(r.status))
      throw new Error("This booking cannot be cancelled online.");
    await db.reservation.update({
      where: { id: r.id },
      data: { cancellationRequested: true },
    });
    await db.bookingAudit.create({
      data: { actor: "guest", action: "cancellation requested", target: r.id },
    });
  });
}
