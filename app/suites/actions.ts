"use server";

import { cookies } from "next/headers";
import { SUITES_PREVIEW_COOKIE, suitesPreviewEnabled } from "@/lib/suites-preview";

export async function unlockSuitesPreview(
  _prevState: { error?: string } | undefined,
  formData: FormData
): Promise<{ error?: string }> {
  if (!suitesPreviewEnabled()) {
    return { error: "This preview isn't switched on yet." };
  }

  const submitted = String(formData.get("password") ?? "");
  if (submitted !== process.env.SUITES_PREVIEW_PASSWORD) {
    return { error: "That password isn't right." };
  }

  const store = await cookies();
  store.set(SUITES_PREVIEW_COOKIE, "granted", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 4, // 4 hours
    path: "/suites",
  });

  return {};
}
