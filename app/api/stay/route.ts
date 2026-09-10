import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { isStagingHost } from "@/lib/staging-host";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  reserve,
  validateInput,
  owned,
  payTest,
  requestCancellation,
  configFor,
  digest,
} from "@/lib/stay-service";
import { quoteStay } from "@/lib/stay-pricing";
export const dynamic = "force-dynamic";
const cookie = "suite_test_access";
const options = {
  httpOnly: true,
  sameSite: "strict" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};
const reply = (body: unknown, status = 200) =>
  NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
export async function GET(req: Request) {
  if (!(await isStagingHost())) return reply({ error: "Not found" }, 404);
  const url = new URL(req.url),
    reference = url.searchParams.get("reference") || "";
  const token = (await cookies()).get(cookie)?.value || "";
  const r = await owned(reference, token);
  if (!r)
    return reply(
      { error: "Booking not found. Retrieve it using Manage booking." },
      404,
    );
  return reply({
    reference: r.bookingReference,
    category: r.category.name,
    checkIn: r.checkIn,
    checkOut: r.checkOut,
    guests: r.adults,
    firstName: r.guestFirstName,
    lastName: r.guestLastName,
    email: r.guestEmail,
    status: r.status,
    paymentStatus: r.paymentStatus,
    total: Number(r.total),
    expiresAt: r.expiresAt,
    snapshot: r.snapshot,
    cancellationRequested: r.cancellationRequested,
    messages: r.messages.map((m) => ({
      subject: m.subject,
      body: m.body,
      delivery: m.delivery,
    })),
    test: true,
  });
}
export async function POST(req: Request) {
  if (!(await isStagingHost())) return reply({ error: "Not found" }, 404);
  const origin = req.headers.get("origin");
  const publicHost = (
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    new URL(req.url).host
  )
    .split(",")[0]
    .trim();
  if (origin && new URL(origin).host !== publicHost)
    return reply({ error: "Invalid origin" }, 403);
  if (!checkRateLimit("stay:" + getClientIp(req), 40, 15 * 60000))
    return reply({ error: "Too many requests. Try again later." }, 429);
  try {
    const raw = await req.text();
    if (raw.length > 16000) return reply({ error: "Request too large" }, 413);
    const b = JSON.parse(raw);
    const store = await cookies();
    let token = store.get(cookie)?.value || "";
    switch (b.action) {
      case "quote": {
        const c = await prisma.roomCategory.findFirst({
          where: { id: String(b.categoryId), active: true },
        });
        if (!c) throw new Error("Room unavailable.");
        return reply({
          quote: quoteStay(
            c,
            String(b.checkIn),
            String(b.checkOut),
            Number(b.guests),
            String(b.code || ""),
            Array.isArray(b.extras) ? b.extras : [],
            await configFor(),
          ),
        });
      }
      case "reserve": {
        if (!token) {
          token = randomBytes(24).toString("hex");
          store.set(cookie, token, options);
        }
        const result = await reserve(validateInput(b), token);
        return reply({
          reference: result.bookingReference,
          accessCode: token,
          test: true,
        });
      }
      case "lookup": {
        if (!checkRateLimit("stay-lookup:" + getClientIp(req), 8, 15 * 60000))
          return reply({ error: "Too many attempts. Try later." }, 429);
        const code = String(b.accessCode || "").trim(),
          reference = String(b.reference || "")
            .trim()
            .toUpperCase(),
          email = String(b.email || "")
            .trim()
            .toLowerCase();
        const r = await prisma.reservation.findFirst({
          where: {
            bookingReference: reference,
            guestEmail: email,
            accessHash: digest(code),
            isTest: true,
          },
        });
        if (!r || code.length < 32)
          return reply({ error: "The booking details do not match." }, 404);
        store.set(cookie, code, options);
        return reply({ reference });
      }
      case "pay": {
        if (!["success", "declined", "corporate"].includes(b.outcome))
          throw new Error("Invalid test payment result.");
        const r = await payTest(String(b.reference), token, b.outcome);
        return reply({
          reference: r.bookingReference,
          status: r.status,
          declined: b.outcome === "declined",
        });
      }
      case "cancel":
        await requestCancellation(String(b.reference), token);
        return reply({ ok: true });
      default:
        return reply({ error: "Invalid action" }, 400);
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Request failed";
    return reply(
      {
        error:
          message.includes("Invalid") || message.includes("prisma")
            ? "We could not process this request. Check the details and try again."
            : message,
      },
      400,
    );
  }
}
