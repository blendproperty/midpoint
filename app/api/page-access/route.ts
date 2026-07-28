import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { createPageAccessToken, pageAccessCookieName } from "@/lib/page-access";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// Verifies the password typed into a PageAccessGate form against whichever
// content type (Page or PillarPage) owns this id, and if correct, sets a
// signed, page-scoped unlock cookie valid for 24 hours. This route is
// intentionally public (not under /api/admin) — it's for site visitors, not
// signed-in admins.
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!checkRateLimit(`page-access:${ip}`, 10, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const pageId = body?.pageId ? String(body.pageId) : "";
  const password = body?.password ? String(body.password) : "";

  if (!pageId || !password) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  const page = await prisma.page.findUnique({ where: { id: pageId } });
  const pillar = page ? null : await prisma.pillarPage.findUnique({ where: { id: pageId } });
  const record = page || pillar;

  if (!record || !record.passwordProtected || !record.accessPasswordHash) {
    return NextResponse.json({ error: "This page is not password protected" }, { status: 400 });
  }

  const valid = await verifyPassword(password, record.accessPasswordHash);
  if (!valid) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  const token = await createPageAccessToken(pageId);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(pageAccessCookieName(pageId), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return response;
}
