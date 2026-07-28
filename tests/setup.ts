// A few lib/ modules (e.g. lib/password-reset.ts, via lib/prisma.ts) construct
// a PrismaClient at import time, which throws immediately if DATABASE_URL
// isn't resolvable — even though these unit tests never actually touch a
// live database. Providing harmless placeholder values here means `npm test`
// works out of the box, locally and in CI, without needing a real Postgres
// instance running.
process.env.DATABASE_URL ||= "postgresql://user:pass@localhost:5432/midpoint_test";
process.env.AUTH_SECRET ||= "test-secret-not-for-production";
