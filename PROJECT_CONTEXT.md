# Midpoint Project Context

This is the canonical delivery record for production-impacting Midpoint work. A task is complete only when each applicable stage below has evidence; unresolved gates remain explicit.

## 2026-09-11 — Brett administrator access recovery

- Implementation/configuration: verified the requested existing account and retained its SUPER_ADMIN role. At the user's explicit request, replaced its password with a cryptographically random credential, invalidated previous unused reset tokens, and created a one-use, one-hour staging password-setup link. No password, hash or reset token is recorded here. Accounts remain shared with production; the password change affects both hosts.
- Testing/live verification: normal HTTPS staging login returned 200; its issued session then loaded /admin/suites with HTTP 200. This proves authentication and dashboard rendering, not full operational UAT.
- Deployment: account-data recovery only; no runtime code or infrastructure deployment. SMTP configuration variables are populated, but delivery remains unverified and the reset-email URL still uses the configured shared domain. This recovery does not claim to fix email delivery or host selection.
- Commit/push/merge: evidence-only update to be fast-forwarded to origin/main with CI skip; no application changes or PR merge. Remaining operational, finance and staff-UAT gates below remain unchanged.

## 2026-09-11 — Suites staff operations workspace

### Implementation

- Premium responsive staff shell and sign-in, live database overview, searchable/paginated reservations and guest directory, staff-created unpaid test bookings, private reservation notes, room-readiness handover and checkout-to-dirty workflow. Calendar navigation and inventory feedback improved; existing website management remains accessible.
- Added migration 20260911060000_suites_operations for readiness metadata and private BookingNote records. Existing rooms start UNASSESSED. Staff actions retain session authentication, transactional room allocation and test-only reservation boundaries.
- Review guide: docs/SUITES_ADMIN_REVIEW.md. Staging /admin opens /admin/suites; original website dashboard remains available through Website management.

### Testing

- Local disposable PostgreSQL integration run: 25 files / 95 tests passed, including staff creation/idempotency, notes, readiness and checkout; existing concurrency tests passed. Nine authenticated admin routes passed the local smoke script.
- Authenticated local browser: created an unpaid test reservation, saved an internal note and room-readiness update; reviewed desktop overview and mobile reservation/navigation layouts. Synthetic records exist only in the disposable local database.
- Final release run: all 95 tests passed with PostgreSQL enabled; npm run build passed compilation, type checks and route generation. Repeated all nine authenticated admin smoke routes against the compiled production build: passed. Desktop login/overview visually checked at 1440px; overview document width 1425px with no horizontal overflow. Saved local Room 01 INSPECTED state/note read back from PostgreSQL.

### Commit and push

- Runtime commit 51e19cd5e1ab121fe3c12fdf9673df24451aed86 pushed from codex/suites-staging to origin/main, baseline 259c67c2f7d28d5fc2c576d9de5eca3540f2774b. Unrelated root changes and generated files excluded. Follow-up evidence-only commit uses CI skip.

### Merge

- Fast-forward promotion to main completed; no PR merge.

### Deployment and configuration

- GitHub Actions Deploy to VPS run 34557535242 succeeded at 03:16:51 UTC (05:16:51 SAST), including PostgreSQL tests, server image build, migration deployment and served-release check. Runtime deployment identifier 51e19cd5e1ab. No finance provider, real payment collection, refunds or guest email delivery enabled.

### Live production verification

- Live HTTP checks after deployment: staging /admin/login and /stay returned 200 with deployment 51e19cd5e1ab and noindex/nofollow/noarchive/nosnippet header. Staging robots.txt remains User-agent: * / Disallow: /. Unauthenticated /admin/suites, /admin/housekeeping and /admin/guests redirect 307 to /admin/login; no private content exposed.
- Production home and Suites showcase returned 200 with deployment 51e19cd5e1ab; /stay and /api/stay remained true 404. Browser refreshed the deployed login and visually verified the new design.
- Local compiled-build browser additionally verified guest search to matching reservation history, original website dashboard access, calendar, mobile login (390px document/viewport) and persisted readiness screen (375px document within 390px viewport). Local test server/database stopped without deleting data.
- Authenticated deployed operations have NOT been exercised in this run: no production staff credentials were created or bypassed. Local authenticated/database proof and successful deployment are distinct from staff UAT.

### Outstanding gates

- Authenticated deployed staff UAT, approved inventory/opening dates, pricing/policies, provider decision and finance integration, real guest emails, data retention and staff training remain required before operational launch. Existing roles remain SUPER_ADMIN/EDITOR, not granular hotel roles. No channel-manager synchronisation or financial reporting/reconciliation is claimed.
- Existing public-page duplicate contact-form feedback remains outside this admin release.

## 2026-09-10 — Main navigation opens Suites showcase first

### Implementation

- Corrected both desktop and mobile "Book a Stay" menu links from /stay to /the-suites-at-midpoint. The showcase hero's "Book your stay" still opens /stay. This preserves the requested showcase-first journey.

### Testing

- Local tests: 24 files passed; 89 tests passed and 2 database integration tests skipped. Added coverage for both menu variants; existing hero destination coverage retained. Type checking passed, exit 0. Deployment CI tests/build passed.

### Commit and push

- Runtime commit f3ae2c0b00c3757ecff7731143d6890b7c656216 pushed to origin/main from codex/suites-staging, baseline 1f30d0f55febee8bea7d7ee44ebd24d57f5e19e4. Unrelated root/generated files preserved. Follow-up evidence-only commit uses CI skip.

### Merge

- Fast-forward promotion completed; no PR merge.

### Deployment and configuration

- GitHub Actions run 34482581305 completed successfully for f3ae2c0b00c3757ecff7731143d6890b7c656216. No data or configuration changes.

### Live production verification

- Browser verification on staging: refreshed previously stale /stay tab; opened responsive menu and clicked Book a Stay; URL changed to /the-suites-at-midpoint with showcase heading. Clicked Book your stay; URL changed to /stay with Find your stay heading. Repeated menu navigation and left showcase open.
- Served HTML contains both menu variants targeting /the-suites-at-midpoint; staging noindex response header remains. Production /stay still returns 404.

### Outstanding gates

- All test-only booking, provider, commercial approval and UAT gates remain. Duplicate contact-form feedback remains unresolved and is not part of this navigation-only fix.

## 2026-09-10 — Suites hero booking button

### Implementation

- Replaced the staging showcase hero's "Check dates" label with "Book your stay"; its existing /stay destination is retained. The showcase page remains /the-suites-at-midpoint.
- Production uses "Request availability" and retains its enquiry anchor because live bookings remain disabled. No booking activation or unrelated layout changes.

### Testing

- Added regression coverage for staging label/destination and production enquiry fallback. Local tests: 24 files passed, 88 tests passed, 2 database integration tests skipped (database not enabled for this copy change). Type checking passed, exit 0.

### Commit and push

- Runtime commit 35175c493d27896246d7c1a31817a38b6e3ab755 pushed from codex/suites-staging to origin/main, fast-forward from verified 7496dcfcc1b803c137d787940b1adae450654375. Unrelated root/generated changes preserved. Follow-up evidence-only context commit uses CI skip.

### Merge

- Fast-forward promotion completed; no PR merge.

### Deployment and configuration

- GitHub Actions run 34481543440 completed successfully, including tests and server deployment. No configuration or database changes.

### Live production verification

- Verified served staging showcase HTML on 2026-09-10: the cyan hero anchor is labelled "Book your stay" with href="/stay". Showcase and destination /stay return 200; staging noindex remains in place.
- Production showcase retains enquiry fallback ("Request availability" to #request-to-book), while production /stay remains excluded. No real booking/payment activation.

### Outstanding gates

- Existing test-only booking, provider, commercial approval and UAT gates remain unchanged. Duplicate contact-form feedback remains separate and unresolved.

## 2026-09-10 — Correct accommodation branding

### Implementation

- Corrected accommodation category names to Studio and Executive Suite under The Suites at Midpoint. OnPoint remains the separate serviced-office brand.
- Added scoped data migration for existing category names/slugs and unsent TEST_PREVIEW confirmation bodies. Stable category IDs and reservation relationships remain unchanged; historical migrations are preserved.
- New room URLs are /stay/studio and /stay/executive-suite. Legacy room URLs redirect with search details preserved; old checkout links remain accepted. Updated booking metadata.

### Testing

- Local migration applied successfully to disposable PostgreSQL. All 23 test files / 89 tests passed, including migrated category labels, legacy slug compatibility and booking transaction integration.
- Type checking passed (npx tsc --noEmit, exit 0). Deployment CI also passed its tests and production build.
- Initial extended HTTP check used an incorrect test assertion (expected category object, while API returns a string). Corrected the smoke-script assertion; deployed API behavior was unchanged. Repeated smoke passed.

### Commit and push

- Runtime commit eec61f60d650c4a6e009a04e44989519095b5964 pushed to origin/main from codex/suites-staging, fast-forward from verified 9cd7e7a40f4cde73d54dc3f14720da9a36eb132c. Root checkout changes and generated files preserved.
- Follow-up delivery evidence and corrected smoke-script assertion are committed with CI skipped; no additional runtime change.

### Merge

- Fast-forward promotion to main completed; no PR merge.

### Deployment and configuration

- GitHub Actions run 34479871731 completed successfully for eec61f60d650c4a6e009a04e44989519095b5964, including data migration and application deployment. Staging domain and production booking exclusion remain unchanged.

### Live production verification

- Staging /stay with 2027-01-08 to 2027-01-10 dates returned 200 with the correct accommodation title, /stay/studio links and no old OnPoint category names; noindex response header remains present.
- /stay/studio and /stay/executive-suite returned 200 with Studio / Executive Suite titles under The Suites at Midpoint. Legacy /stay/onpoint-studio emitted Next.js redirect plus meta refresh preserving dates and guest count to /stay/studio.
- Deployed HTTP booking smoke passed with TEST-260910-A78C950CD2, including Studio category, confirmation preview without OnPoint, legacy checkout, renamed detail routes, quote/hold/payment simulation, private access, calendar and cancellation request.
- Production homepage returned 200, production /stay remained 404, and serviced-office page returned 200 retaining Serviced Offices in Midrand | OnPoint at Midpoint.

### Outstanding gates

- Booking remains simulated: all commercial, inventory, provider/email, operational approval and UAT gates below remain open. Earlier duplicate-contact-form and hero-button wording feedback is separate and not changed by this branding correction.
- Two synthetic bookings were created during live smoke checks. The first check stopped after simulated confirmation due to the test-script assertion; staff should cancel that booking-qa@example.test record. The successful repeat has a cancellation request pending. No real payment or external email occurred.

## 2026-09-10 — Testable Suites booking platform

### Implementation

- Added the staging guest journey: date search, two room categories, supplied-image lightbox, server-priced checkout, 15-minute physical-room holds, simulated success/decline/corporate payments, confirmation, captured email previews, calendar/text downloads and private booking management/cancellation requests.
- Added authenticated booking dashboard, 14-day physical-room calendar, maintenance blocking, reassignment/date amendment, check-in/out, no-show, staff cancellation/test refund and simulated balance settlement. Inventory/base rates and validated policy, discount, extras and date-rule editors are configurable.
- PostgreSQL exclusion constraint independently prevents overlapping active reservations. Booking, maintenance and inventory mutations use transaction-scoped locks; expiry and idempotency are enforced server-side.
- Explicit SAMPLE configuration: 12 Studio / 6 Executive within the 18-room inventory; R1,150 / R1,650; 7-night 10%, 30-night 20%, MIDPOINT10 and CORP15. These are test fixtures, not approved operational inventory/rates.
- Captured first/last source, medium and campaign on bookings; suppressed production analytics tags and internal page-view counting on staging. Production booking routes remain closed.
- Added dated market references and operating/test instructions in docs/SUITES_BOOKING_TEST_GUIDE.md. No generated accommodation imagery, real card processing or external email transmission.
- Deployment workflow now tests migrations and concurrency against disposable PostgreSQL and applies additive migrations before switching the web container.

### Testing

- 2026-09-10: all 46 migrations applied successfully to dedicated disposable PostgreSQL 16 on localhost:55439.
- 2026-09-10: 22 test files / 86 tests passed with real database integration enabled. Includes invalid dates/pricing, two simultaneous last-room attempts, database exclusion enforcement, idempotency, declined/successful/corporate payment, single-message confirmation, expired holds, adjacent stays, conflicting/valid amendments, settlement, check-in/out, cancellation/refund, maintenance and production route exclusion.
- HTTP smoke passed locally for quote, hold, duplicate request, unauthorized access, cross-origin rejection, payment outcomes, confirmation message, calendar download, private-code lookup, cancellation request, guest routes and unauthenticated admin protection.
- All four admin screens rendered HTTP 200 with a local-only signed test session. No production admin credentials were exposed or created.
- Browser verification: mobile 390px results and room-gallery navigation; desktop 1440px detail/summary and navigation. No horizontal document overflow in inspected results/detail viewports.
- 2026-09-10: final production build passed compilation, type checking, page generation and build tracing (exit 0). Deployment verification follows below.

### Commit and push

- Implementation commit ca3b999146e9294f12bdf5674efd2cdfacfaa297 was pushed to origin/main from .worktrees/suites-staging, branch codex/suites-staging. Verified baseline: 715a4cb93fad44e31d99137555b17673dc1ea3e3.
- Follow-up guard commit dfc5e3dfe37949fdb0f02c20a9cfe159f2b83bc3 was also fast-forward pushed to origin/main. This evidence-only context update is committed separately with CI skipped; it changes no deployed runtime code.
- Unrelated changes in the root checkout are preserved. Generated next-env.d.ts and tsconfig.tsbuildinfo are excluded.

### Merge

- Implementation was promoted directly by fast-forward push to origin/main; no PR merge.

### Deployment and configuration

- GitHub Actions Deploy to VPS run 34478215420 completed successfully for ca3b999146e9294f12bdf5674efd2cdfacfaa297. Staging and production share one application/container/database; this change does not claim full infrastructure isolation.
- Final guard deployment run 34478909187 completed successfully for dfc5e3dfe37949fdb0f02c20a9cfe159f2b83bc3, including migration/integration-test gate and production build.
- New booking flows are staging-host gated, reservations are explicitly TEST, payment simulation never collects cards, and all email messages remain TEST_PREVIEW outbox records.

### Live production verification

- On 2026-09-10, staging and production served deployment ca3b999146e9. Production homepage HTTP 200; production booking API HTTP 404.
- Staging /stay HTTP 200 with X-Robots-Tag noindex, nofollow, noarchive, nosnippet; robots.txt disallows all. The served staging page excludes the production GTM script and shows 12 Studio / 6 Executive test rooms on unoccupied dates.
- Deployed synthetic HTTP journey passed with reference TEST-260910-109033E9D2: server quote, hold, retry idempotency, private access denial, origin protection, declined/success payment, one email preview, calendar download, private retrieval, cancellation request and admin protection. No money or email was transmitted.
- Live browser verification confirmed MIDPOINT10 changes the two-night Studio total to R2,070, then preserves dates and code in checkout; adding test late checkout updates the total to R2,320.
- Found production page exclusion was a streamed not-found screen with HTTP 200 rather than a true 404. Added an early middleware guard for /stay, its descendants, /manage-booking and /api/stay. After deployment dfc5e3dfe379, production /stay and /manage-booking both returned HTTP 404; staging /stay remained HTTP 200 with noindex response headers.
- The complete browser journey also confirmed synthetic reference TEST-260910-045C1D0A15 at R2,320, PAID (test), with the captured confirmation email and acknowledged cancellation request. Mobile confirmation/cancellation was visually checked at 390px. No real card, money or external email was used.
- Production homepage remains HTTP 200, robots metadata index/follow and WhatsApp destination 27600185206; /amenities remains HTTP 200 with The Suites at Midpoint heading.
- Temporary local app/database processes were stopped after testing. The disposable test database was retained, not deleted.
- The full HTTP smoke was repeated successfully on final deployment dfc5e3dfe379 with reference TEST-260910-B99B4E963F. This and the earlier HTTP/browser synthetic records have cancellation requests waiting for staff review.

### Outstanding gates

- Final room numbering/category split, image mapping, bed/capacity confirmation, commercial rates, tax/invoicing, extras, corporate eligibility and cancellation/operating terms require approval.
- Real gateway selection/integration, verified webhooks/reconciliation/refunds, approved sender configuration and actual email delivery, retention/abuse monitoring and staff/customer UAT remain live-readiness gates.
- This is a single-property test booking engine, not a full Booking.com marketplace. Per-day availability heatmaps, multi-room carts, advanced drag-and-drop pricing/calendar editing and external channel-manager synchronization are not delivered.
- Synthetic HTTP test bookings remain clearly labelled and can be cancelled by staff; no real reservations, payments or emails were made.

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
