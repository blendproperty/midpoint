# Midpoint schema audit - 19 October 2026

## Scope and baseline

Audited all 48 public sitemap URLs against production origin release d1ee7c46fa57, 138 JSON-LD blocks. All returned 200 and parsed successfully. Traversed the official Schema.org current HTTPS vocabulary: no unknown types/properties or property-domain mismatches. This deterministic check is narrower than the external validators and does not establish Google eligibility. Existing runtime script escaping is retained. Compared the rendered public Sunbird page with its actual visible property narrative, floor area, rate, availability, contact address and schema.

Existing coverage: shared WebSite/LocalBusiness, BreadcrumbList, page types, 19 BlogPosting articles, eight FAQPage representations, four ItemList collections, 39 RealEstateListing representations across detail/collection pages. Rates remain ZAR per square metre per month; no fabricated InStock, zero-price offers, Product/reviews/ratings, operating hours or shipping/returns fields. Kingfisher area/rate numeric suppression remains in place for its unresolved conflicting source. No business-data changes.

## Corrections

- Move the published estate contact address from each individual property to its containing Midpoint estate. This avoids asserting the entrance/contact address as every unit's verified street address; unit names and the existing visible estate contact address are preserved.
- Give shared rich page nodes the existing canonical #webpage identity and WebSite relationship, matching the flat page helper.
- Use that single rich node alongside the breadcrumb in the CMS /p/[slug] template, rather than emitting a second anonymous WebPage. There are no published CMS /p routes in the current sitemap; this caller is regression-tested, not claimed live content.

All shared callers checked: about, contact, spaces, insights, generic CMS pages; vacancy detail, schedule and leasing-sector collections. No new dependency, provider, schema override, configuration or migration.

## Validation evidence

- Baseline Schema.org live URL tests: Sunbird detail and warehouses pillar returned zero errors and zero warnings. These were pre-change checks, not final-release proof.
- Local suite: 190 passed / ten database-gated skipped across 51 files; regression covers single identified page/breadcrumb serialization, graph relationship and estate-address scope. Production build passed compile/type checks and all route generation.
- Final deployment and live Schema.org/Google URL results: pending.
- Google Rich Results attempts failed before a page test because its reCAPTCHA service could not connect; second attempt after reload failed identically. These are tool failures, not page-validation failures or passes. Retry after deployment; record any remaining blocker without substituting old results.

Google's June 2026 update removed FAQ rich-result support; retain accurate visible FAQ vocabulary but do not promise a Google FAQ enhancement. https://developers.google.com/search/updates#june-2026 . General policy: https://developers.google.com/search/docs/appearance/structured-data/sd-policies . Official vocabulary: https://schema.org/version/latest/schemaorg-current-https.jsonld . Google eligibility and actual search display/indexing are separate from vocabulary validity.

## Audited URL inventory

The table records the complete origin baseline, not 48 Google or Schema.org external submissions.

| Path | HTTP | JSON-LD blocks | Parse/type/property-domain findings |
| --- | --- | --- | --- |
| / | 200 | 2 | None |
| /about-us | 200 | 2 | None |
| /spaces | 200 | 2 | None |
| /contact-us | 200 | 2 | None |
| /insights | 200 | 2 | None |
| /vacancies | 200 | 3 | None |
| /faqs | 200 | 3 | None |
| /blog | 200 | 2 | None |
| /the-suites-at-midpoint | 200 | 1 | None |
| /privacy-policy | 200 | 2 | None |
| /blog/warehouse-checklist-midrand-eave-height-loading-yard-space | 200 | 3 | None |
| /blog/getting-the-office-to-warehouse-ratio-right-in-midrand | 200 | 3 | None |
| /blog/backup-power-for-midrand-warehouses-what-generator-on-site-actually-covers | 200 | 3 | None |
| /blog/warehouse-vs-industrial-space-in-midrand-what-the-terms-actually-mean | 200 | 3 | None |
| /blog/commercial-storage-vs-warehouse-space-in-midrand-which-do-you-actually-need | 200 | 3 | None |
| /blog/midrand-vs-isando-kempton-park-and-waterfall-comparing-gauteng-warehouse-nodes | 200 | 3 | None |
| /blog/office-rental-costs-midrand | 200 | 3 | None |
| /blog/compare-office-rental-quotes-midrand | 200 | 3 | None |
| /blog/serviced-vs-conventional-offices-midrand | 200 | 3 | None |
| /blog/onpoint-serviced-office-package-checklist | 200 | 3 | None |
| /blog/office-viewing-checklist-midrand | 200 | 3 | None |
| /blog/office-floor-plan-fit-out-checklist-midrand | 200 | 3 | None |
| /blog/business-park-vs-standalone-premises-midrand | 200 | 3 | None |
| /blog/planning-office-and-warehouse-space-midrand | 200 | 3 | None |
| /blog/assess-midrand-staff-client-delivery-routes | 200 | 3 | None |
| /blog/business-park-amenities-leasing-checklist | 200 | 3 | None |
| /blog/warehouse-rental-costs-midrand | 200 | 3 | None |
| /blog/halfway-house-vs-waterfall-office-space | 200 | 3 | None |
| /blog/6-weaver-avenue-warehouse-walkthrough | 200 | 3 | None |
| /location | 200 | 3 | None |
| /services-offices | 200 | 4 | None |
| /business-park-midrand | 200 | 3 | None |
| /amenities | 200 | 3 | None |
| /warehouses | 200 | 4 | None |
| /offices | 200 | 4 | None |
| /vacancies/cms4oiw4n0002n601y2gpa0qf | 200 | 3 | None |
| /vacancies/cms4oiw560007n6019icxact3 | 200 | 3 | None |
| /vacancies/cms4oiw500005n6011rnzc2hb | 200 | 3 | None |
| /vacancies/cms4oiw5j000bn601vz6szme4 | 200 | 3 | None |
| /vacancies/cms4oiw590008n601tuhv5okk | 200 | 3 | None |
| /vacancies/cms4oiw5d0009n601702zlk0p | 200 | 3 | None |
| /vacancies/cmsfuu4xu000ooy01x3ulli7b | 200 | 3 | None |
| /vacancies/cms4oiw530006n601h1qw8gzm | 200 | 3 | None |
| /vacancies/cmsfvflhj0010oy014b1ytkku | 200 | 3 | None |
| /vacancies/cms4oiw4v0004n60127izdqzj | 200 | 3 | None |
| /vacancies/cmuz7chn0009up901ll35sgdh | 200 | 3 | None |
| /vacancies/cmsfvflfy000yoy01stx7o2dp | 200 | 3 | None |
| /vacancies/cmsfvflha000zoy01wxkk2efu | 200 | 3 | None |
