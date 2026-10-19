# Midpoint schema audit - 19 October 2026

## Scope and baseline

Audited all 48 public sitemap URLs against production origin release d1ee7c46fa57, 138 JSON-LD blocks. All returned 200 and parsed successfully. Traversed the official Schema.org current HTTPS vocabulary: no unknown types/properties or property-domain mismatches. This deterministic check is narrower than the external validators and does not establish Google eligibility. Existing runtime script escaping is retained. Compared the rendered public Sunbird page with its actual visible property narrative, floor area, rate, availability, contact address and schema.

Existing coverage: shared WebSite/LocalBusiness, BreadcrumbList, page types, 19 BlogPosting articles, eight FAQPage representations, four ItemList collections, 39 RealEstateListing representations across detail/collection pages. Rates remain ZAR per square metre per month; no fabricated InStock, zero-price offers, Product/reviews/ratings, operating hours or shipping/returns fields. Kingfisher area/rate numeric suppression remains in place for its unresolved conflicting source. No business-data changes.

## Corrections

- Move the published estate contact address from each individual property to its containing Midpoint estate. This avoids asserting the entrance/contact address as every unit's verified street address; unit names and the existing visible estate contact address are preserved.
- Give shared rich page nodes the existing canonical #webpage identity and WebSite relationship, matching the flat page helper.
- Use that single rich node alongside the breadcrumb in the CMS /p/[slug] template, rather than emitting a second anonymous WebPage. There are no published CMS /p routes in the current sitemap; this caller is regression-tested, not claimed live content.

All shared callers checked: about, contact, spaces, insights, generic CMS pages; vacancy detail, schedule and leasing-sector collections. No new dependency, provider, schema override, configuration or migration.

## Release and validation evidence

- Implementation ec26f009311ec74da3cafd7feca64b3450186cb6 pushed to codex/schema-audit-20261019 and main by normal fast-forward from 1aad365. No PR merge or force push. Canonical context included.
- Local suite: 190 passed / ten database-gated skipped across 51 files. Production build passed compile/type checks and all route generation.
- Hosted test job 118079233281 passed all 200 tests across 51 files with disposable database migrations/integrations. Deploy to VPS 39258345101 / deploy job 118079692225 succeeded. Server checkout and running image independently match ec26f009311e.
- Post-release origin audit: all 48 public sitemap URLs return 200 and all 138 JSON-LD blocks parse. Official current Schema.org vocabulary check again reports no unknown types/properties/property-domain mismatches. All 48 titles/canonicals remain identical; 21 pages changed schema through the shared generators. Syntax/vocabulary validation is narrower than Google's supported-feature eligibility and does not certify business facts.
- Schema.org live URL tests: 22 distinct URLs passed with zero errors and zero warnings. Each fetched HTML contains ec26f009311e. Remaining 26 submissions are blocked: after generic service errors, the validator presented an unusual-traffic challenge whose CAPTCHA could not connect. Reload did not clear it; no challenge was solved or bypassed. The pre-release Sunbird/warehouse tests had also passed, but are not counted in the 22 final-release results. The final property-address change has Google and deterministic vocabulary proof, with final Schema.org URL coverage still gated.
- Google Rich Results follow-up: 15 distinct public URL tests passed on 19 October, expanded from four. All used smartphone inspection and showed successful crawl, valid items and no invalid items or warning flags in the completed overviews. Coverage includes home, about/contact, FAQ, spaces, Insights, vacancy schedule, warehouses/serviced-office pillars, Sunbird/Kingfisher details, Suites, privacy and two articles including the newly published 6 Weaver walkthrough. About tested-page HTML independently contains ec26f009311e. These are supported-feature results, not a full Schema.org or business-fact certification. No indexing/ranking/display claim.

| Live Google URL | Crawl time, 19 October SAST | Valid items | Result |
| --- | --- | --- | --- |
| /about-us | 15:21:22 | 6 | [Google result](https://search.google.com/test/rich-results/result?id=jKVPfdcoKlpq-RThkuiC_g) |
| /vacancies/cms4oiw4v0004n60127izdqzj | 15:23:53 | 3 | [Google result](https://search.google.com/test/rich-results/result?id=TMGIbVeKUTOwnOX4lzlOtg) |
| /warehouses | 15:24:53 | 6 | [Google result](https://search.google.com/test/rich-results/result?id=CFT-TEKn0BTyMmBllktvwg) |
| /blog/warehouse-checklist-midrand-eave-height-loading-yard-space | 15:25:45 | 6 | [Google result](https://search.google.com/test/rich-results/result?id=Wyn91cn0TLKfr9lVdftW2w) |
| / | 15:37:26 | 2 | [Google result](https://search.google.com/test/rich-results/result?id=M1Dfb7GC7OSE_FWnhKl5vA) |
| /faqs | 15:38:25 | 3 | [Google result](https://search.google.com/test/rich-results/result?id=jBdSvQp6u_XG4XIYZoXxow) |
| /contact-us | 15:39:40 | 6 | [Google result](https://search.google.com/test/rich-results/result?id=QGEjBMPpvY5d91P2CaG21w) |
| /vacancies | 15:42:48 | 3 | [Google result](https://search.google.com/test/rich-results/result?id=D_TxwFJGumoQQ--NyehTNQ) |
| /services-offices | 15:43:26 | 6 | [Google result](https://search.google.com/test/rich-results/result?id=XZQZ75YzXNvfrJAg_pFwsQ) |
| /vacancies/cmsfvflha000zoy01wxkk2efu | 15:43:52 | 3 | [Google result](https://search.google.com/test/rich-results/result?id=-Z_Hqrs0lRzXYoRD74b_mg) |
| /spaces | 15:44:33 | 6 | [Google result](https://search.google.com/test/rich-results/result?id=w-AP0eAWCeaRSabbiQunZQ) |
| /insights | 15:45:08 | 6 | [Google result](https://search.google.com/test/rich-results/result?id=tHwNSDEbj4aGrNW0eXfCAQ) |
| /the-suites-at-midpoint | 15:45:46 | 2 | [Google result](https://search.google.com/test/rich-results/result?id=X_VgmI8-3etecCrq85L8cA) |
| /privacy-policy | 15:46:30 | 3 | [Google result](https://search.google.com/test/rich-results/result?id=vFKj39yhJe1adJaYMHitVQ) |
| /blog/6-weaver-avenue-warehouse-walkthrough | 15:47:11 | 6 | [Google result](https://search.google.com/test/rich-results/result?id=v8hfvB5qnvdopGO8NQBCmA) |

Detected supported families across these results: Article, Breadcrumbs, LocalBusiness and Organization. The real-estate vocabulary is retained; these commercial leasing pages were not relabelled as retail Product to manufacture a result. Google's current retirement of FAQ rich results means FAQPage vocabulary validity does not imply a Google FAQ enhancement. See [Google's June 2026 update](https://developers.google.com/search/updates#june-2026), [general structured-data policy](https://developers.google.com/search/docs/appearance/structured-data/sd-policies), and [official vocabulary](https://schema.org/version/latest/schemaorg-current-https.jsonld).

Raw origin before/after JSON and vocabulary assertions are private local evidence under tmp/schema-*.json in the isolated worktree; rendered validator summaries and inspected Google pass screenshot are in the chat visualisation schema-audit directory. Public report links can expire. Google counts include supported nested business/organization entities, not a guarantee that each item will be displayed in Search.

## Remaining gates

Complete the remaining 26 Schema.org URL submissions when access recovers. On the follow-up, validator.schema.org still redirected to an unusual-traffic challenge with blank/unavailable challenge content; the user independently confirmed it remained blocked. No additional Schema.org passes, challenge completion or bypass. Wider Google coverage is now 15/48 URLs across the page families listed above; the other 33 URLs have not been independently tested in Google during this audit. Do not replace the blocked checks with code-only validation or historical passes. No published CMS /p page exists in this sitemap; its deduplicated renderer has local regression proof only. Business-fact/source/Kingfisher reconciliation, owner UAT, search display/indexing/rankings, mobile/abandonment trends, inbox/handset receipt and prior provider/finance/legal/data/training/approval gates remain open.

## Audited URL inventory

The table records the complete final origin audit plus actual external coverage. "Blocked" means the remaining Schema.org batch was stopped by its access challenge; it is not a markup failure. A dash means that URL was not independently tested in Google during this run.

| Path | HTTP / JSON-LD blocks | Origin syntax/type/property-domain findings | Schema.org URL test | Google URL test |
| --- | --- | --- | --- | --- |
| / | 200 / 2 | None | 0 errors / 0 warnings | [Pass](https://search.google.com/test/rich-results/result?id=M1Dfb7GC7OSE_FWnhKl5vA) |
| /about-us | 200 / 2 | None | 0 errors / 0 warnings | [Pass](https://search.google.com/test/rich-results/result?id=jKVPfdcoKlpq-RThkuiC_g) |
| /spaces | 200 / 2 | None | 0 errors / 0 warnings | [Pass](https://search.google.com/test/rich-results/result?id=w-AP0eAWCeaRSabbiQunZQ) |
| /contact-us | 200 / 2 | None | 0 errors / 0 warnings | [Pass](https://search.google.com/test/rich-results/result?id=QGEjBMPpvY5d91P2CaG21w) |
| /insights | 200 / 2 | None | 0 errors / 0 warnings | [Pass](https://search.google.com/test/rich-results/result?id=tHwNSDEbj4aGrNW0eXfCAQ) |
| /vacancies | 200 / 3 | None | 0 errors / 0 warnings | [Pass](https://search.google.com/test/rich-results/result?id=D_TxwFJGumoQQ--NyehTNQ) |
| /faqs | 200 / 3 | None | 0 errors / 0 warnings | [Pass](https://search.google.com/test/rich-results/result?id=jBdSvQp6u_XG4XIYZoXxow) |
| /blog | 200 / 2 | None | 0 errors / 0 warnings | - |
| /the-suites-at-midpoint | 200 / 1 | None | 0 errors / 0 warnings | [Pass](https://search.google.com/test/rich-results/result?id=X_VgmI8-3etecCrq85L8cA) |
| /privacy-policy | 200 / 2 | None | 0 errors / 0 warnings | [Pass](https://search.google.com/test/rich-results/result?id=vFKj39yhJe1adJaYMHitVQ) |
| /blog/warehouse-checklist-midrand-eave-height-loading-yard-space | 200 / 3 | None | 0 errors / 0 warnings | [Pass](https://search.google.com/test/rich-results/result?id=Wyn91cn0TLKfr9lVdftW2w) |
| /blog/getting-the-office-to-warehouse-ratio-right-in-midrand | 200 / 3 | None | 0 errors / 0 warnings | - |
| /blog/backup-power-for-midrand-warehouses-what-generator-on-site-actually-covers | 200 / 3 | None | 0 errors / 0 warnings | - |
| /blog/warehouse-vs-industrial-space-in-midrand-what-the-terms-actually-mean | 200 / 3 | None | 0 errors / 0 warnings | - |
| /blog/commercial-storage-vs-warehouse-space-in-midrand-which-do-you-actually-need | 200 / 3 | None | 0 errors / 0 warnings | - |
| /blog/midrand-vs-isando-kempton-park-and-waterfall-comparing-gauteng-warehouse-nodes | 200 / 3 | None | 0 errors / 0 warnings | - |
| /blog/office-rental-costs-midrand | 200 / 3 | None | 0 errors / 0 warnings | - |
| /blog/compare-office-rental-quotes-midrand | 200 / 3 | None | 0 errors / 0 warnings | - |
| /blog/serviced-vs-conventional-offices-midrand | 200 / 3 | None | 0 errors / 0 warnings | - |
| /blog/onpoint-serviced-office-package-checklist | 200 / 3 | None | 0 errors / 0 warnings | - |
| /blog/office-viewing-checklist-midrand | 200 / 3 | None | 0 errors / 0 warnings | - |
| /blog/office-floor-plan-fit-out-checklist-midrand | 200 / 3 | None | 0 errors / 0 warnings | - |
| /blog/business-park-vs-standalone-premises-midrand | 200 / 3 | None | Blocked | - |
| /blog/planning-office-and-warehouse-space-midrand | 200 / 3 | None | Blocked | - |
| /blog/assess-midrand-staff-client-delivery-routes | 200 / 3 | None | Blocked | - |
| /blog/business-park-amenities-leasing-checklist | 200 / 3 | None | Blocked | - |
| /blog/warehouse-rental-costs-midrand | 200 / 3 | None | Blocked | - |
| /blog/halfway-house-vs-waterfall-office-space | 200 / 3 | None | Blocked | - |
| /blog/6-weaver-avenue-warehouse-walkthrough | 200 / 3 | None | Blocked | [Pass](https://search.google.com/test/rich-results/result?id=v8hfvB5qnvdopGO8NQBCmA) |
| /location | 200 / 3 | None | Blocked | - |
| /services-offices | 200 / 4 | None | Blocked | [Pass](https://search.google.com/test/rich-results/result?id=XZQZ75YzXNvfrJAg_pFwsQ) |
| /business-park-midrand | 200 / 3 | None | Blocked | - |
| /amenities | 200 / 3 | None | Blocked | - |
| /warehouses | 200 / 4 | None | Blocked | [Pass](https://search.google.com/test/rich-results/result?id=CFT-TEKn0BTyMmBllktvwg) |
| /offices | 200 / 4 | None | Blocked | - |
| /vacancies/cms4oiw4n0002n601y2gpa0qf | 200 / 3 | None | Blocked | - |
| /vacancies/cms4oiw560007n6019icxact3 | 200 / 3 | None | Blocked | - |
| /vacancies/cms4oiw500005n6011rnzc2hb | 200 / 3 | None | Blocked | - |
| /vacancies/cms4oiw5j000bn601vz6szme4 | 200 / 3 | None | Blocked | - |
| /vacancies/cms4oiw590008n601tuhv5okk | 200 / 3 | None | Blocked | - |
| /vacancies/cms4oiw5d0009n601702zlk0p | 200 / 3 | None | Blocked | - |
| /vacancies/cmsfuu4xu000ooy01x3ulli7b | 200 / 3 | None | Blocked | - |
| /vacancies/cms4oiw530006n601h1qw8gzm | 200 / 3 | None | Blocked | - |
| /vacancies/cmsfvflhj0010oy014b1ytkku | 200 / 3 | None | Blocked | - |
| /vacancies/cms4oiw4v0004n60127izdqzj | 200 / 3 | None | Blocked | [Pass](https://search.google.com/test/rich-results/result?id=TMGIbVeKUTOwnOX4lzlOtg) |
| /vacancies/cmuz7chn0009up901ll35sgdh | 200 / 3 | None | Blocked | - |
| /vacancies/cmsfvflfy000yoy01stx7o2dp | 200 / 3 | None | Blocked | - |
| /vacancies/cmsfvflha000zoy01wxkk2efu | 200 / 3 | None | Blocked | [Pass](https://search.google.com/test/rich-results/result?id=-Z_Hqrs0lRzXYoRD74b_mg) |
