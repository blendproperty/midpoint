import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { syncVacanciesFromListings } from "@/lib/listings-sync";

// Not triggered by any UI — meant to be called on a schedule from the VPS
// itself, e.g. a crontab entry like:
//   0 * * * * curl -s -X POST -H "x-cron-secret: $VACANCY_SYNC_SECRET" \
//     https://www.mid-point.co.za/api/cron/sync-vacancies
// This app has no built-in scheduler (it's a plain Docker container, not
// Vercel), so a real OS-level cron job calling this endpoint is the
// simplest way to keep vacancies in sync without a person remembering to
// click the "Sync now" button in /admin/vacancies.
export async function POST(req: Request) {
  const secret = req.headers.get("x-cron-secret");
  const expected = process.env.VACANCY_SYNC_SECRET;

  if (!expected) {
    return NextResponse.json({ error: "VACANCY_SYNC_SECRET is not configured" }, { status: 503 });
  }
  if (secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await syncVacanciesFromListings();

  if (result.created > 0 || result.updated > 0 || result.deprecated > 0) {
    revalidatePath("/vacancies");
    revalidatePath("/admin/vacancies");
  }

  return NextResponse.json(result, { status: result.error ? 500 : 200 });
}
