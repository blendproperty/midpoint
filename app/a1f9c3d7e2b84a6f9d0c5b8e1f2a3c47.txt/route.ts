import { NextResponse } from "next/server";
import { INDEXNOW_KEY } from "@/lib/indexnow";

// The key-ownership file IndexNow requires at <domain>/<key>.txt — must
// return exactly the key as plain text. See lib/indexnow.ts.
export async function GET() {
  return new NextResponse(INDEXNOW_KEY, {
    headers: { "Content-Type": "text/plain" },
  });
}
