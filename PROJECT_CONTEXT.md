# Midpoint Project Context

This is the canonical delivery record for production-impacting Midpoint work. A task is complete only when each applicable stage below has evidence; unresolved gates remain explicit.

## 2026-09-10 — The Suites booking system, Phase 1

### Implementation

- Added the RoomCategory, Room and Reservation data foundation with explicit room, reservation and payment statuses; overlapping-stay availability uses the hotel boundary rule `existing check-in < requested check-out` and `existing check-out > requested check-in`.
- Added 18 inactive, blocked, unassigned placeholder physical-room records. This preserves the confirmed total without inventing the unknown Studio/Executive split, final room numbers or floors.
- Added the two approved public category names, only the features stated in the supplied brief, nullable/configurable capacity and rates, and the four supplied photographs. No stock imagery was generated.
- Added staging-only `/stay`, `/stay/onpoint-studio` and `/stay/onpoint-executive-suite` experiences with booking search, validated dates/guests/company code, server-calculated nights and availability, room galleries, category details and transparent rate-on-request states.
- Added a prominent booking search bar and supplied-photo gallery to `/the-suites-at-midpoint`, plus a staging-only `Book a Stay` navigation item.
- Added secure `/admin/rooms` inventory setup for category activation/rates/capacity and all 18 rooms' category, number, floor, operational status, activation and notes.
- Production-host access to the unfinished `/stay` routes is blocked until the data and release gates below are approved; staging remains protected by its existing noindex controls.

### Testing

- `npm test`: passed on 2026-09-10 — 21 test files and 77 tests passed, including date validation, overlap boundaries, 18-room migration safeguards and existing regressions.
- `npm run build`: passed on 2026-09-10 — Prisma generated successfully and Next.js compiled/type-checked the new search, category and admin inventory routes.

### Commit and push

- Commit `79039a3fa1f7e5e6e061e11d1bc160bf560068b2` (`Build Suites booking Phase 1`) was pushed to `origin/main` on 2026-09-10.

### Merge

- The verified isolated worktree was promoted directly to `main` by fast-forward; no pull-request merge was used.

### Deployment and configuration

- GitHub Actions `Deploy to VPS` run `34474718455` completed successfully on 2026-09-10; its migration step created the booking schema, two category records and 18 blocked/unassigned room records.

### Live production verification

- Staging `/the-suites-at-midpoint`, `/stay`, both category routes and a three-night dated search returned HTTP 200 with `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`.
- The dated search rendered the explicit `Availability is being configured` state because no unapproved room/category allocation was activated.
- Each supplied image asset returned HTTP 200; the live Suites page was visually verified at 1440px with the booking bar, staging-only `Book a Stay` navigation, supplied-photo experience and zero horizontal overflow.
- Production `https://www.mid-point.co.za/stay` returned HTTP 404, confirming the unfinished booking system is not publicly released there.

### Outstanding gates

- Business must supply the exact Studio/Executive room split, final room numbers/floors, confirmed category image mapping, Executive maximum occupancy, rates, taxes/fees, check-in/out times, cancellation terms and any stay restrictions before categories and rooms can be activated.
- Reservation checkout, transactional room assignment, confirmation/email, admin calendar, payments, corporate rates, promo codes, extras and manage-booking are later phases and are not represented as complete.
- No payment gateway has been selected; raw card data must never be stored by Midpoint.

## 2026-09-10 — Responsive shared navigation repair

### Implementation

- Moved the full desktop navigation handover from the 768px breakpoint to 1280px so the logo, two contact pills, six links and enquiry CTA are never forced into tablet-width space.
- Prevented both contact pills from wrapping and protected the logo, desktop groups and mobile-menu control from flex shrinking.
- The shared `Nav` component serves both `mid-point.co.za` and `midpoint.onpointoffices.co.za`, so the correction applies consistently to production and staging.

### Testing

- `npm test`: passed on 2026-09-10 — 19 test files and 74 tests passed, including a new regression test for the navigation breakpoint and no-wrap rules.
- `npm run build`: passed on 2026-09-10 — Next.js compiled and type-checked all application routes successfully.

### Commit and push

- Commit `c695a9a21af99921a91deb5ee2294953d6d5eac9` (`Fix responsive header overflow`) was pushed to `origin/main` on 2026-09-10.

### Merge

- The verified isolated worktree was promoted directly to `main` by fast-forward; no pull-request merge was used.

### Deployment and configuration

- GitHub Actions `Deploy to VPS` run `34470101456` completed successfully on 2026-09-10.

### Live production verification

- Browser verification at the reported 1009px viewport confirmed both staging and production use the compact menu, retain an unwrapped phone label and have no horizontal overflow.
- Browser verification at 1440px confirmed the complete desktop navigation is visible, the menu control is hidden, the phone label remains unwrapped and there is no horizontal overflow.
- Browser verification at 390px confirmed the compact navigation remains active with no horizontal overflow.
- The staging Suites page was also visually inspected at 1009px: the logo and menu remain separated, the hero heading and CTA are unobstructed, and the previously stacked phone pill is absent from the closed header.

### Outstanding gates

- None beyond deployment and live responsive verification for this layout repair.

## 2026-09-10 — Staging copy and The Suites booking-request showcase

### Implementation

- Added the dedicated `/the-suites-at-midpoint` showcase with corporate-stay positioning, feature cards, date/guest capture and explicit request-to-book language.
- Added a rate-limited, honeypot-protected `/api/suites-booking` endpoint that validates stay dates and stores each request in the existing Contacts and Enquiries administration workflow with campaign attribution.
- Added host-specific staging protection for `midpoint.onpointoffices.co.za`: blanket `robots.txt` disallow, `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`, and matching page metadata.
- The staging hostname currently routes to the same application container as production; the new experience is therefore code-isolated by hostname protections but does not yet have a separate container or database.

### Testing

- `npm test`: passed on 2026-09-10 — 18 test files and 73 tests passed, including staging header and robots exclusions.
- `npm run build`: passed on 2026-09-10 — Next.js production build compiled, type-checked and generated the Suites page and booking API.

### Commit and push

- Implementation commit `6554291d03a226b5d8c90ecb962d6b4a3ecf3495` and forwarded-host hardening commit `6cee51bd80ae906f8bf9d66bdd712346af52f06f` were pushed to `origin/main` on 2026-09-10.

### Merge

- The verified isolated worktree was promoted directly to `main` by fast-forward; no pull-request merge was used.

### Deployment and configuration

- GitHub Actions `Deploy to VPS` runs `34463207449` and `34463604332` completed successfully on 2026-09-10. The latter deployed the final reverse-proxy-aware crawler protection.

### Live production verification

- Before this change, both hosts returned HTTP 200 and the staging hostname served the production site, but staging had no `X-Robots-Tag` and its `robots.txt` allowed all crawlers.
- On 2026-09-10, `https://midpoint.onpointoffices.co.za/the-suites-at-midpoint` returned HTTP 200 and rendered the hero, six showcase cards, date/guest fields, consent and request-to-book CTA at desktop width.
- The staging home, Suites page, `robots.txt` and `sitemap.xml` all returned `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`; rendered HTML also contained `noindex` metadata, and staging `robots.txt` returned `User-agent: *` plus `Disallow: /`.
- The booking endpoint rejected an incomplete request with HTTP 400, confirming live server-side validation without creating test customer data.
- `https://www.mid-point.co.za/` remained HTTP 200 with no noindex header or metadata, confirming production indexing was not disabled.

### Outstanding gates

- Automatic availability, live inventory, rate rules, deposits/payments, cancellation terms and instant confirmation are not configured; submissions are booking requests requiring manual confirmation.
- A separate staging container/database and non-production integration configuration remain an infrastructure gate if full environment isolation is required.
- Final accommodation photography, room inventory, guest capacity, rates, operating policy and booking terms require business approval before production release.
- End-to-end submission/UAT with an approved test contact remains open; it was intentionally not performed during live verification to avoid creating customer or CRM data without an approved test identity.

## 2026-09-10 — Rename the accommodation amenity card

### Implementation

- Renamed the `/amenities` feature-card heading from `Corporate accommodation` to `The Suites at Midpoint`.
- Preserved the card description, image, ordering, status caveats and all broader amenities/SEO copy.
- Updated both the canonical seed content and a scoped production data migration.

### Testing

- `npm test`: passed on 2026-09-10 — 18 test files and 71 tests passed, including the scoped amenity-name test.
- `npm run build`: passed on 2026-09-10 — Next.js production build compiled, type-checked and generated all routes successfully.

### Commit and push

- Commit `dccec7d371a6e6f89b38e95af4bbfd7cede24f00` (`Rename accommodation amenity to The Suites at Midpoint`) was pushed to `origin/main` on 2026-09-10.

### Merge

- The verified branch was promoted directly to `main` as a fast-forward (`eaa7dc7..dccec7d`); no pull-request merge was used.

### Deployment and configuration

- GitHub Actions workflow `Deploy to VPS`, run `34451286832`, completed successfully on 2026-09-10.
- The deployment rebuilt the application and migration images and applied migration `20260910120000_rename_midpoint_suites_amenity` to the production amenities pillar.

### Live production verification

- On 2026-09-10, `https://www.mid-point.co.za/amenities` returned HTTP 200 and served deployment `dccec7d371a6`.
- The rendered amenity feature card has an `h3` heading of `The Suites at Midpoint`; its corporate-accommodation description and image remain in place.

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
