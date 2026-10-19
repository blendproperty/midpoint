# Estate guide supporting articles — 19 October 2026

Four supporting articles fill the previously empty business park, location and amenities collections. Existing office, serviced-office and warehouse collections remain intact. These are practical leasing decision guides; no exact-title search-volume, indexing or traffic forecast is claimed.

| Article | Primary guide |
| --- | --- |
| /blog/business-park-vs-standalone-premises-midrand | /business-park-midrand |
| /blog/planning-office-and-warehouse-space-midrand | /business-park-midrand |
| /blog/assess-midrand-staff-client-delivery-routes | /location |
| /blog/business-park-amenities-leasing-checklist | /amenities |

## Implementation and fact boundaries

Reviewed copy and metadata: `prisma/content/estate-cluster-20261019.json`. Additive migration: `20261019110000_estate_content_cluster`. Existing CMS routes, reciprocal supporting-article collections, BlogPosting/Breadcrumb templates, sitemap and blog index are reused. All four link back to Insights and relevant live vacancies and enquiry routes. Covers reuse current public assets; no new dependency or renderer.

Fresh production source snapshot includes 13 published vacancies, six public parent guides and 12 existing articles. Address and individual listing references come from current first-party records. The paired office/warehouse example is explicitly not a combined offer, adjacency or simultaneous occupation promise. Amenities, backup allocations, access rules, hours, fees, package inclusions, plans and physical specifications require current unit-specific confirmation. No travel-time, market-rent or certification assertion is introduced.

2 Kingfisher remains disputed: numeric 3,849 m² versus description 3,300 m². The article retains the warning and directs readers to an approved schedule and reconciled quote; no disputed monthly calculation is published. Reconcile upstream data, brochure, site/schema and dated article warnings together after owner approval.

## Publication safety and testing

The migration requires all three parents published, indexable and unprotected. Any existing planned ID/slug skips the entire batch. A concurrent unique collision fails the single insert atomically; repeat runs preserve owner edits. Existing parent, vacancy and article fields are not updated.

Isolated Node 22/PostgreSQL validation passed 187 tests across 45 files and the Next production build/type checks. New regression covers parent visibility, collision safety, correct four parent relationships, repeat application and later owner edits. Initial new-test syntax error was corrected before the successful full run. Rendered preview checks passed all four complete bodies, titles, metadata, cover/schema/dates, three reciprocal guide collections, Insights links, sitemap/blog index and 25 distinct article link destinations. Existing Kingfisher warning and withholding of disputed monthly rent remained intact.

Production backup `/opt/midpoint/backups/estate-content-20261019` was restored successfully in isolation; seven table counts, checksums and mode 600 archive/configuration permissions verified. Previous application image retained as `midpoint-web:rollback-estate-content-20261019`. An image rollback does not withdraw inserted article rows; any withdrawal must target only this batch and preserve subsequent business data.

## Publication status

Application commit `34787246cf0839fa0faa365013dde9514622b527` was pushed to origin/codex/midpoint-estate-content-20261019 and promoted normally (no force/PR) from632b752 to origin/main. Hosted test job117937534414 and deployment job117937846820 passed in [Deploy to VPS39215269352](https://github.com/blendproperty/midpoint/actions/runs/39215269352). Production checkout, web and scheduler independently match34787246cf08; additive migration published exactly four rows without seed or configuration changes.

Live full-body/title/meta/canonical/indexability/cover/schema/date checks passed all four articles. All three parents link back, Insights links parents, blog/sitemap contain all four and25article destinations return200. Fresh data comparison proves13vacancies, six pillars and12existing articles unchanged across selected public fields including updatedAt and article parent IDs. All four new records exactly match reviewed copy/metadata/images and correct public parent IDs, with19October publication dates; total published16.

Schema.org live URL checks: all four zero errors, zero warnings, three items with new release visible. Google smartphone tests: all four six valid items, no warning flags, successful crawls09:25:14–09:25:21SAST. Four390px layout checks passed without horizontal overflow; emulation reset. Evidence: tmp/estate-live-http.json, estate-before.json/after.json, estate-data-check.json, estate-mobile.json, estate-external-validation.json and inspected estate-schema-proof.png. OpenSEO publication context/key pages/log aligned; no paid research or tracking added. Final documentation-only follow-up records acceptance with CI skipped; canonical PROJECT_CONTEXT.md remote-main presence checked before handoff.

| Article | Google live result |
| --- | --- |
| Business park vs standalone | https://search.google.com/test/rich-results/result?id=gBZOGAVqf_Uezb9_fzfRTQ |
| Office and warehouse planning | https://search.google.com/test/rich-results/result?id=ZqGzGqCHyyUjrWaItwh4LA |
| Route assessment | https://search.google.com/test/rich-results/result?id=LiBnjI8hX48VVcvkkPZJlQ |
| Amenity checks | https://search.google.com/test/rich-results/result?id=mPcG5Slp4ovsxfzSbjiJnQ |

## Remaining gates

Owner leasing UAT; current availability/specifications/plans/works; operating amenity and package details; Kingfisher reconciliation; Maps corrections/hours/category/photos/WhatsApp; real consented GA4-to-CRM receipt and human-qualified lead baseline; prior finance/legal/provider/inbox/data/training/approval gates remain open. No real lead form or outbound notification was submitted. No indexing, rich-result display, ranking or qualified-enquiry uplift is established by publication checks.
