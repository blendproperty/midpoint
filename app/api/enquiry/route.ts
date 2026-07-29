import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { upsertContact } from "@/lib/contacts";
import { pushLeadToListings } from "@/lib/listings-leads";
import { pushLeadToBlendCrm } from "@/lib/blend-crm-leads";

// Set N8N_ENQUIRY_WEBHOOK in the environment, e.g.
// https://n8n.srv938083.hstgr.cloud/webhook/midpoint-enquiry
export async function POST(req: Request) {
  const remoteIp = getClientIp(req);

  // A real visitor submits this form once, maybe twice. 5 per 15 minutes per
  // IP comfortably covers retries/typos while still blocking a spam script
  // hammering the endpoint.
  if (!checkRateLimit(`enquiry:${remoteIp}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many enquiries submitted. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  const payload = await req.json();

  const firstName = payload?.firstName ? String(payload.firstName).trim() : "";
  const lastName = payload?.lastName ? String(payload.lastName).trim() : "";
  const email = payload?.email ? String(payload.email).trim() : "";
  const phone = payload?.phone ? String(payload.phone) : null;

  // NOTE: this previously checked `payload.name`, which ContactForm never
  // sends (it sends firstName/lastName) — meaning every submission was
  // silently rejected with a 400 before reaching the webhook. Fixed here.
  if (!email || (!firstName && !lastName)) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  // Server-side reCAPTCHA check — ContactForm already refuses to submit
  // without a client-side token, but that alone is trivially bypassable by
  // anyone posting directly to this endpoint. This re-verifies the token
  // against Google before the enquiry is ever logged or forwarded.
  const captchaToken = payload?.["g-recaptcha-response"]
    ? String(payload["g-recaptcha-response"])
    : "";
  const captchaOk = await verifyRecaptcha(captchaToken, remoteIp);
  if (!captchaOk) {
    return NextResponse.json(
      { error: "reCAPTCHA verification failed. Please try again." },
      { status: 400 }
    );
  }

  // Upsert into the CRM's Contact table first (deduped by email) so this
  // enquiry links to a person's full history rather than sitting as an
  // isolated row.
  let contactId: string | null = null;
  try {
    const contact = await upsertContact({ email, firstName, lastName, phone, source: "Midpoint" });
    contactId = contact.id;
  } catch (err) {
    console.error("Failed to upsert contact", err);
  }

  // Log every valid enquiry to the database first, independent of whether the
  // n8n webhook succeeds, so nothing is lost if that integration is briefly
  // down. Visible in /admin/enquiries, /admin/contacts, and the dashboard.
  let enquiryId: string | null = null;
  try {
    const enquiry = await prisma.enquiry.create({
      data: {
        firstName: firstName || null,
        lastName: lastName || null,
        email,
        phone,
        interest: payload?.interest ? String(payload.interest) : null,
        message: payload?.message ? String(payload.message) : null,
        sourcePath: payload?.sourcePath ? String(payload.sourcePath) : null,
        contactId,
      },
    });
    enquiryId = enquiry.id;
  } catch (err) {
    console.error("Failed to log enquiry to database", err);
  }

  // The Midpoint dashboard and Blend CRM are separate systems. Forward the
  // database-backed enquiry directly to Blend CRM and use the Midpoint
  // enquiry ID as the deduplication key so retries cannot create two leads.
  if (enquiryId) {
    await pushLeadToBlendCrm({
      externalId: enquiryId,
      email,
      firstName,
      lastName,
      phone,
      interest: payload?.interest ? String(payload.interest) : null,
      message: payload?.message ? String(payload.message) : null,
      sourcePath: payload?.sourcePath ? String(payload.sourcePath) : null,
    });
  }

  // Best-effort push to Blend's group-wide leads system (listings.blendproperty.co.za).
  // No-op if LISTINGS_LEADS_URL/LISTINGS_LEADS_API_KEY aren't configured, and
  // never awaited into the response — this enquiry is already safely logged
  // above regardless of whether this succeeds.
  pushLeadToListings({
    email,
    firstName,
    lastName,
    phone,
    interest: payload?.interest ? String(payload.interest) : null,
    message: payload?.message ? String(payload.message) : null,
  });

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
