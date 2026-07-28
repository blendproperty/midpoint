import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  // Generous limit — a real visitor can rack up a lot of page views quickly
  // just by browsing normally. This is only here to stop a scripted flood
  // from an individual IP from filling up the PageView table.
  const remoteIp = getClientIp(req);
  if (!checkRateLimit(`pageview:${remoteIp}`, 120, 60 * 1000)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  try {
    const { path } = await req.json();
    if (typeof path === "string" && path && !path.startsWith("/admin")) {
      await prisma.pageView.create({ data: { path: path.slice(0, 255) } });
    }
  } catch {
    // Page-view tracking must never break the page — swallow any error.
  }
  return NextResponse.json({ ok: true });
}
