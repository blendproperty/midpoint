import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { upsertContact } from "@/lib/contacts";
import { pushLeadToListings } from "@/lib/listings-leads";
import { pushLeadToBlendCrm } from "@/lib/blend-crm-leads";
import { validateCompany } from "@/lib/company-validation";
import { validateBusinessEmail, JOB_ENQUIRY_ERROR, isJobEnquiry, LEASING_SPACE_TYPES, LEASING_MOVE_IN_OPTIONS } from "@/lib/leasing-enquiry-validation";
import type { Prisma } from "@prisma/client";

function trimmedText(value: unknown, maxLength: number) {
  return typeof value === "string" && value.length <= maxLength ? value.trim() : "";
}

function safeAttribution(value: unknown): Prisma.InputJsonValue | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const json = JSON.stringify(value);
  if (json.length > 10_000) return undefined;
  try { return JSON.parse(json) as Prisma.InputJsonValue; } catch { return undefined; }
}

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

  let payload;
  try { payload = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid enquiry." }, { status: 400 });
  }
  const { company, error: companyError } = validateCompany(payload?.company);
  if (companyError) {
    return NextResponse.json({ error: companyError, field: "company" }, { status: 400 });
  }

  const { email, error: emailError } = validateBusinessEmail(payload?.email);
  if (emailError) {
    return NextResponse.json({ error: emailError, field: "email" }, { status: 400 });
  }
  if (isJobEnquiry(payload?.message)) {
    return NextResponse.json({ error: JOB_ENQUIRY_ERROR, field: "message" }, { status: 400 });
  }
  const firstName = trimmedText(payload?.firstName, 100);
  const lastName = trimmedText(payload?.lastName, 100);
  const phone = trimmedText(payload?.phone, 40);
  const interest = trimmedText(payload?.interest, 40);
  const size = trimmedText(payload?.spaceSize, 120);
  const moveIn = trimmedText(payload?.moveIn, 40);
  const description = trimmedText(payload?.message, 2000);
  if (!firstName || !lastName || !phone || !LEASING_SPACE_TYPES.includes(interest) ||
      !size || !LEASING_MOVE_IN_OPTIONS.includes(moveIn) || !description || payload?.consent !== "on") {
    return NextResponse.json({ error: "Complete all contact and space fields, add a message, and accept the privacy policy." }, { status: 400 });
  }

  const property = trimmedText(payload?.spaceName, 200);
  const message = [property && "Property: " + property, "Approximate size or desks: " + size, "Move-in timing: " + moveIn, description].filter(Boolean).join("\n\n");
  const attribution = safeAttribution(payload?.attribution);

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
    const contact = await upsertContact({ email, firstName, lastName, phone, company, source: "Midpoint" });
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
        firstName,
        lastName,
        email,
        company,
        phone,
        interest,
        message,
        sourcePath: payload?.sourcePath ? String(payload.sourcePath) : null,
        attribution,
        contactId,
      },
    });
    enquiryId = enquiry.id;
  } catch (err) {
    console.error("Failed to log enquiry to database", err);
  }

  if (!enquiryId) {
    return NextResponse.json(
      { ok: false, error: "The enquiry could not be saved. Please try again." },
      { status: 500 }
    );
  }

  // The Midpoint dashboard and Blend CRM are separate systems. Forward the
  // database-backed enquiry directly to Blend CRM and use the Midpoint
  // enquiry ID as the deduplication key so retries cannot create two leads.
  const crmDelivered = await pushLeadToBlendCrm({
    externalId: enquiryId,
    email,
    company,
    firstName,
    lastName,
    phone,
    interest,
    message,
    sourcePath: payload?.sourcePath ? String(payload.sourcePath) : null,
    attribution,
  });

  // Best-effort push to Blend's group-wide leads system (listings.blendproperty.co.za).
  // No-op if LISTINGS_LEADS_URL/LISTINGS_LEADS_API_KEY aren't configured, and
  // never awaited into the response — this enquiry is already safely logged
  // above regardless of whether this succeeds.
  pushLeadToListings({
    email,
    company,
    firstName,
    lastName,
    phone,
    interest,
    message,
  });

  const webhook = process.env.N8N_ENQUIRY_WEBHOOK;
  if (!webhook) {
    console.error("N8N_ENQUIRY_WEBHOOK is not set");
    // Still return ok — the enquiry was captured in the database even if the
    // downstream webhook isn't configured.
    return NextResponse.json({ ok: true, enquiryId, crmDelivered, webhook: false });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      signal: AbortSignal.timeout(8000),
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "mid-point.co.za",
        submittedAt: new Date().toISOString(),
        ...payload,
        company,
        email,
        firstName,
        lastName,
        phone,
        interest,
        spaceSize: size,
        moveIn,
        message
      })
    });
    if (!res.ok) {
      return NextResponse.json({ ok: true, enquiryId, crmDelivered, webhook: false });
    }
  } catch (err) {
    console.error("Failed to forward enquiry to n8n webhook", err);
    return NextResponse.json({ ok: true, enquiryId, crmDelivered, webhook: false });
  }

  return NextResponse.json({ ok: true, enquiryId, crmDelivered, webhook: true });
}
