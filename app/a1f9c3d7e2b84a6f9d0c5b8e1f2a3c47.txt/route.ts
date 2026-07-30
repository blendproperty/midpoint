import { NextResponse } from "next/server";
import { DEFAULT_INDEXNOW_KEY } from "@/lib/indexnow-key";

// Static fallback for the key-ownership file IndexNow requires at
// <domain>/<key>.txt, hardcoded to the default key so it keeps working even
// if the database is briefly unreachable. If an editor sets a *different*
// key in /admin/settings, middleware.ts serves the correct file for that
// new key dynamically — this static route only ever answers requests for
// the original default key's exact filename.
export async function GET() {
  return new NextResponse(DEFAULT_INDEXNOW_KEY, {
    headers: { "Content-Type": "text/plain" },
  });
}
