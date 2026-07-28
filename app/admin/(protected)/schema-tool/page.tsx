import { headers } from "next/headers";
import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

async function extractJsonLd(url: string): Promise<{ raw: string; parsed: unknown }[]> {
  const res = await fetch(url, { cache: "no-store" });
  const html = await res.text();
  // Tolerant to attribute order/quoting (e.g. type='...' vs type="...", or
  // extra attributes on the tag) instead of requiring one exact literal
  // string, so this doesn't silently under-report on a harmless markup
  // variation.
  const matches = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  return matches.map((m) => {
    const raw = m[1].trim();
    let parsed: unknown = null;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }
    return { raw, parsed };
  });
}

// Resolves to the domain actually serving *this* request (the one Brett is
// browsing right now), not the "Domain" field configured in Settings.
// Those two can easily disagree — e.g. testing against the working VPS
// domain while SiteSetting.domain still holds the eventual production
// domain that may not even be pointed at this app yet — and previously this
// tool used the Settings value, so it could report "0 JSON-LD found" while
// silently checking an entirely different site in the background.
async function resolveOrigin(): Promise<string> {
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") || h.get("host");
    if (host) {
      const proto = h.get("x-forwarded-proto") || "https";
      return `${proto}://${host}`;
    }
  } catch {
    // headers() unavailable outside a request context — fall through.
  }
  const settings = await getSiteSettings();
  return settings.domain;
}

export default async function SchemaToolPage({
  searchParams,
}: {
  searchParams: Promise<{ path?: string }>;
}) {
  const { path } = await searchParams;
  const origin = await resolveOrigin();
  let results: { raw: string; parsed: unknown }[] = [];
  let error: string | null = null;
  let checkedUrl: string | null = null;

  if (path) {
    try {
      checkedUrl = path.startsWith("http") ? path : `${origin}${path.startsWith("/") ? path : `/${path}`}`;
      results = await extractJsonLd(checkedUrl);
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to fetch page";
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">JSON-LD schema tool</h1>
      <p className="mt-1 text-sm text-slate-500">
        Enter a path (e.g. /vacancies or /blog/my-post) to see exactly what structured data is live on that page
        right now — this reads the actual rendered HTML on this domain, so it's always accurate to what's currently
        deployed here.
      </p>
      <form className="mt-6 flex gap-3">
        <input
          name="path"
          defaultValue={path}
          placeholder="/vacancies"
          className="w-full max-w-md rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
        <button type="submit" className="rounded-full bg-midpoint-dark px-4 py-2 text-sm font-medium text-white">
          Check
        </button>
      </form>

      {checkedUrl && <p className="mt-3 text-xs text-slate-400">Checked: {checkedUrl}</p>}

      {error && <p className="mt-4 text-red-600">{error}</p>}

      {path && !error && (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-slate-500">{results.length} JSON-LD block(s) found.</p>
          {results.map((r, i) => (
            <pre key={i} className="overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs text-emerald-300">
              {JSON.stringify(r.parsed ?? r.raw, null, 2)}
            </pre>
          ))}
          {results.length === 0 && <p className="text-slate-400">No JSON-LD found on this page.</p>}
        </div>
      )}
    </div>
  );
}
