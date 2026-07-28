import { NextResponse } from "next/server";
import { recordRedirectHit } from "@/lib/redirects";

// Fire-and-forget from middleware.ts, only when a redirect rule actually
// matched the current request — not called on every page load.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const fromPath = typeof body?.fromPath === "string" ? body.fromPath : null;
  if (fromPath) await recordRedirectHit(fromPath);
  return NextResponse.json({ ok: true });
}
