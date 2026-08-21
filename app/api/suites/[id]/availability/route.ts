import { NextRequest, NextResponse } from "next/server";
import { checkAvailability } from "@/lib/bookings";
import { hasSuitesPreviewAccess } from "@/lib/suites-preview";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await hasSuitesPreviewAccess())) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const checkIn = new Date(body.checkIn);
  const checkOut = new Date(body.checkOut);

  if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
    return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
  }

  const result = await checkAvailability(id, checkIn, checkOut);
  return NextResponse.json(result);
}
