import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const HOLD_MINUTES = 15;

export type AvailabilityResult = {
  available: boolean;
  reason?: string;
};

// Fast-path check only, used to give the guest immediate feedback before
// they fill in the rest of the form. The database's EXCLUDE constraint
// (see prisma/migrations/20260821120000_add_suites_and_bookings) is what
// actually prevents two overlapping bookings from both succeeding — this
// function can say "available" and still lose a race to another request,
// which createHold() below handles.
export async function checkAvailability(
  suiteId: string,
  checkIn: Date,
  checkOut: Date
): Promise<AvailabilityResult> {
  if (checkOut <= checkIn) {
    return { available: false, reason: "Check-out must be after check-in." };
  }

  const overlapping = await prisma.booking.findFirst({
    where: {
      suiteId,
      status: { in: ["PENDING", "CONFIRMED"] },
      checkIn: { lt: checkOut },
      checkOut: { gt: checkIn },
    },
    select: { id: true },
  });

  return overlapping
    ? { available: false, reason: "Those dates are already held or booked." }
    : { available: true };
}

export async function expireStaleHolds(): Promise<number> {
  const result = await prisma.booking.updateMany({
    where: { status: "PENDING", expiresAt: { lt: new Date() } },
    data: { status: "EXPIRED" },
  });
  return result.count;
}

export type CreateHoldInput = {
  suiteId: string;
  checkIn: Date;
  checkOut: Date;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  company?: string;
  totalAmount: number;
  notes?: string;
};

export type CreateHoldResult =
  | { ok: true; bookingId: string }
  | { ok: false; reason: string };

// Creates a PENDING hold. In a live version this is the step that runs
// right before redirecting to Netcash; the hold's expiresAt gives the
// guest a HOLD_MINUTES window to complete payment before the slot frees
// up again. In this preview build nothing redirects anywhere real — see
// app/api/bookings/route.ts.
export async function createHold(input: CreateHoldInput): Promise<CreateHoldResult> {
  const preCheck = await checkAvailability(input.suiteId, input.checkIn, input.checkOut);
  if (!preCheck.available) {
    return { ok: false, reason: preCheck.reason ?? "Not available." };
  }

  try {
    const booking = await prisma.booking.create({
      data: {
        suiteId: input.suiteId,
        checkIn: input.checkIn,
        checkOut: input.checkOut,
        guestName: input.guestName,
        guestEmail: input.guestEmail,
        guestPhone: input.guestPhone,
        company: input.company,
        totalAmount: input.totalAmount,
        notes: input.notes,
        status: "PENDING",
        expiresAt: new Date(Date.now() + HOLD_MINUTES * 60 * 1000),
      },
      select: { id: true },
    });
    return { ok: true, bookingId: booking.id };
  } catch (err) {
    // Postgres raises 23P01 (exclusion_violation) when the EXCLUDE
    // constraint rejects an overlapping insert — i.e. someone else grabbed
    // these dates between our pre-check and this insert.
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.meta?.code === "23P01"
    ) {
      return { ok: false, reason: "Those dates were just booked by someone else." };
    }
    throw err;
  }
}

export async function confirmBooking(bookingId: string, paymentRef: string) {
  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CONFIRMED", paymentRef },
  });
}
