# Midpoint — Next.js rebuild

Replacement for the Webflow site at mid-point.co.za, built on Next.js 15
(App Router), TypeScript, and Tailwind, using the exact colour/font tokens
scraped from the live site.

## Stack
Next.js 15 · React 19 · TypeScript · Tailwind CSS · Docker/VPS (auto-deployed via GitHub Actions)

## Getting started
```
npm install
npm run dev
```

## Structure
- `app/page.tsx` — homepage, composed of the section components in
  `components/` (Hero, Intro, FutureOfWork, Listings, Location, Amenities,
  BrokerCTA, ReadyToMove, GalleryStrip, TenantWall, Developer, Faq, Contact).
- `app/about-us`, `/amenities`, `/offices`, `/warehouses`, `/spaces` render
  from the scraped copy in `scripts/scraped-data/*.json` via
  `lib/scraped.ts` + `components/ScrapedContent.tsx`. Swap these for bespoke
  layouts as each page gets designed properly — the scraped data guarantees
  no copy gets lost in the meantime.
- `app/vacancies`, `/availability-report` render from `lib/listings.ts`
  (the same 12-unit data also driving `SiteMap`'s interactive pins).
- `app/contact-us` and the homepage Contact section both use
  `components/ContactForm.tsx`, posting to `/api/enquiry`.
- `lib/faqs.ts`, `lib/amenities.ts`, `lib/tenants.ts` feed their matching
  homepage sections and are already wired.
- `app/robots.ts` / `app/sitemap.ts` generate `/robots.txt` and
  `/sitemap.xml` from `lib/site.ts`.
- `app/layout.tsx` wires Google Tag Manager and Place/FAQPage JSON-LD from
  `lib/site.ts` + `lib/faqs.ts`.

## Environment variables
- `N8N_ENQUIRY_WEBHOOK` — n8n webhook URL. The enquiry API route posts every
  contact-form submission here for fan-out to Zoho CRM, Mailchimp, and a
  notification email. Set this in a `.env` file next to `docker-compose.yml`
  on the VPS.

## Deploying
Pushes to `main` auto-deploy via `.github/workflows/deploy.yml`, which SSHes
into the VPS and runs `docker compose up -d --build` against
`docker-compose.yml`. Requires these GitHub Actions repo secrets:
`SSH_HOST`, `SSH_USER`, `SSH_PRIVATE_KEY`, `DEPLOY_PATH`.

The repo must already be cloned at `DEPLOY_PATH` on the VPS, with a `.env`
file there containing `N8N_ENQUIRY_WEBHOOK`.

## Before launch
1. Confirm the interactive map pin coordinates in `lib/listings.ts` against
   the live aerial image (already Playwright-measured, but spot-check after
   any image changes).
2. Confirm `N8N_ENQUIRY_WEBHOOK` is set to the correct live n8n webhook.
3. Give `/about-us`, `/amenities`, `/offices`, `/warehouses`, `/spaces` their
   own designed layouts instead of the generic `ScrapedContent` renderer —
   the copy is already in place, only presentation is left.
4. Build the `/insights` CMS-equivalent (currently a single wired example
   page) from `scripts/scraped-data/insights.json`.
5. Run `node scripts/scrape-site.mjs` again if the live Webflow site changes
   before cutover, to catch any last-minute content edits.
6. Download all `cdn.prod.website-files.com` images into `/public` and
   repoint the CDN URLs before cancelling the Webflow plan.
7. Crawl the Vercel preview with Screaming Frog and diff titles/metas/H1s
   against the live site, then cut over DNS. Keep Webflow live for a week as
   a fallback.
