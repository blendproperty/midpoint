import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { syncVacanciesFromListings } from "@/lib/listings-sync";
import { timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authenticate(req: Request) {
  const expected = process.env.VACANCY_SYNC_SECRET;
  if (!expected) return NextResponse.json({ error: "VACANCY_SYNC_SECRET is not configured" }, { status: 503 });
  const supplied = new TextEncoder().encode(req.headers.get("x-cron-secret") || "");
  const wanted = new TextEncoder().encode(expected);
  if (supplied.length !== wanted.length || !timingSafeEqual(supplied, wanted)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

// Read-only weekly verification: a recent successful full reconciliation and
// the saved counts, never a public disclosure of sync/provider information.
export async function GET(req: Request) {
  const rejected = authenticate(req);
  if (rejected) return rejected;
  if (!process.env.LISTINGS_API_KEY) return NextResponse.json({ error: "LISTINGS_API_KEY is not configured" }, { status: 503 });
  try {
    const setting = await prisma.siteSetting.findUnique({ where: { id: "global" }, select: { lastVacancySync: true } });
    const result = setting?.lastVacancySync as { ranAt?: string; error?: string; fetched?: number } | null;
    const age = Date.now() - Date.parse(result?.ranAt || "");
    const healthy = Number.isFinite(age) && age >= 0 && age <= 26 * 60 * 60 * 1000 && !result?.error;
    const published = await prisma.vacancy.count({ where: { status: "PUBLISHED", externalId: { not: null } } });
    return NextResponse.json({ healthy, lastRunAt: result?.ranAt || null, fetched: result?.fetched ?? null, published, error: result?.error || (healthy ? null : "No successful sync within 26 hours") }, { status: healthy ? 200 : 503 });
  } catch {
    return NextResponse.json({ error: "Sync verification unavailable" }, { status: 503 });
  }
}

// Not triggered by any UI — meant to be called on a schedule from the VPS
// itself, e.g. a crontab entry like:
//   0 * * * * curl -s -X POST -H "x-cron-secret: $VACANCY_SYNC_SECRET" \
//     https://www.mid-point.co.za/api/cron/sync-vacancies
// This app has no built-in scheduler (it's a plain Docker container, not
// Vercel), so a real OS-level cron job calling this endpoint is the
// simplest way to keep vacancies in sync without a person remembering to
// click the "Sync now" button in /admin/vacancies.
export async function POST(req: Request) {
  const rejected = authenticate(req);
  if (rejected) return rejected;

  const result = await syncVacanciesFromListings();

  if (result.created > 0 || result.updated > 0 || result.deprecated > 0) {
    revalidatePath("/vacancies");
    revalidatePath("/vacancies/[id]", "page");
    revalidatePath("/admin/vacancies");
  }

  return NextResponse.json(result, { status: result.error ? 500 : 200 });
}
