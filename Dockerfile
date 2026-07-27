FROM node:22-alpine AS base

# --- deps ---
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# --- build ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# No DATABASE_URL is available at build time (the DB container isn't reachable
# during `docker build`), and none of the pages query Prisma at build time —
# every DB-backed route uses `export const dynamic = "force-dynamic"`, so
# `next build` never needs a live connection. `prisma generate` (via
# postinstall, above) only needs the schema file, not a connection.
RUN npm run build

# --- runtime ---
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Next's output-file tracing (used by `output: "standalone"`) detects the
# Prisma Client usage and copies node_modules/.prisma + @prisma/client into
# .next/standalone/node_modules automatically. If that ever stops being true
# (e.g. after a Next.js upgrade), uncomment the two lines below to copy them
# explicitly:
# COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
# COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
