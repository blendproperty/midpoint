import { NextResponse } from "next/server";

// Set N8N_ENQUIRY_WEBHOOK in the environment, e.g.
// https://n8n.srv938083.hstgr.cloud/webhook/midpoint-enquiry
export async function POST(req: Request) {
  const payload = await req.json();

  if (!payload?.name || !payload?.email) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const webhook = process.env.N8N_ENQUIRY_WEBHOOK;
  if (!webhook) {
    console.error("N8N_ENQUIRY_WEBHOOK is not set");
    return NextResponse.json({ error: "Form endpoint not configured." }, { status: 500 });
  }

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
    return NextResponse.json({ error: "Upstream error." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
