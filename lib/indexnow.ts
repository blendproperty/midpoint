import { getSiteSettings } from "@/lib/site-settings";

// Any fixed-looking key works for IndexNow — it only has to match the file
// served at <domain>/<key>.txt (see the matching route folder below). It
// doesn't need to be secret; it just proves you control the domain.
export const INDEXNOW_KEY = "a1f9c3d7e2b84a6f9d0c5b8e1f2a3c47";

// Pings IndexNow (api.indexnow.org) so Bing and Yandex pick up new/updated
// content immediately instead of waiting for their normal crawl schedule.
// Deliberately NOT Google's Indexing API — Google restricts that to
// JobPosting/BroadcastEvent structured data by their own terms, and using
// it for ordinary pages risks the property being flagged.
//
// Gated behind Settings' "Allow indexing" toggle so this never announces
// content while the site is intentionally kept out of search (e.g. running
// on a temporary staging domain before the real domain cutover) — and it's
// entirely best-effort: any failure is swallowed so a flaky/unreachable
// IndexNow endpoint can never block saving or publishing content.
export async function submitToIndexNow(paths: string[]) {
  try {
    const settings = await getSiteSettings();
    if (!settings.allowIndexing || paths.length === 0) return;

    const domain = settings.domain.replace(/\/$/, "");
    const host = new URL(domain).host;
    const urlList = paths.map((p) => `${domain}${p.startsWith("/") ? p : `/${p}`}`);

    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${domain}/${INDEXNOW_KEY}.txt`,
        urlList,
      }),
    });
  } catch {
    // Best-effort only.
  }
}
