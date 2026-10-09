import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { vacancySector, vacancySummary } from "@/lib/vacancies";
import { brochureFilename, createVacancyBrochure } from "@/lib/vacancy-brochure";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, noarchive", "X-Content-Type-Options": "nosniff" };
  if (!checkRateLimit(`brochure:${getClientIp(request)}`, 30, 60_000)) return new Response("Please try again shortly.", { status: 429, headers: { ...headers, "Retry-After": "60" } });
  try {
    const { id } = await params;
    // This site's published Vacancy table is the scope boundary: arbitrary
    // Blend portfolio IDs and unpublished/deprecated spaces cannot be rendered.
    const row = await prisma.vacancy.findFirst({ where: { id, status: "PUBLISHED" } });
    if (!row) return new Response("Space not found", { status: 404, headers });
    const listing = { ...row, unitName: row.unitName || null, sector: vacancySector(row.sector, row.building), image: row.image || "", description: vacancySummary(row.description, 100_000) };
    const settings = await getSiteSettings();
    const pdf = await createVacancyBrochure(listing, { phone: settings.phone, email: settings.email });
    return new Response(Uint8Array.from(pdf).buffer, { headers: { ...headers, "Content-Type": "application/pdf", "Content-Disposition": `attachment; filename="${brochureFilename(listing)}"` } });
  } catch (error) {
    console.error("Midpoint brochure generation failed", error instanceof Error ? error.name : "Unknown error");
    return new Response("The brochure is temporarily unavailable. Please try again shortly.", { status: 503, headers });
  }
}
