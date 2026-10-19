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

Application commit `70c92cff0bcc5daaf57ef75ded186f01813a558c` was pushed to origin/codex/midpoint-warehouse-office-articles-20261019 and normally fast-forwarded from9a4cbfc to main. [Deploy to VPS39225950691](https://github.com/blendproperty/midpoint/actions/runs/39225950691), attempt1, completed successfully; testjob117972159941 and deployjob117972534722 passed. Server checkout, web and vacancy scheduler independently match70c92cff0bcc. Migration added exactly three public article rows with actual19October publication dates, correct public parent IDs and exact reviewed copy/metadata/covers. No seed or provider/analytics/contact/GBP/upstream configuration change.

Live complete body/title/meta/canonical/indexability/schema/cover/date checks passed all three. Two parent guides link back; Insights links those guides; blog index/sitemap include all three and all25article destinations return200. Fresh source comparison proves all13vacancies, six pillars and16earlier articles unchanged across selected public fields, including updatedAt and existing article parent IDs. Total published articles19. Kingfisher warning and withholding of disputed monthly rent remain intact.

All three live Schema.org URL tests: zero errors, zero warnings, three items, with new deployment visible. Google live smartphone tests: six valid items each, no warning flags; crawls10:58:22–10:58:27SAST. Three390px layout checks pass without horizontal overflow; emulation reset. Schema proof screenshot inspected. Google sitemap resubmission read back Success, submitted/read19October,48discovered pages(previous45). Discovery and rich-results crawls do not prove indexed status. Individual requests were not retried after the daily quota encountered in the earlier indexing task.

Private OpenSEO report33596d53-5c13-4823-98f5-e27f401bfec6 updated with the publication result and explicit listing-review/owner-data limits; exact remote HTML readback passed, sharing remains private. Project publication context/key pages/log aligned. Final follow-up records documentation only with CI skipped; canonical PROJECT_CONTEXT.md presence/content on intended remote main verified before handoff.

| Article | Google live result |
| --- | --- |
| warehouse-rental-costs-midrand | https://search.google.com/test/rich-results/result?id=8DQixJ7pmMVwBEn_p3xYLg |
| halfway-house-vs-waterfall-office-space | https://search.google.com/test/rich-results/result?id=pk1abM_KLAMSYn4HJvREVA |
| 6-weaver-avenue-warehouse-walkthrough | https://search.google.com/test/rich-results/result?id=tcqEY-xqdcF9XD-qoYNvXQ |

Evidence retained locally: tmp/leasing-qa-final.log, leasing-preview-http.json, leasing-live-http.json, next-articles-before.json/next-articles-after.json, leasing-data-check.json, leasing-mobile.json, leasing-external-validation.json, leasing-schema-proof.png, leasing-sitemap.json and leasing-sitemap-proof.png. Disposable test environment removed after evidence collection; protected production backup and rollback image retained.

## Outstanding gates

Approved unit plans/measurements/engineering capacities/current-proposed works/availability, full quotes and charges, package credit/booking/inclusions, operating amenities and owner leasing UAT remain open. Kingfisher remains disputed. Prior Search Console requests/validation processes and quota-limited guide refreshes remain pending; these three articles are not claimed indexed. Maps hours/category/photos/WhatsApp, real consented GA4-to-CRM receipt, a human-qualified baseline and prior finance/legal/provider/inbox/data/training/approval gates remain open. No real enquiry or notification test, paid research, recurring tracker or outbound outreach was performed.
