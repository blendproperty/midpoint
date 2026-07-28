import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "dev-insecure-secret-change-me"
);
const SESSION_COOKIE = "midpoint_admin_session";

// Routes under /admin or /api/admin that must stay reachable WITHOUT a
// session — sign-in itself, and the forgot/reset-password flow (a locked-out
// admin can't get a session cookie in the first place, so these can never be
// behind the auth check).
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
type RedirectEntry = { toPath: string; statusCode: number };
let redirectCache: Map<string, RedirectEntry> = new Map();
let redirectCacheAt = 0;
const REDIRECT_CACHE_TTL_MS = 60_000;

async function getRedirectCache(origin: string): Promise<Map<string, RedirectEntry>> {
  const now = Date.now();
  if (now - redirectCacheAt < REDIRECT_CACHE_TTL_MS) return redirectCache;

  try {
    const res = await fetch(new URL("/api/redirects/all", origin));
    if (res.ok) {
      const rules: { fromPath: string; toPath: string; statusCode: number }[] = await res.json();
      redirectCache = new Map(rules.map((r) => [r.fromPath, { toPath: r.toPath, statusCode: r.statusCode }]));
      redirectCacheAt = now;
    }
  } catch {
    // Keep serving the previous (possibly stale) cache rather than losing
    // every redirect over one transient fetch failure.
  }
  return redirectCache;
}

function recordHit(origin: string, fromPath: string) {
  // Fire-and-forget — never await this in the request path.
  fetch(new URL("/api/redirects/hit", origin), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fromPath }),
  }).catch(() => {});
}

// Edge-runtime gatekeeper for the whole /admin surface, plus the
// redirect-manager check for every other route. Admin auth is deliberately
// simple: verify the JWT signature/expiry only, then let each page/server
// action do its own role check (see lib/require-admin.ts) since
// role-specific logic doesn't belong in the edge runtime.
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

  // Skip the redirect-manager's own API routes (and any other /api route)
  // — these aren't user-facing pages a redirect rule would ever target,
  // and checking them would mean the /api/redirects/all cache-refresh
  // fetch triggers this same middleware recursively.
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const cache = await getRedirectCache(request.nextUrl.origin);
  const match = cache.get(pathname);
  if (match) {
    recordHit(request.nextUrl.origin, pathname);
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
  // Runs on every route except Next's static/image internals and any
  // request for a file with an extension (assets, images, etc.) — those can
  // never be redirect targets and checking them would be wasted work.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
