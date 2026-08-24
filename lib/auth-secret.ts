// Shared by lib/auth.ts (Node) and middleware.ts (Edge) — kept
// dependency-free (no next/headers, no bcryptjs) so both runtimes can
// import it directly.
//
// Deliberately lazy: AUTH_SECRET is only injected at container *runtime*
// (compose.prod.yml's `environment:` block), not at Docker *build* time,
// but `next build` still imports every route module during its "Collecting
// page data" step with NODE_ENV forced to "production". Throwing eagerly
// at module load broke every build. Throwing lazily, only when a session
// token is actually signed/verified, keeps the same fail-closed guarantee
// at request time without ever running during the build.
let cached: Uint8Array | null = null;

export function getAuthSecretBytes(): Uint8Array {
  if (cached) return cached;

  const value = process.env.AUTH_SECRET;
  if (value && value.length >= 32) {
    cached = new TextEncoder().encode(value);
    return cached;
  }

  if (process.env.NODE_ENV === "production") {
    // Fail loudly rather than silently signing/verifying admin session
    // JWTs with the well-known fallback below — that string is sitting in
    // this public repo, so an unset/misconfigured AUTH_SECRET would
    // otherwise let anyone forge a valid SUPER_ADMIN session cookie.
    throw new Error(
      "AUTH_SECRET must be set to a random value of at least 32 characters in production " +
        "(generate with: openssl rand -hex 32). Refusing to sign or verify session tokens with an insecure or missing secret."
    );
  }

  // Intentionally obvious/insecure — only reachable outside production, so
  // local dev never silently signs sessions with this value.
  cached = new TextEncoder().encode("dev-insecure-secret-change-me");
  return cached;
}
