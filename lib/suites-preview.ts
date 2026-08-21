import { cookies } from "next/headers";

// Name of the cookie set once a visitor enters the correct
// SUITES_PREVIEW_PASSWORD. Short-lived (see suites/actions.ts) so a leaked
// link doesn't grant standing access.
export const SUITES_PREVIEW_COOKIE = "suites_preview_unlocked";

// The preview is gated behind an env var on top of the password check:
// if SUITES_PREVIEW_PASSWORD isn't set on a given environment (which it
// currently isn't — nothing has been added to the VPS's .env yet), the
// page renders a "not available" state no matter what anyone submits.
// This means today, even on this branch, there is no working password —
// deploying this branch alone does not make the preview enterable.
export function suitesPreviewEnabled(): boolean {
  return Boolean(process.env.SUITES_PREVIEW_PASSWORD);
}

export async function hasSuitesPreviewAccess(): Promise<boolean> {
  const store = await cookies();
  return store.get(SUITES_PREVIEW_COOKIE)?.value === "granted";
}
