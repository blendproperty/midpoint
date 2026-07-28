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

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return "unknown";
}
