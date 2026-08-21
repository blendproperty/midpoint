import { NextRequest, NextResponse } from "next/server";
import { createHold } from "@/lib/bookings";
import { hasSuitesPreviewAccess } from "@/lib/suites-preview";

export async function POST(req: NextRequest) {
  if (!(await hasSuitesPreviewAccess())) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const body = await req.json();
  const checkIn = new Date(body.checkIn);
  const checkOut = new Date(body.checkOut);

  if (
    Number.isNaN(checkIn.getTime()) ||
    Number.isNaN(checkOut.getTime()) ||
    !body.guestName ||
    !body.guestEmail
  ) {
    return NextResponse.json({ ok: false, reason: "Missing required fields." }, { status: 400 });
  }

  const result = await createHold({
    suiteId: body.suiteId,
    checkIn,
    checkOut,
    guestName: body.guestName,
    guestEmail: body.guestEmail,
    guestPhone: body.guestPhone || undefined,
    company: body.company || undefined,
    totalAmount: Number(body.totalAmount) || 0,
  });

  // NOTE: intentionally does not initiate any payment or redirect to
  // Netcash here. A real implementation would, at this point, redirect the
  // guest to the Netcash hosted checkout using this booking's id/paymentRef
  // — that step is not implemented in this preview build.
  return NextResponse.json(result);
}
