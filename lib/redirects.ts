import { prisma } from "@/lib/prisma";

export type RedirectRule = { fromPath: string; toPath: string; statusCode: number };

// Full list, used by middleware to refresh its in-memory cache — never
// called per-request, only on the periodic refresh (see middleware.ts).
export async function listRedirectRules(): Promise<RedirectRule[]> {
  const rows = await prisma.redirect.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map((r) => ({ fromPath: r.fromPath, toPath: r.toPath, statusCode: r.statusCode }));
}

// Best-effort hit tracking — called only when a redirect actually matched a
// request (rare relative to total traffic), never on the hot path for every
// page load.
export async function recordRedirectHit(fromPath: string) {
  try {
    await prisma.redirect.update({
      where: { fromPath },
      data: { hitCount: { increment: 1 }, lastHitAt: new Date() },
    });
  } catch {
    // Rule may have been deleted between the cache refresh and this request
    // — not worth surfacing an error over a hit-count miss.
  }
}
