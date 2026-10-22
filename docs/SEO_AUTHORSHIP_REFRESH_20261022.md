# Authorship and leasing-page refresh — 22 October 2026

## Selection from current Search Console data

Read the connected `https://www.mid-point.co.za/` property on 22 October. Selected the latest complete 28-day window, **23 September–20 October 2026**, final Google web data, **South Africa**, all devices. Dates are Pacific Time. A preliminary daily check showed final data through 20 October; the requested 21 October endpoint had no final daily row. No paid research, recurring tracking or external tracker changes.

| Page | Clicks | Impressions | Average position | Decision |
| --- | ---: | ---: | ---: | --- |
| `/warehouses` | 0 | 96 | 11.7 | Highest priority transactional warehouse destination. Add an actionable shortlist with office/warehouse component questions and direct unit links. |
| `/offices` | 0 | 26 | 9.2 | Small but directly relevant local leasing audience. Add office shortlist, quote preparation and viewing links. |
| `/insights` | 0 | 198 | 14.3 | Existing discovery hub; clarify office/warehouse leasing purpose and link directly to sector-filtered vacancies. Replace the old literally truncated description. |

`warehouse space` → Insights: 35 impressions, 0 clicks, average 13.9; `office and warehouse space midrand` → warehouses: 9/0/10.8; `warehouse and office space midrand`: 7/0/10.4; `commercial offices midrand` → offices: 5/0/13.0. These are separate query/page observations, not additive demand estimates or current sampled ranks. The office page's small sample limits confidence. Broad global/page averages were not treated as South African buyer-query rankings.

Retain the storage refresh from 16 October and regional-comparison refresh from 19 October while they gather post-recrawl evidence. The older industrial-terminology article is a runner-up, with only 27 South African impressions and average 7.1; it already answers its main definitional intent. Current money pages and the discovery hub offer a more direct path to enquiries. The recently published office articles likewise need more observation time, not immediate rewrites.

Saved first-party page rows and relevant query/page rows: [selection evidence](seo-sprint-selection-20261022.json). Google may omit anonymised query rows. Full query response: 657 rows, no further page; only shortlisted pages/runners-up are retained in the evidence file. No volume, traffic, revenue or ranking forecast is asserted.

## Implementation

- User confirmed **Blend Property Group** as the public author. `ContentAuthor` uses the existing organisation generator for its visible name, official profile URL and factual company bio. BlogPosting already uses that identity; pillar WebPage/CollectionPage nodes now declare the same author. No invented individual, credential or review is added.
- The shared blog and pillar templates display that credit across 19 published articles and six public guides. Existing named property reviewers and their dates are preserved; this work does not assert a new review by them. Adding template authorship does not rewrite article publication/modified dates.
- Offices and warehouses retain their existing content, with a new shortlisting section after the first paragraph and refreshed descriptions. Four named links use freshly verified published units: 6 Weaver, 1 Kingfisher, Unit 7 Sunbird GF and Unit 1 at 1 Weaver. Link copy requires confirmation of current availability, plans, technical allocation, condition, proposed works and full quotes; it adds no numeric specification or price.
- Insights gains a clearer leasing heading/introduction and three sector-filtered vacancy links. Its CMS metadata override is refreshed, so old stored metadata cannot mask the change.
- Guarded migration `20261022120000_seo_refresh` compares every edited field with the reviewed production snapshot, normalising CRLF for comparison. A changed target is skipped rather than overwritten; live readback must establish all three targets actually applied. URLs, original publication dates, images, relationships, vacancy records, source sync and reviewer dates remain untouched.
- Reviewed before/after content: [manifest](../prisma/content/seo-refresh-20261022.json). No dependency, provider, contact destination, analytics/consent, enquiry-processing or external-profile change.

## Validation and release evidence

- Local full suite: **218 tests across 59 files passed**, including disposable PostgreSQL booking/vacancy integration, migration line endings, rerun behaviour and owner-edit preservation. Focused regression also compares the rendered author name/profile/bio with both article and guide schema.
- Full production build passed, including locked schema-validator setup, three adapter-control groups and eight source-generator checks. The new CMS migration also applied successfully to a fresh disposable PostgreSQL database.
- Browser preview of the production build with public-source snapshots: **26 pages**, matching visible/schema author on **25 content pages**, correct canonical URLs, one H1 each, zero independent schema errors/warnings. All **71** internal link destinations returned 200. Twelve layouts across Insights, offices, warehouses and a representative blog at **1440/390/320 px** had no document horizontal overflow. Representative screenshots visually inspected. Preview upload images are not production media verification.
- Official Schema.org entry point retried in the normal Edge Work browser at **10:51:33 UTC / 12:51:33 SAST**: redirected immediately to Google's unusual-traffic CAPTCHA before reaching the validator. No URL submitted or official result obtained; no challenge interaction/bypass. Independent checks are not official passes. Existing **34 pending Midpoint official URL checks** remain pending (combined existing queue: 36 including 2 STOR24).
- Commit/push: pending final source commit and hosted CI. Merge: pending. Deployment/configuration: pending normal release. Live production checks: pending; preview results do not establish production behaviour.

## Remaining gates

Verify exact-source hosted CI, normal promotion/deployment, actual application migration, final public schema/content/links/layout and canonical remote context before handoff. After recrawl, compare equivalent Search Console windows and qualified enquiries; neither the implementation nor validation establishes indexing/ranking/lead uplift.

Preserve Kingfisher's 3,849/3,300 m² conflict and existing rent/schema safeguards; approved area schedules/plans, rates, VAT/recoveries/other charges, availability, technical capacities/allocations, current versus proposed works, amenity/package facts and owner acceptance remain outstanding where previously recorded. Real consented GA4-to-CRM receipt, human-qualified baseline, physical-device/customer UAT and all prior provider/payment, privacy/legal/finance, data/training/approval gates remain open. This sprint performs no real enquiry or notification test and does not complete the historical official-validation queue.
