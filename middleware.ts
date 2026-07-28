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

// Edge-runtime gatekeeper for the whole /admin surface. Deliberately simple:
// verify the JWT signature/expiry only, then let each page/server action do
// its own role check (see lib/require-admin.ts) since role-specific logic
// doesn't belong in the edge runtime.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_ROUTES.has(pathname)) {
    return NextResponse.next();
  }

  const isProtected =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin");
  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return redirectToLogin(request);
  }

  try {
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    return redirectToLogin(request);
  }
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
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
