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

Commit/push, main promotion, hosted deployment and live public/schema/data checks are pending. Isolated preview is not production or indexing proof.

## Remaining gates

Owner leasing UAT; current availability/specifications/plans/works; operating amenity and package details; Kingfisher reconciliation; Maps corrections/hours/category/photos/WhatsApp; real consented GA4-to-CRM receipt and human-qualified lead baseline; prior finance/legal/provider/inbox/data/training/approval gates remain open. No real lead form or outbound notification was submitted. No indexing, rich-result display, ranking or qualified-enquiry uplift is established by publication checks.
