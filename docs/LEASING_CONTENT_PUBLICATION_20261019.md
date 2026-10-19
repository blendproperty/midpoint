# Warehouse costs, office comparison and 6 Weaver articles — 19 October 2026

## Implementation and intent

Three original supporting articles use the existing blog renderer, CMS parent relationships, reciprocal supporting-article collections, sitemap, BlogPosting and breadcrumb templates. No new schema type, dependency, media or manual markup. Each links Insights, relevant guides/articles, current vacancies and a scoped viewing/enquiry route.

| Article | Primary pillar | Purpose |
| --- | --- | --- |
| /blog/warehouse-rental-costs-midrand | /warehouses | Separate indicative base rent, recurring property charges, upfront commitments and tenant operating costs. |
| /blog/halfway-house-vs-waterfall-office-space | /offices | Compare actual office proposals using one workplace brief and sourced location context; cross-link /location. |
| /blog/6-weaver-avenue-warehouse-walkthrough | /warehouses | Explain the published listing, area components, rate and verification questions before a viewing. |

Reviewed copy/metadata: `prisma/content/leasing-cluster-20261019.json`. Additive publication migration: `20261019120000_leasing_content_cluster`. Both parents must be published, indexable and unprotected. Any planned ID/slug collision skips the whole batch. A concurrent unique conflict fails the single insert atomically. Reruns preserve owner edits. Existing article, pillar and vacancy fields are not updated.

## Verified sources and editorial boundaries

- Fresh production snapshot: 13 published vacancies, six public pillars and 16 existing articles. 6 Weaver's numeric fields are 11,443 m² and R109/m²/month. Its description separates 10,150 m² warehouse, 1,293 m² offices and a 5,800 m² yard. The first two add to 11,443; the yard is separately described, not added to the worked base-rent calculation. 11,443 × R109 = R1,247,287 per month in indicative base rent. This is source-field arithmetic, not an owner-approved full quote or certified rentable schedule.
- The 6 Weaver walkthrough explicitly reviews the listing, not a physical inspection. Its 15 m eaves, 3,000 kg/m² loading figure and 2.5 MVA are attributed published statements requiring current drawings, assessment, scope and allocation confirmation. Optional entrance/layout work remains optional/proposed, not built or approved. Images may be illustrative; current dated photographs and viewing remain necessary. The past 1 September availability date is explicitly not proof of readiness or remaining availability.
- Sunbird ground-floor office example: published 500.66 m² at R120/m²/month, checked 19 October. No Halfway House market-average or Waterfall rental assertion. Full charges, fit-out, parking, timing and package terms require current proposals.
- [Waterfall City's official CBD guide](https://waterfallcity.co.za/work/waterfall-city/) supplies limited location context: N1/Allandale Road, mixed-use setting around Mall of Africa and named office destinations. No travel times, comparative prices, third-party availability, amenity access rights or market-wide superiority invented. A separate Maxwell page lookup timed out and was not needed or cited as checked.
- Primary live unit sources: [6 Weaver](https://www.mid-point.co.za/vacancies/cmsfvflfy000yoy01stx7o2dp), [Sunbird ground floor](https://www.mid-point.co.za/vacancies/cms4oiw4v0004n60127izdqzj). Existing unit images reused as covers without claiming current site condition.
- All three preserve the separate [2 Kingfisher](https://www.mid-point.co.za/vacancies/cmsfvflha000zoy01wxkk2efu) warning: numeric 3,849 m² versus narrative 3,300 m². No disputed monthly-rent example. Approved dated area/basis/components/plans/rate/monthly/VAT/charges/approver/revision is still required before upstream, brochure, site/schema and every dated article warning are reconciled.

## Testing and recovery

Isolated Node 22/PostgreSQL: 188 tests across 46 files passed. New regression checks parent visibility, whole-batch collision safety, three correct parent relationships, repeat application and later owner-edit preservation. Parent test slugs use a separate namespace to avoid collisions with older publication tests. Production build/type checks passed. All three rendered preview full bodies, titles, metadata, covers, schema and dates match the manifest; two reciprocal parents, Insights, blog index/sitemap and 25 distinct article destinations pass. Kingfisher warning and disputed monthly-rent guard remain intact.

Protected backup `/opt/midpoint/backups/leasing-articles-20261019`: full restore succeeded; seven table counts, checksums and archive/configuration mode 600 verified. Previous application retained as `midpoint-web:rollback-leasing-articles-20261019`. An image rollback does not withdraw inserted rows; targeted withdrawal must preserve subsequent business data.

## Publication status

Commit/push, main promotion, hosted deployment, live source comparison and external schema URL checks pending. No production seed/provider/CRM/GA4/GBP/contact changes. Preview and tests are not live publication or indexing proof.

## Outstanding gates

Approved unit plans/measurements/engineering capacities/current-proposed works/availability, full quotes and charges, package credit/booking/inclusions, operating amenities and owner leasing UAT remain open. Kingfisher remains disputed. Prior Search Console requests/validation processes and quota-limited guide refreshes remain pending; these three articles are not claimed indexed. Maps hours/category/photos/WhatsApp, real consented GA4-to-CRM receipt, a human-qualified baseline and prior finance/legal/provider/inbox/data/training/approval gates remain open. No real enquiry or notification test, paid research, recurring tracker or outbound outreach was performed.
