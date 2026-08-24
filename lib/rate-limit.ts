type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Simple in-memory fixed-window rate limiter. Good enough for Midpoint's
// current deployment (a single Docker Compose `web` container, not scaled
// horizontally) — counts live in that one process's memory. If this is ever
// scaled to multiple replicas behind a load balancer, this would need to
// move to a shared store (e.g. Redis), since each instance would otherwise
// track its own independent counts and the real limit would effectively
// multiply by the number of replicas.
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (existing.count >= limit) {
    return false;
  }

  existing.count += 1;
  return true;
}

// Sweep stale entries periodically so the Map doesn't grow unbounded over a
// long-running process. unref() so this timer never keeps the process alive
// on its own.
const sweeper = setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}, 10 * 60 * 1000);
sweeper.unref?.();

// Cloudflare sits in front of Traefik in front of this app (see
// middleware.ts's Email Address Obfuscation comment and compose.prod.yml's
// Traefik labels). Cloudflare always overwrites CF-Connecting-IP with the
// real connecting client — a requester can't spoof it — so prefer that.
// Falling back to X-Forwarded-For, trust the *last* hop (the one Traefik
// itself appended), not the first: Traefik appends to any inbound XFF
// rather than replacing it, so the first entry is attacker-controlled and
// trusting it would let a single requester bypass every rate limit below
// by rotating the header per request.
export function getClientIp(req: Request): string {
  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();

  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const hops = forwarded.split(",").map((hop) => hop.trim()).filter(Boolean);
    if (hops.length) return hops[hops.length - 1];
  }
  return "unknown";
}
