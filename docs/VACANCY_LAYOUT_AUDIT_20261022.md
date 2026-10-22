# Midpoint vacancy layout audit -22 October2026

All16 currently published Midpoint listings were individually checked in the live browser after the final release. The live unfiltered vacancy index and published source count both equal16; the closing index recheck has no unchecked URLs.

The final production runtime is `675a65cbf825` on every checked page. Each listing passed1440px desktop,390px mobile and320px narrow mobile checks after fonts loaded:48 cases. Description paragraphs are separate, the compact viewing panel stays alongside content on desktop and stacks on mobile, both disclosures remain present, and no document horizontal overflow was measured. All16 primary images loaded; unit-specific enquiry query, brochure route and phone destination match their listing. No enquiry or call was submitted.

## Per-listing results

Paragraph/feature counts refer to the lower property-details section; the hero retains the listing's existing amenity list. Short descriptions remain short rather than receiving invented copy. Pass includes text preservation, unchanged structured listing values (excluding sync dateModified), primary image, enquiry context, brochure and phone destination.

| Listing | Paragraphs | Detail features |1440px |390px |320px |Content/links |
|---|---:|---:|---|---|---|---|
|[Office G.02](https://www.mid-point.co.za/vacancies/cms4oiw4n0002n601y2gpa0qf)|1|0|Pass|Pass|Pass|Pass|
|[Unit 7, Sunbird Road (GF)](https://www.mid-point.co.za/vacancies/cms4oiw4v0004n60127izdqzj)|3|18|Pass|Pass|Pass|Pass|
|[Unit 1, 1 Weaver Avenue](https://www.mid-point.co.za/vacancies/cms4oiw500005n6011rnzc2hb)|1|0|Pass|Pass|Pass|Pass|
|[Office G.07](https://www.mid-point.co.za/vacancies/cms4oiw530006n601h1qw8gzm)|1|0|Pass|Pass|Pass|Pass|
|[Office 1.02](https://www.mid-point.co.za/vacancies/cms4oiw560007n6019icxact3)|1|0|Pass|Pass|Pass|Pass|
|[Office 1.03](https://www.mid-point.co.za/vacancies/cms4oiw590008n601tuhv5okk)|1|0|Pass|Pass|Pass|Pass|
|[Office 1.04](https://www.mid-point.co.za/vacancies/cms4oiw5d0009n601702zlk0p)|1|0|Pass|Pass|Pass|Pass|
|[3 Weaver Avenue](https://www.mid-point.co.za/vacancies/cms4oiw5j000bn601vz6szme4)|1|0|Pass|Pass|Pass|Pass|
|[Unit 2, 2 Weaver Avenue](https://www.mid-point.co.za/vacancies/cmsfuu4xu000ooy01x3ulli7b)|1|0|Pass|Pass|Pass|Pass|
|[6 Weaver Avenue](https://www.mid-point.co.za/vacancies/cmsfvflfy000yoy01stx7o2dp)|2|0|Pass|Pass|Pass|Pass|
|[2 Kingfisher Avenue](https://www.mid-point.co.za/vacancies/cmsfvflha000zoy01wxkk2efu)|3|11|Pass|Pass|Pass|Pass|
|[1 Kingfisher Avenue](https://www.mid-point.co.za/vacancies/cmsfvflhj0010oy014b1ytkku)|1|0|Pass|Pass|Pass|Pass|
|[Unit 2, 5 Weaver Avenue](https://www.mid-point.co.za/vacancies/cmuz7chn0009up901ll35sgdh)|2|0|Pass|Pass|Pass|Pass|
|[STOR24 Micro-Warehousing at Midpoint](https://www.mid-point.co.za/vacancies/cmvgae265001pmz01l33cvutx)|17|0|Pass|Pass|Pass|Pass|
|[STOR24 Self-Storage at Midpoint](https://www.mid-point.co.za/vacancies/cmvgae26d001qmz019ja0mhjg)|16|0|Pass|Pass|Pass|Pass|
|[Stellantis Building - Midrand](https://www.mid-point.co.za/vacancies/cmvgb129n0001qp01ia0fs15y)|8|0|Pass|Pass|Pass|Pass|

## Repairs and verification

-2 Kingfisher: eleven existing feature statements had been concatenated into one list item. They now render separately. The pre-existing disputed-area notice remains visible outside the disclosures; the area/price discrepancy is not resolved or certified by this layout work.
- Both STOR24 entries: separate the existing section labels, contact name, phone, email and product labels; preserve all wording and commercial qualifications. Product labels remain source text; this audit verifies the actual shared enquiry/brochure/phone anchors and does not claim new STOR24 product hyperlinks were added.
- Preserve raw source description beside the unchanged plain detail-query description so future supplied HTML paragraph/list boundaries reach the escaped text renderer. No source/database/business records changed.
- Initial screenshot review covered32 desktop/mobile captures. After the final name-line correction, all16 pages and48 cases were rerun; the changed storage desktop/mobile captures were re-reviewed, and the other14 paragraph/feature/fact arrays match their already reviewed state. Screenshots are detail-section crops and can include adjacent content or clip section-edge whitespace; DOM checks cover the complete section. Existing floating WhatsApp controls may overlay the current scroll viewport; no redesign of that control was in scope.

## Release evidence

-19 focused parser/query/render tests passed, including real legacy descriptions and an end-to-end mocked database-query boundary regression.
- [PR14](https://github.com/blendproperty/midpoint/pull/14): source head `5fdd8a23872ac9cee668664d2616a5ed6a6bf7dd`, squash main `a2b5c0d3eaf1648f1432b4aeac648793ccf37cf0`; [CI/build](https://github.com/blendproperty/midpoint/actions/runs/39729895864) passed216 tests across57 files and the actual production build. [Normal first deployment](https://github.com/blendproperty/midpoint/actions/runs/39730104361) succeeded.
- [PR15](https://github.com/blendproperty/midpoint/pull/15): final contact-line source head `57709bf7575d9be5aeefc7f5669529d8139bf899`, squash main `675a65cbf8252b593dcf28874d2ab8d6ab75452a`; [CI/build](https://github.com/blendproperty/midpoint/actions/runs/39730908031) passed the same216 tests and actual build. Both PR/merged trees were compared with no differences.
- [Final normal deployment](https://github.com/blendproperty/midpoint/actions/runs/39731111460) succeeded; merged release test job passed216 tests. VPS `/opt/midpoint` HEAD matches the final merged SHA; running `midpoint-web:675a65cbf825` started2026-10-22T06:03:10Z. No new migration, credentials, provider, billing or customer-data change.
- Local chat evidence directory `vacancy-layout-20261022/all-listings-audit/` contains the16-row final.json, baseline/source/first-release records, inventory recheck, visual-review.json,32 current desktop/mobile PNGs, both PR logs and deployment/release logs. Results saved per completed page. An initial transient320px width flag cleared with font settling; final checks explicitly awaited loaded fonts. Final audit records were reconciled to one latest result per URL.

Final result JSON SHA-256: `b95c02d82861b2d5d29792a753d4bb18c0c48ca4d9b5fb61ca12b25da51d7866`.

## Limits and retained gates

Browser viewport testing is not physical-device/user acceptance. Commercial/source accuracy, availability, charges, fit-out, the disputed Kingfisher area and actual enquiry/CRM/email delivery were not re-certified. No official Schema.org/Google test, ranking/indexing or genuine-customer outcome is claimed. Preserve all provider/privacy/legal/finance/data/training/approval gates in PROJECT_CONTEXT.md. No external tracker in scope.
