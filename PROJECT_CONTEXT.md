# Midpoint Project Context

This is the canonical delivery record for production-impacting Midpoint work. A task is complete only when each applicable stage below has evidence; unresolved gates remain explicit.

## 2026-09-10 — Rename the accommodation amenity card

### Implementation

- Renamed the `/amenities` feature-card heading from `Corporate accommodation` to `The Suites at Midpoint`.
- Preserved the card description, image, ordering, status caveats and all broader amenities/SEO copy.
- Updated both the canonical seed content and a scoped production data migration.

### Testing

- `npm test`: passed on 2026-09-10 — 18 test files and 71 tests passed, including the scoped amenity-name test.
- `npm run build`: passed on 2026-09-10 — Next.js production build compiled, type-checked and generated all routes successfully.

### Commit and push

- Pending at time of implementation.

### Merge

- Pending at time of implementation.

### Deployment and configuration

- Pending migration and production deployment.

### Live production verification

- Pending confirmation on `https://www.mid-point.co.za/amenities`.

### Outstanding gates

- None beyond deployment and live verification for this copy-only rename.

## 2026-09-09 — Replace the WhatsApp destination

### Implementation

- Requested destination: Blend Property Group mobile `+27 60 018 5206` (canonical digits: `27600185206`).
- Replaced the single site-wide WhatsApp setting used by the floating button and all vacancy WhatsApp links.
- Added the same value to the database migration, site-settings fallback, seed update/create path, and admin placeholder.
- Boitumelo's email address and the Midpoint office voice number are separate contact channels and were intentionally not changed.

### Testing

- `npm test`: passed on 2026-09-09 — 17 test files and 70 tests passed, including the canonical WhatsApp source test.
- `npm run build`: passed on 2026-09-09 — Next.js production build compiled, type-checked and generated all routes successfully.

### Commit and push

- Commit `bbc0c5a58d9270a99e2ac317ea793aca6f987537` (`Update Midpoint WhatsApp number`) was pushed to `origin/main` on 2026-09-09.

### Merge

- The verified branch was promoted directly to `main` as a fast-forward (`9faca95..bbc0c5a`); no pull-request merge was used.

### Deployment and configuration

- GitHub Actions workflow `Deploy to VPS`, run `34313228321`, completed successfully on 2026-09-09.
- The deployment rebuilt the application and migration images and applied migration `20260909120000_update_whatsapp_number`, setting the production `SiteSetting.whatsapp` value to `27600185206`.

### Live production verification

- On 2026-09-09, `https://www.mid-point.co.za/` returned HTTP 200, served deployment `bbc0c5a58d92`, and contained `https://wa.me/27600185206`.
- On 2026-09-09, `https://www.mid-point.co.za/vacancies` returned HTTP 200, served deployment `bbc0c5a58d92`, and contained vacancy links to `https://wa.me/27600185206`.
- No other `wa.me` destination numbers were present in either verified production response.

### Outstanding gates

- No UAT or external messaging-provider delivery test has yet been completed.
