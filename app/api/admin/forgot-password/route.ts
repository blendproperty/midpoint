import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPasswordResetToken } from "@/lib/password-reset";
import { sendMail } from "@/lib/mail";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getSiteSettings } from "@/lib/site-settings";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // Always the same generic response, whether the email exists, is
  // malformed, or the rate limit was hit — this endpoint must never reveal
  // which admin emails are registered.
  const genericResponse = NextResponse.json({
    ok: true,
    message: "If that email is registered, a reset link has been sent.",
  });

  if (!checkRateLimit(`forgot-password:${ip}`, 5, 15 * 60 * 1000)) {
    return genericResponse;
  }

  const body = await request.json().catch(() => null);
  const email = body?.email ? String(body.email).trim().toLowerCase() : "";
  if (!email) return genericResponse;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return genericResponse;

  const token = await createPasswordResetToken(user.id);
  const settings = await getSiteSettings();
  const resetUrl = `${settings.domain}/admin/reset-password?token=${token}`;

  await sendMail(
    user.email,
    "Reset your Midpoint admin password",
    `<p>Hi ${user.name || "there"},</p><p>Click the link below to reset your Midpoint admin password. This link expires in 1 hour and can only be used once.</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you didn't request this, you can safely ignore this email — your password will not change.</p>`
  );

  return genericResponse;
}
