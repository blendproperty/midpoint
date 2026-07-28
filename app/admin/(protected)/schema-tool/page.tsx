import { getSiteSettings } from "@/lib/site-settings";

export const dynamic = "force-dynamic";

async function extractJsonLd(url: string): Promise<{ raw: string; parsed: unknown }[]> {
  const res = await fetch(url, { cache: "no-store" });
  const html = await res.text();
  const matches = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
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

export default async function SchemaToolPage({
  searchParams,
}: {
  searchParams: Promise<{ path?: string }>;
}) {
  const { path } = await searchParams;
  const settings = await getSiteSettings();
  let results: { raw: string; parsed: unknown }[] = [];
  let error: string | null = null;

  if (path) {
    try {
      const url = path.startsWith("http") ? path : `${settings.domain}${path.startsWith("/") ? path : `/${path}`}`;
      results = await extractJsonLd(url);
    } catch (e) {
      error = e instanceof Error ? e.message : "Failed to fetch page";
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">JSON-LD schema tool</h1>
      <p className="mt-1 text-sm text-slate-500">
        Enter a path (e.g. /vacancies or /blog/my-post) to see exactly what structured data is live on that page
        right now — this reads the actual rendered HTML, so it's always accurate to what's currently deployed.
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
