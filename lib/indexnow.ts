import { getSiteSettings } from "@/lib/site-settings";
import { DEFAULT_INDEXNOW_KEY } from "@/lib/indexnow-key";

export { DEFAULT_INDEXNOW_KEY };

// Pings IndexNow (api.indexnow.org) so Bing and Yandex pick up new/updated
// content immediately instead of waiting for their normal crawl schedule.
// Deliberately NOT Google's Indexing API — Google restricts that to
// JobPosting/BroadcastEvent structured data by their own terms, and using
// it for ordinary pages risks the property being flagged.
//
// The key itself is editable from /admin/settings (falls back to
// DEFAULT_INDEXNOW_KEY when unset) — middleware.ts serves the matching
// <domain>/<key>.txt ownership file IndexNow requires by reading the same
// setting, so changing the key here and there stay in sync automatically.
//
// Gated behind Settings' "Allow indexing" toggle so this never announces
// content while the site is intentionally kept out of search (e.g. running
// on a temporary staging domain before the real domain cutover) — and it's
// entirely best-effort: any failure is swallowed so a flaky/unreachable
// IndexNow endpoint can never block saving or publishing content.
export async function submitToIndexNow(paths: string[]) {
  try {
    const settings = await getSiteSettings();
    if (paths.length === 0) return;

    const key = settings.indexNowKey || DEFAULT_INDEXNOW_KEY;
    const domain = settings.domain.replace(/\/$/, "");
    const host = new URL(domain).host;
    const urlList = paths.map((p) => `${domain}${p.startsWith("/") ? p : `/${p}`}`);

    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key,
        keyLocation: `${domain}/${key}.txt`,
        urlList,
      }),
    });
  } catch {
    // Best-effort only.
  }
}
