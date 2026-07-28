import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Set N8N_ENQUIRY_WEBHOOK in the environment, e.g.
// https://n8n.srv938083.hstgr.cloud/webhook/midpoint-enquiry
export async function POST(req: Request) {
  const payload = await req.json();

  const firstName = payload?.firstName ? String(payload.firstName).trim() : "";
  const lastName = payload?.lastName ? String(payload.lastName).trim() : "";
  const email = payload?.email ? String(payload.email).trim() : "";

  // NOTE: this previously checked `payload.name`, which ContactForm never
  // sends (it sends firstName/lastName) — meaning every submission was
  // silently rejected with a 400 before reaching the webhook. Fixed here.
  if (!email || (!firstName && !lastName)) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  // Log every valid enquiry to the database first, independent of whether the
  // n8n webhook succeeds, so nothing is lost if that integration is briefly
  // down. Visible in /admin/enquiries and the dashboard.
  try {
    await prisma.enquiry.create({
      data: {
        firstName: firstName || null,
        lastName: lastName || null,
        email,
        phone: payload?.phone ? String(payload.phone) : null,
        interest: payload?.interest ? String(payload.interest) : null,
        message: payload?.message ? String(payload.message) : null,
        sourcePath: payload?.sourcePath ? String(payload.sourcePath) : null,
      },
    });
  } catch (err) {
    console.error("Failed to log enquiry to database", err);
  }

  const webhook = process.env.N8N_ENQUIRY_WEBHOOK;
  if (!webhook) {
    console.error("N8N_ENQUIRY_WEBHOOK is not set");
    // Still return ok — the enquiry was captured in the database even if the
    // downstream webhook isn't configured.
    return NextResponse.json({ ok: true, webhook: false });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "mid-point.co.za",
        submittedAt: new Date().toISOString(),
        ...payload
      })
    });
    if (!res.ok) {
      return NextResponse.json({ ok: true, webhook: false });
    }
  } catch (err) {
    console.error("Failed to forward enquiry to n8n webhook", err);
    return NextResponse.json({ ok: true, webhook: false });
  }

  return NextResponse.json({ ok: true, webhook: true });
}
