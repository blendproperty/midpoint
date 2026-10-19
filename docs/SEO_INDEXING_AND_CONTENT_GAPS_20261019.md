# Search Console indexing and next content gaps — 19 October 2026

Publication update later on19October: the three briefs below are now live at application70c92cff0bcc, with all three Schema.org checks zero errors/warnings and Google tests six valid items each. See [publication evidence](LEASING_CONTENT_PUBLICATION_20261019.md). The 6 Weaver deliverable is a source-labelled listing review; approved plans/physical capacities/current condition and full quotes remain outstanding. Google now reports48discovered sitemap URLs after resubmission, not confirmed indexing. Original inspection results below precede these three publications; the earlier pending statuses/validations were not rechecked in this publication task. Original briefs below are retained as planning evidence, superseded by this publication update.

Private [OpenSEO report](https://app.openseo.so/p/c773b3ac-2d13-4678-ae3a-3c8ffc79ab47/reports/33596d53-5c13-4823-98f5-e27f401bfec6) saved and exact HTML readback verified; sharing remains private.

## Recorded Google index status

Connected property: https://www.mid-point.co.za/. Inspected six pillars, all ten new blogs from 19 October, Insights and the blog index. Five pillars are indexed; /services-offices is not. Both discovery hubs are indexed. All ten new blogs initially returned unknown to Google, not confirmed indexed. The quote-comparison article initially returned a Google500; retry returned a usable result. Stored inspections are not live crawls. Initial browser/API wording differed for serviced offices (unknown/discovered); both agreed it was not indexed.

| URL | Recorded coverage before requests | Last crawl UTC |
| --- | --- | --- |
| /business-park-midrand | Submitted and indexed | 2026-10-14T09:15:00Z |
| /offices | Submitted and indexed | 2026-07-30T13:41:12Z |
| /services-offices | Discovered - currently not indexed | No recorded crawl |
| /warehouses | Submitted and indexed | 2026-10-19T03:00:07Z |
| /location | Submitted and indexed | 2026-09-07T06:59:03Z |
| /amenities | Submitted and indexed | 2026-10-14T13:58:21Z |
| /blog/business-park-vs-standalone-premises-midrand | URL is unknown to Google | No recorded crawl |
| /blog/planning-office-and-warehouse-space-midrand | URL is unknown to Google | No recorded crawl |
| /blog/assess-midrand-staff-client-delivery-routes | URL is unknown to Google | No recorded crawl |
| /blog/business-park-amenities-leasing-checklist | URL is unknown to Google | No recorded crawl |
| /blog/office-rental-costs-midrand | URL is unknown to Google | No recorded crawl |
| /blog/compare-office-rental-quotes-midrand | URL is unknown to Google | No recorded crawl |
| /blog/office-viewing-checklist-midrand | URL is unknown to Google | No recorded crawl |
| /blog/office-floor-plan-fit-out-checklist-midrand | URL is unknown to Google | No recorded crawl |
| /blog/serviced-vs-conventional-offices-midrand | URL is unknown to Google | No recorded crawl |
| /blog/onpoint-serviced-office-package-checklist | URL is unknown to Google | No recorded crawl |
| /insights | Submitted and indexed | 2026-10-19T00:30:06Z |
| /blog | Submitted and indexed | 2026-10-18T16:10:04Z |

## Actions actually completed

- Resubmitted the existing sitemap once. Google accepted it and the table read back Success, submitted/read19October,45discovered pages, previously35/read17October. Discovery is not indexing.
- Google accepted eleven individual indexing requests: all ten new articles and /services-offices. Each displayed that it was added to the priority crawl queue. No repeated same-URL submission.
- Extra refreshes for already-indexed /offices, /business-park-midrand and /location returned daily quota exceeded; no accepted request claimed for those. /amenities was not attempted after the limit; /warehouses was already crawled19October. No alternate-account or quota workaround.
- Property report is dated12October,37indexed/69excluded, not this week's publication outcome. All17historical404 examples are /units/... routes; existing live308 redirects all lead to200 destinations. Started Google's404 revalidation; read back Validation started19October, not passed.
- All five historical duplicate-without-canonical examples are scoped contact enquiry variants. Each live response is200 with canonical https://www.mid-point.co.za/contact-us. Started canonical revalidation; read back Validation started19October, not passed. Existing fixes were verified, not newly implemented in this task.
- Four crawled exclusions are a canonical contact variant, old CSS asset (404), retired /coming-soon (404/noindex), and legacy /units/unit-5-and-6 (308/vacancies). These are not the new articles or pillars. Two noindex examples are malformed /& and /m² URLs, not requested content. Do not indiscriminately make exclusions indexable or resurrect old build assets/placeholders.

## Live technical verification

The18target pages all return200 without redirects, have oneH1, allow indexing through meta/header checks, use self-canonical URLs, appear in the45URL sitemap and contain substantive rendered text. Ten new articles have reciprocal pillar/blog links; Insights links the serviced-office guide. Google search groups in robots.txt allow the public pages. Separate Cloudflare training-agent restrictions remain unchanged. Initial local check incorrectly treated every agent's Disallow as Googlebot's; corrected the check's group selection and reran successfully. No production robots change.

Production release observed34787246cf08. Kingfisher warning and withholding of the disputed monthly-rent estimate passed. No runtime, schema, content, vacancy, upstream feed, analytics, contact, provider or GBP changes. No production deployment needed for this research/configuration task.

## Next content priorities

1. **Warehouse Rental Costs in Midrand: Base Rent vs Total Occupation Cost** → /warehouses. Extend the existing cost section into a concrete quote worksheet using approved current unit area/rate/period, VAT basis, recoveries, utilities, parking, deposits and fit-out scope. Do not present base rent as a complete bill. Exclude disputed Kingfisher arithmetic. Proposed slug: /blog/warehouse-rental-costs-midrand.
2. **Halfway House vs Waterfall Offices: Compare the Same Workplace Brief** → /offices, cross-link /location. Office-specific shortlist criteria and comparable approved quotes, parking/fit-out inclusions and documented route checks; no generic cheaper/faster assertion or implied third-party inventory. Distinct from the existing warehouse-node comparison and office format/cost articles. Proposed slug: /blog/halfway-house-vs-waterfall-office-space.
3. **Inside 6 Weaver Avenue: A Verified Warehouse Walkthrough** → /warehouses and /vacancies/cmsfvflfy000yoy01stx7o2dp. Requires approved floor-plan/area components, loading/door/clearance dimensions, access/power allocation, current photographs and dates, current/proposed works and occupation confirmation. No invented tenant case study. Proposed slug: /blog/6-weaver-avenue-warehouse-walkthrough.

All three are briefs, not published pages. Link each through Insights/primary pillar/related articles/live units/viewing route and validate any actual schema change before publication. Exact-title demand is unknown. Generic office-viewing, cost, fit-out, generator and loading topics are already covered. Estate enquiry-to-occupation and mixed-space handover sections already exist; improve their approved process details before making another move-in checklist.

Existing storage refresh is the runner-up measurement opportunity: South Africa query commercial storage midrand → storage article has147impressions/0clicks/average position7.0 in16July–16October. The article was refreshed16October; measure after recrawl rather than repeat the rewrite today. Qualified leads remain separate from clicks and submitted/saved enquiries.

## Competitor and demand evidence

Live-SERP endpoint retrieved19October, South Africa2710,English,desktop,depth20total blocks. Organic positions exclude ads/features; counts below are returned organic rows, not necessarily20organic listings or distinct URLs. Provider observation timestamps absent;12hour cache can apply. No ranking change caused by publication is inferred.

| Query | Current returned sample |
| --- | --- |
| office space to rent midrand | Anvil#6(page1),Midpoint not returned among14organic rows |
| warehouse to rent midrand | Anvil#4(page1),Midpoint not returned among16organic rows |
| offices to rent halfway house | Midpoint OfficeG.02#4(page1),Anvil area guide#8(page1),19organic rows |
| warehouse rental costs midrand | Neither domain in17returned organic rows; actual unit prices/comparisons dominate |
| warehouse operating costs south africa |17organic rows with mixed logistics/fulfilment/construction intent; not the proposed leasing article |
| office space to rent halfway house; warehouse power requirements south africa; commercial lease checklist south africa | Provider failures, unknown; not treated as absent rankings |

Anvil's office/warehouse catalogues and Halfway House guide visibly connect availability, local comparisons and buildings. Its published MountRoyal unit example shows the structure of area components/loading/power/cost detail; availability/rent were not independently certified. Recommendation is original first-party Midpoint evidence, not copied claims or equivalent region-wide inventory.

First-party South Africa query/page Search Analytics, final16July–16October2026,746rows/no further page: warehouse to rent in midrand→/warehouses0clicks/23impressions/average18.9; office to rent in midrand→/offices0/19/25.8; office to let in halfway house→/offices0/12/45.0. These averages are not today's sampled ranks. Pacific reporting dates; query rows can omit anonymised data. New blogs were not published in that reporting window.

Focused six-term metrics returned only warehouse to rent midrand: estimated260South African searches/month. Five exact niche terms had no returned metrics, not zero demand. No overlapping variants summed or traffic/lead forecast. OpenSEO connection balance9501→9453:48credits for focused research; no keyword saves or recurring trackers.

Sources: [Anvil office catalogue](https://www.anvilproperty.co.za/commercial-property/office-space/to-rent/midrand), [warehouse catalogue](https://www.anvilproperty.co.za/commercial-property/warehouses/to-rent/midrand), [Halfway House guide](https://www.anvilproperty.co.za/area-guides/halfway-house-11), [published unit example](https://www.anvilproperty.co.za/commercial-property/warehouses/to-rent/halfway-house/mount-royal-business-park-midrand-1875/unit-b1-30495), [Google recrawl documentation](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl). Self-review confirmed the strongest rejected storage/process opportunities, limits, geography, dates, organic-rank convention and no demand/outcome invention before saving the report.

## Release and evidence boundaries

- Implementation/configuration: Search Console sitemap and request/revalidation actions above; three content briefs and private report. No application/content/schema implementation or new dependency.
- Testing:18live target checks,45URL sitemap,17legacy redirects and five canonical variants passed. Report structure/assertions and exact remote HTML readback passed. No app build/unit suite rerun because runtime did not change. No full new crawler, Lighthouse, backlink study, real form/GA4/CRM receipt, notification or qualified-lead UAT.
- Commit/push: documentation/context evidence committed and promoted normally to main; exact commit recorded in git. Original dirty checkout/unrelated next-env.d.ts/tmp preserved. Canonical PROJECT_CONTEXT.md remote-main presence/content verified before handoff.
- Merge: documentation-only non-force fast-forward; no PR merge.
- Deployment: none for this task; live app remains34787246cf08. Remote documentation head and deployed app head intentionally differ.
- Live verification: accepted request and sitemap/validation states read back in Search Console; indexed status is still not confirmed for the eleven pending pages. Revalidation is started, not complete. Extra indexed-guide recrawls remain daily-quota gated.

Evidence retained locally under tmp/:gsc-indexing-20261019.json,indexing-gap-research.json,indexing-live-20261019.json,gsc-indexing-requests.json,gsc-legacy-examples.json/gsc-legacy-live.json,gsc-duplicate-examples.json/gsc-duplicate-live.json,gsc-legacy-validation.txt,gsc-duplicate-validation.txt,gsc-crawled-live.json,gsc-noindex-examples.txt,inspected gsc-sitemap-current-proof.png and gsc-blog-request-proof.png. Private report is the shareable-in-workspace durable result.

## Outstanding gates

Recheck pending indexed coverage around26October and persistent exclusions again after7–14days with current crawl/canonical evidence. No automation was scheduled. Google can take days/weeks and does not guarantee inclusion; requests are not a ranking fix. Owner approval of quotes/charges/package rules/availability/amenities/technical specifications/plans/current-proposed works and leasing UAT remain. Kingfisher3849/3300conflict needs approved dated area/basis/components/plans/rate/monthly/VAT/charges/approver/revision before upstream/brochure/site/schema/all dated article warnings are reconciled. Maps hours/category/photos/WhatsApp, real consented GA4-to-CRM receipt, human-qualified baseline and prior finance/legal/provider/inbox/data/training/approval gates remain open.
