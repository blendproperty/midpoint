import { NextResponse } from "next/server";
import { recordRedirectHit } from "@/lib/redirects";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// Fire-and-forget from middleware.ts, only when a redirect rule actually
// matched the current request — not called on every page load. This route
// itself is still publicly reachable though, so rate-limit and bound the
// input to stop it being used to pollute hit-count analytics.
export async function POST(req: Request) {
  if (!checkRateLimit(`redirects-hit:${getClientIp(req)}`, 60, 60 * 1000)) {
    return NextResponse.json({ ok: true });
  }

  const body = await req.json().catch(() => null);
  const fromPath = typeof body?.fromPath === "string" ? body.fromPath.slice(0, 2048) : null;
  if (fromPath) await recordRedirectHit(fromPath);
  return NextResponse.json({ ok: true });
}
