import { NextResponse } from "next/server";
import { listRedirectRules } from "@/lib/redirects";

// Internal-only: fetched by middleware.ts to refresh its in-memory redirect
// cache (at most once every 60s), never called per visitor request. Just a
// list of path -> path mappings, nothing sensitive, so no auth gate —
// consistent with this being infrastructure the middleware itself needs,
// same trust level as robots.txt/sitemap.xml.
export async function GET() {
  const rules = await listRedirectRules();
  return NextResponse.json(rules);
}
