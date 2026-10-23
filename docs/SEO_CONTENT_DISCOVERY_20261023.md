# Storage routing and blog discovery - 23 October 2026

## Selection

The user deferred official Google/Schema.org validation and asked for other SEO implementation. The 22 October office/warehouse/Insights refresh is too recent to assess; do not repeatedly rewrite those pages or claim a ranking improvement. Fresh OpenSEO Search Console reads used no research credits. The final-date probe returns dates only through 20 October, so selection uses the complete **23 September-20 October 2026**, final Google web, South Africa, all-device window (Pacific dates).

The storage comparison article recorded **240 impressions / one click / average position 10.8**. Within that page, commercial storage Midrand has 62 impressions / zero clicks / average 10.6; business storage Midrand 50 / zero / 14.2; Midrand self storage 30 / zero / 3.4. These are distinct query observations, not additive demand or rank guarantees. The blog archive has 15 impressions / zero clicks / average 19.7, a small sample. [Selection evidence](seo-discovery-selection-20261023.json).

## Implementation

- The storage article's 16 October wording predates the two STOR24 service listings published on 20 October and gives no direct route to them. Two reviewed content replacements now link the exact micro-warehousing and self-storage detail URLs, distinguish business stock/equipment from furniture/personal storage, and update the existing small-storage FAQ answer. Current source data was read directly from production before preparing the patch.
- Both entries have unknown numeric area/rate and Contact Boitumelo availability. Copy states that these are service offerings, not real-time vacant-unit inventory. The micro listing's starting-size statement remains explicitly subject to an actual suitable unit; business activities require approval. No prices, unit vacancy, included services, access hours or operating amenity claims were invented.
- The article's URL, title, SEO title/description, cover, excerpt, original 3 September publication date, pillar relationship and Kingfisher warning are retained. Only contentHtml/updatedAt change through an exact reviewed-content guard normalized for CRLF/LF. Repeated migration is a no-op and later editor changes or unpublished content are skipped.
- The blog archive now has a descriptive Midrand property/leasing title, H1 and description, six crawlable topic links to the existing pillar guides, and direct vacancy/budget-tool links. Existing article cards remain in publication order; 19 posts retained. Added section headings and nested article headings preserve heading order. No new component/dependency/schema type/data model.

## Local validation

- 226 tests / 61 files passed with disposable PostgreSQL booking/vacancy integration, including the new CRLF/idempotency/owner-edit/draft protection regression.
- Production build/type/route generation and existing independent schema controls passed. Official Google/Schema.org tests remain deliberately on hold, not substituted by local checks.
- Compiled preview at 1440/390/320px: six topic links, 19 article headings, one H1 and no horizontal document overflow; desktop/mobile screenshots visually reviewed. Actual article-to-micro-warehousing click reached the expected current record with pricing and area on request. Article original publication date and Kingfisher warning verified in rendered HTML/schema.
- A fresh protected production database archive is saved under `/opt/midpoint/backups/seo-discovery-20261023/before.dump` (420,621 bytes, mode 600); pg_restore listing succeeded, but full restore is **not tested** for this archive. Previous runtime retained as `midpoint-web:rollback-seo-discovery-20261023`. No disaster-recovery completion claim.

## Release status

Implementation is locally tested; commit/push, PR merge, deployment and live production acceptance are pending at this entry. Canonical PROJECT_CONTEXT.md records stages and will be updated with release evidence after promotion. Original dirty user checkout/unrelated work is preserved in the managed worktree.

## Remaining work

Measure storage-page clicks and enquiry quality after recrawl using comparable complete windows. No CTR/ranking/indexing/qualified-lead gain is established. Further useful content needs a distinct occupier question and verified facts; a larger volume of near-duplicate articles is not the next acceptance criterion. Partner placements, relevant directories and link outreach remain separate unsent work; no external messages or submissions were made. Keep Kingfisher's 3,849/3,300 m² conflict, owner quotes/availability/specifications/conditions, device/UAT, real consented GA4/CRM receipt/qualified baseline, provider/legal/finance/data/training gates open. Official Schema.org remaining queue is 16; Google coverage remains incomplete and user deferred further attempts.
