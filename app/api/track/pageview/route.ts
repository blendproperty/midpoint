import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
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
