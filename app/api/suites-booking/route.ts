import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { upsertContact } from "@/lib/contacts";

function clean(value: unknown, max = 500) { return typeof value === "string" ? value.trim().slice(0, max) : ""; }

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`suites-booking:${ip}`, 5, 15 * 60 * 1000)) return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  const body = await request.json().catch(() => null);
  if (!body || clean(body.website)) return NextResponse.json({ ok: true });
  const firstName = clean(body.firstName, 80), lastName = clean(body.lastName, 80);
  const email = clean(body.email, 200), phone = clean(body.phone, 50);
  const checkIn = clean(body.checkIn, 10), checkOut = clean(body.checkOut, 10);
  const guests = Number(body.guests);
  if (!firstName || !lastName || !email.includes("@") || !phone || !body.consent || !/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut) || checkOut <= checkIn || guests < 1 || guests > 4) {
    return NextResponse.json({ error: "Please check the booking details." }, { status: 400 });
  }
  const contact = await upsertContact({ email, firstName, lastName, phone, source: "The Suites at Midpoint" });
  const details = [`Requested stay: ${checkIn} to ${checkOut}`, `Guests: ${guests}`, clean(body.company, 150) ? `Company: ${clean(body.company, 150)}` : "", clean(body.message, 2000)].filter(Boolean).join("\n");
  let attribution: Prisma.InputJsonValue | undefined;
  if (body.attribution && typeof body.attribution === "object") {
    const encoded = JSON.stringify(body.attribution);
    if (encoded.length <= 10_000) attribution = JSON.parse(encoded) as Prisma.InputJsonValue;
  }
  const enquiry = await prisma.enquiry.create({ data: { firstName, lastName, email, phone, interest: "The Suites at Midpoint — booking request", message: details, sourcePath: clean(body.sourcePath, 500), attribution, contactId: contact.id } });
  return NextResponse.json({ ok: true, enquiryId: enquiry.id });
}
