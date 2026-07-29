import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Raises the connection pool size and pool_timeout above Prisma's defaults
// (connection_limit = num_cpus*2+1, pool_timeout = 10s) without requiring a
// change to the DATABASE_URL set in the VPS's .env file. Every server
// component/page on this site does at least one Prisma query per request
// (force-dynamic, no route caching), so under concurrent traffic the small
// default pool was being exhausted, queuing requests until they either got
// a free connection or hit the 10s pool_timeout — which is why pages were
// taking 10-13 seconds to fully render even though the DB itself sits on
// the same Docker network as the app (sub-millisecond latency once a
// connection is actually available).
//
// Respects an explicit connection_limit/pool_timeout already present in
// DATABASE_URL (e.g. set directly in the VPS .env later) instead of
// overriding it.
function withPoolParams(databaseUrl: string): string {
  if (!databaseUrl) return databaseUrl;
  try {
    const url = new URL(databaseUrl);
    if (!url.searchParams.has("connection_limit")) {
      url.searchParams.set("connection_limit", "10");
    }
    if (!url.searchParams.has("pool_timeout")) {
      url.searchParams.set("pool_timeout", "20");
    }
    return url.toString();
  } catch {
    // If DATABASE_URL is somehow malformed, fall back to using it as-is
    // rather than crashing client construction.
    return databaseUrl;
  }
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: withPoolParams(process.env.DATABASE_URL || ""),
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
