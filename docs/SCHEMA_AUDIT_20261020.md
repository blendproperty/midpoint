# Midpoint real estate schema review - 20 October 2026

## Finding

No new technical schema defect found in the current public sitemap. This is a fresh audit of production, including the three listings added since yesterday's 48-page review. No application/schema/business-data edits were required or made. This does not certify the underlying property specifications or promise Google display, indexing or rankings.

## Current production evidence

- Public origin: https://www.mid-point.co.za; runtime marker on every audited page: `cd3115cfa333`. Server checkout and running `midpoint-web:cd3115cfa333` independently match `cd3115cfa333658ffecad81814ff58fea83c54fe`.
- All 51 public sitemap URLs returned HTTP 200; all 147 JSON-LD blocks parsed. Canonicals match their public URL (homepage trailing slash normalized). No additional Microdata/RDFa format was detected by the HTML attribute scan.
- All 1,215 typed node appearances were checked against the freshly downloaded official current HTTPS Schema.org vocabulary: zero unknown types, properties or property-domain mismatches. This is a bounded deterministic check, not the external Schema.org validator or a complete value-range/policy certification.
- Vacancy schedule `ItemList` contains all 16 detail URLs, with correct count and contiguous positions. Four collection lists and 48 `RealEstateListing` appearances include repetitions across their appropriate pages, not 48 separate properties.
- All 16 detail-page names, source narratives, published availability and present numeric area/rate values match visible HTML. Technical facts come from the same shared extractor as the visible specification panel. Key Features headings/list presentation are intentionally transformed by the renderer, so the narrative comparison does not assert byte-identical full descriptions.
- Each property is a `Place` within the Midpoint estate. The estate contact address is attached to the containing estate, not asserted as each individual unit's verified address. Shared `WebSite`, `LocalBusiness`, Blend `Organization`, breadcrumbs and canonical page identities are present where appropriate.
- Lease offers use `OfferForLease`, the lease-out business function, and positive ZAR rates per square metre per month. No Product, Review, AggregateRating, fabricated stock enum, zero-price specification or zero-area property claim was found.
- New STOR24 micro-warehousing/self-storage entries and Stellantis omit unknown numeric floor area and asking price. These remain enquiries/service showcases or opportunities requiring confirmation, not proof of a specific vacant storage unit or immediate occupation.
- All 19 BlogPosting nodes have a visible headline, parseable publication/modification dates, image, author and publisher. All 63 marked-up questions/answers across eight FAQPage appearances match visible HTML. Shared business telephone, email and estate address match visible contact content across all 51 pages. This confirms publication consistency, not independent geospatial or operational certification.
- Existing schema regression checks passed: 21 tests across five files (`schema-page`, `vacancy-seo`, `business-schema`, `seo-delivery`, `booking-schema`). No full application build/database suite was needed or run for this documentation-only audit.

## Fresh external tests

Google Rich Results smartphone tests completed on 20 October 2026. Each overview reports three valid items: Breadcrumbs, Local businesses and Organisation; no invalid-item or warning flag was shown in these completed overviews. Google does not separately report the real estate vocabulary as a dedicated commercial-property rich-result feature. See the [Google supported structured-data gallery](https://developers.google.com/search/docs/appearance/structured-data/search-gallery) and [RealEstateListing definition](https://schema.org/RealEstateListing).

| URL | Crawl time SAST | Google result |
| --- | --- | --- |
| /vacancies | 08:53:51 | [Three valid items](https://search.google.com/test/rich-results/result?id=WovjWi_LgeMy-2ZMJtc8PQ) |
| /vacancies/cmvgb129n0001qp01ia0fs15y | 08:54:37 | [Three valid items](https://search.google.com/test/rich-results/result?id=x8BpFiYjPHCjbGyfKU8cgA) |
| /vacancies/cmvgae265001pmz01l33cvutx | 08:54:42 | [Three valid items](https://search.google.com/test/rich-results/result?id=GcxgXE3vH1XtEujFyTc1UA) |

Schema.org validator was checked once for `/vacancies` at 06:53:38 UTC and redirected to an unusual-traffic/reCAPTCHA challenge, with unavailable challenge content. No challenge was solved or bypassed. Therefore no fresh external Schema.org pass is claimed today. Yesterday's 22 passes / 26 blocked and 15 Google page tests remain historical evidence in [the previous audit](SCHEMA_AUDIT_20261019.md), not current 51-page validator coverage. Today's Google coverage is three individual URLs; the other 48 were not individually retested there.

## Decisions and outstanding gates

- Keep appropriate real estate vocabulary. Midpoint is presented as an estate/local business; no evidence in this audit establishes that it should be relabelled `RealEstateAgent`. Do not turn rental opportunities into retail Products to obtain unsupported enhancements.
- `/vacancies` currently has a valid WebPage plus ItemList. Linking the page to that list with CollectionPage/mainEntity could improve graph organization, but its absence is not a Schema.org syntax or Google required-field error. No runtime change solely for this optional enhancement.
- Kingfisher remains unresolved: numeric source area 3,849 m² versus narrative 3,300 m². Numeric floor-area and priceSpecification are withheld throughout listing schema. The source narrative still includes the disputed 3,300 m² and associated monthly rental, and appears in the description string; withholding numeric properties does not resolve or independently validate that narrative. Visible area-confirmation notice remains. Require an approved dated lettable-area schedule/floor plan, component/basis explanation, applicable rate/full rental and an accountable approver before reconciling upstream content, site, brochures and schema. No choice of area was made during this audit.
- Stellantis area, pricing, present availability, precise address, current condition and inclusions remain unconfirmed. STOR24 actual unit sizes, availability and charges require leasing confirmation. Historic/illustrative photographs remain qualified.
- Opening hours, ratings, reviews and exact per-unit coordinates/addresses are not fabricated. FAQPage validity does not imply a Google FAQ enhancement; see [Google's June 2026 update](https://developers.google.com/search/updates#june-2026).
- Private/admin/access-controlled pages and off-site properties are outside the public sitemap audit. Search Console indexing/enhancement state, search appearance/rankings, real enquiry delivery, consented GA4/CRM reconciliation, and existing provider, finance, legal, data, training, UAT and approval gates remain open.

Private raw evidence: `tmp/schema20-live.json`, `tmp/schema20-vocabulary-result.json`, `tmp/schema20-content-result.json`, `tmp/schema20-pages-result.json` in the isolated worktree. These include timestamps and assertion outputs; no private lead records were queried. This report preserves the public per-URL inventory below.

## Public URL inventory

All entries: HTTP 200, JSON-LD parse passed, current-vocabulary type/property/domain check passed. External Google coverage is limited to the three links above; Schema.org external access remains blocked.

| Path | JSON-LD blocks |
| --- | --- |
| / | 2 |
| /about-us | 2 |
| /spaces | 2 |
| /contact-us | 2 |
| /insights | 2 |
| /vacancies | 3 |
| /faqs | 3 |
| /blog | 2 |
| /the-suites-at-midpoint | 1 |
| /privacy-policy | 2 |
| /blog/warehouse-checklist-midrand-eave-height-loading-yard-space | 3 |
| /blog/getting-the-office-to-warehouse-ratio-right-in-midrand | 3 |
| /blog/backup-power-for-midrand-warehouses-what-generator-on-site-actually-covers | 3 |
| /blog/warehouse-vs-industrial-space-in-midrand-what-the-terms-actually-mean | 3 |
| /blog/commercial-storage-vs-warehouse-space-in-midrand-which-do-you-actually-need | 3 |
| /blog/midrand-vs-isando-kempton-park-and-waterfall-comparing-gauteng-warehouse-nodes | 3 |
| /blog/office-rental-costs-midrand | 3 |
| /blog/compare-office-rental-quotes-midrand | 3 |
| /blog/serviced-vs-conventional-offices-midrand | 3 |
| /blog/onpoint-serviced-office-package-checklist | 3 |
| /blog/office-viewing-checklist-midrand | 3 |
| /blog/office-floor-plan-fit-out-checklist-midrand | 3 |
| /blog/business-park-vs-standalone-premises-midrand | 3 |
| /blog/planning-office-and-warehouse-space-midrand | 3 |
| /blog/assess-midrand-staff-client-delivery-routes | 3 |
| /blog/business-park-amenities-leasing-checklist | 3 |
| /blog/warehouse-rental-costs-midrand | 3 |
| /blog/halfway-house-vs-waterfall-office-space | 3 |
| /blog/6-weaver-avenue-warehouse-walkthrough | 3 |
| /location | 3 |
| /services-offices | 4 |
| /business-park-midrand | 3 |
| /amenities | 3 |
| /warehouses | 4 |
| /offices | 4 |
| /vacancies/cmvgae26d001qmz019ja0mhjg | 3 |
| /vacancies/cms4oiw4n0002n601y2gpa0qf | 3 |
| /vacancies/cmvgb129n0001qp01ia0fs15y | 3 |
| /vacancies/cms4oiw560007n6019icxact3 | 3 |
| /vacancies/cms4oiw500005n6011rnzc2hb | 3 |
| /vacancies/cms4oiw5j000bn601vz6szme4 | 3 |
| /vacancies/cmsfuu4xu000ooy01x3ulli7b | 3 |
| /vacancies/cms4oiw530006n601h1qw8gzm | 3 |
| /vacancies/cmvgae265001pmz01l33cvutx | 3 |
| /vacancies/cms4oiw590008n601tuhv5okk | 3 |
| /vacancies/cms4oiw5d0009n601702zlk0p | 3 |
| /vacancies/cmsfvflha000zoy01wxkk2efu | 3 |
| /vacancies/cmsfvflhj0010oy014b1ytkku | 3 |
| /vacancies/cms4oiw4v0004n60127izdqzj | 3 |
| /vacancies/cmuz7chn0009up901ll35sgdh | 3 |
| /vacancies/cmsfvflfy000yoy01stx7o2dp | 3 |
