import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-insecure-secret-change-me"
);
const SESSION_COOKIE = "midpoint_admin_session";

const PUBLIC_ROUTES = new Set([
  "/admin/login",
  "/api/admin/login",
  "/admin/forgot-password",
  "/api/admin/forgot-password",
  "/admin/reset-password",
  "/api/admin/reset-password",
]);

// --- Redirect-manager cache -------------------------------------------
// Edge middleware can't talk to Prisma directly (self-hosted Postgres, not
// an edge-compatible driver), so instead of a DB lookup on every single
// page request, the full redirect list is fetched at most once every 60
// seconds from /api/redirects/all (a plain Node.js route with normal
// Prisma access) and cached in this module-scope Map. Everyday requests
// then do a synchronous in-memory lookup only — a saved/edited redirect
// can take up to ~60s to go live, which is a reasonable trade for not
// adding a database round-trip to every page load on the site.
//
// Two fixes applied here after a perf investigation found this middleware
// was inflating TTFB on every request when the cache was stale:
//   1. Fetches http://127.0.0.1:$PORT directly instead of the request's
//      public HTTPS origin. The original version self-fetched the site's
//      own public hostname, meaning every refresh paid for DNS + a TLS
//      handshake + a hairpin through the reverse proxy back into this
//      exact same (single, non-replicated) Node process — all while that
//      process was still in the middle of handling the request that
//      triggered the refresh. Talking to localhost skips all of that.
//   2. A single in-flight Promise is now shared across concurrent
//      requests. Previously, if N requests landed during the same stale
//      window, each one independently saw the cache as expired and fired
//      its own duplicate self-fetch + duplicate Prisma query (a classic
//      cache stampede) instead of sharing one refresh.
type RedirectEntry = { toPath: string; statusCode: number };
let redirectCache: Map<string, RedirectEntry> = new Map();
let redirectCacheAt = 0;
let refreshInFlight: Promise<void> | null = null;
const REDIRECT_CACHE_TTL_MS = 60_000;

function internalUrl(path: string): string {
  const port = process.env.PORT || "3000";
  return `http://127.0.0.1:${port}${path}`;
}

async function refreshRedirectCache(): Promise<void> {
  try {
    const res = await fetch(internalUrl("/api/redirects/all"));
    if (res.ok) {
      const rules: { fromPath: string; toPath: string; statusCode: number }[] = await res.json();
      redirectCache = new Map(rules.map((r) => [r.fromPath, { toPath: r.toPath, statusCode: r.statusCode }]));
      redirectCacheAt = Date.now();
    }
  } catch {
    // Keep serving the previous (possibly stale) cache rather than losing
    // every redirect over one transient fetch failure.
  }
}

async function getRedirectCache(): Promise<Map<string, RedirectEntry>> {
  const now = Date.now();
  if (now - redirectCacheAt < REDIRECT_CACHE_TTL_MS) return redirectCache;

  if (!refreshInFlight) {
    refreshInFlight = refreshRedirectCache().finally(() => {
      refreshInFlight = null;
    });
  }
  await refreshInFlight;
  return redirectCache;
}

function recordHit(fromPath: string) {
  // Fire-and-forget — never await this in the request path.
  fetch(internalUrl("/api/redirects/hit"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fromPath }),
  }).catch(() => {});
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.has(pathname)) {
    return NextResponse.next();
  }

  const isAdminProtected = pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  if (isAdminProtected) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!token) return redirectToLogin(request);
    try {
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch {
      return redirectToLogin(request);
    }
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const cache = await getRedirectCache();
  const match = cache.get(pathname);
  if (match) {
    recordHit(pathname);
    const destination = match.toPath.startsWith("http")
      ? match.toPath
      : new URL(match.toPath, request.url);
    return NextResponse.redirect(destination, match.statusCode);
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
