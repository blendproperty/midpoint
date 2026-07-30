import { NextResponse } from "next/server";
import { getSiteSettings } from "@/lib/site-settings";

// Internal-only: fetched by middleware.ts to refresh its in-memory
// IndexNow-key cache (at most once every 60s), never called per visitor
// request. Just the key string itself, nothing sensitive — the whole point
// of the key is that it's publicly hosted at <domain>/<key>.txt anyway,
// same trust level as robots.txt/sitemap.xml. Same pattern as
// /api/redirects/all, which middleware.ts already uses this way.
export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json({ key: settings.indexNowKey });
}
