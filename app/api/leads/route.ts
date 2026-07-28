import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { upsertContact } from "@/lib/contacts";

// Lets other Blend Property Group sites push a lead into this same Contacts
// table, so the leasing team has one place to work from even before a
// separate group-wide CRM exists. Protect with an API key: set
// LEADS_API_KEY in the environment and share it only with trusted
// server-to-server callers (e.g. another site's own backend or its n8n
// workflow) — never expose it in a browser or a public repo.
//
// Expected JSON body: { email, firstName?, lastName?, phone?, source?,
// interest?, message? }. `source` should identify the calling site (e.g.
// "listings.blendproperty.co.za") so leads stay distinguishable by origin.
export async function POST(req: Request) {
  const apiKey = req.headers.get("x-api-key");
  const expectedKey = process.env.LEADS_API_KEY;

  if (!expectedKey) {
    return NextResponse.json({ error: "Leads API is not configured" }, { status: 503 });
  }
  if (apiKey !== expectedKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = await req.json();
  const email = payload?.email ? String(payload.email).trim() : "";
  const firstName = payload?.firstName ? String(payload.firstName).trim() : "";
  const lastName = payload?.lastName ? String(payload.lastName).trim() : "";
  const phone = payload?.phone ? String(payload.phone) : null;
  const source = payload?.source ? String(payload.source).trim() : "External";

  if (!email) {
    return NextResponse.json({ error: "email is required" }, { status: 400 });
  }

  const contact = await upsertContact({ email, firstName, lastName, phone, source });

  if (payload?.message || payload?.interest) {
    await prisma.enquiry.create({
      data: {
        firstName: firstName || null,
        lastName: lastName || null,
        email: email.toLowerCase(),
        phone,
        interest: payload?.interest ? String(payload.interest) : null,
        message: payload?.message ? String(payload.message) : null,
        sourcePath: source,
        contactId: contact.id,
      },
    });
  }

  return NextResponse.json({ ok: true, contactId: contact.id });
}
