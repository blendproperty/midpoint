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
# TinyMCE is used self-hosted (no cloud API key / no "this domain isn't
# registered" nag) — its static assets ship inside the npm package and just
# need to be reachable as a public file under /tinymce, so we copy them into
# public/ before the Next.js build so output:standalone's public/ copy step
# (below, in the runner stage) picks them up.
RUN mkdir -p public/tinymce && cp -r node_modules/tinymce/. public/tinymce/
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
