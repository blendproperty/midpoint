# Applying the 15 SEO tactics to Midpoint — 22 October 2026

Goal: help prospective office, warehouse and serviced-office occupiers choose space and request a useful leasing quotation. Ranking, traffic and lead gains are outcomes to measure, not implementation acceptance criteria.

## Practical status of the document's recommendations

| Tactic | Midpoint action / status |
| --- | --- |
| 1. Refresh existing content | Offices, warehouses and Insights refreshed using current final South African Search Console data. Storage/regional articles already refreshed on 16/19 October; retain those changes while gathering post-recrawl evidence. |
| 2. Visible authors | User-approved Blend Property Group credit/profile/bio is live across 19 articles and six guides, matching author schema. No invented individual or credentials. |
| 3. Integrations/partnerships | Adapt to genuine tenant, broker and business relationships. Relevant third-party placements remain a separate outreach task; no communications or submissions authorised/executed here. |
| 4. Exact-match domains | Retain the established Midpoint domain. This sprint does not justify a migration or buying keyword domains. |
| 5. Useful free tools | New rental-budget tool on `/vacancies#rental-budget`, alongside the existing office-space calculator; links from Insights and the catalogue introduction. Implementation/verification/release status below. |
| 6. Regular useful content | Current source inventory has 19 published articles. No daily AI publishing or recurring schedule created. New factual content still needs source evidence and a distinct occupier question. |
| 7. Reddit / third-party content | No automated promotion, impersonation or promotional posting. Genuine useful contributions require a suitable discussion and explicit posting instruction. |
| 8. Keyword gaps | First-party query/page data drove the current leasing-page work. More pages need distinct intent and real unit/estate facts; exact demand for a standalone calculator page is unmeasured. |
| 9. Consistent business identity | Website author identity is consistent. Google Business Profile, phone, hours and external-profile reconciliation remain separately scoped and must be checked live before changes. |
| 10. Relevant curated directories | Prioritise genuine property/broker/local business destinations. Generic SaaS/startup directories are a poor fit; no new submissions here. |
| 11. Programmatic pages | Existing published vacancies already provide data-backed detail routes. Improve source quality rather than create thin copies across invented locations. |
| 12. Useful FAQs | Retain useful visible leasing answers; add technical answers only with approved source facts. Do not promise Google FAQ rich results. |
| 13. Link outreach | Potential partner/unlinked-mention work remains unsent. No paid link exchange, triangular exchange network or bulk outreach implemented. |
| 14. Comparison pages | Existing occupier-format and location comparisons support leasing choices. No unsupported named-competitor superiority or market-wide price claims added. |
| 15. Accurate schema | Current tool release has 51 independent live passes. Three official Schema.org page checks passed on the prior runtime; the historical queue remains 32 and Google remains incomplete. No official result is implied for this release. |

The document's guaranteed ranking jumps and routine-publishing claims are not acceptance criteria. Current Google guidance on [helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [spam policies](https://developers.google.com/search/docs/essentials/spam-policies) and [FAQ feature retirement](https://developers.google.com/search/updates) was checked in this chat's initial assessment. Search engines can use valid schema without displaying a particular search feature.

## Rental-budget implementation

- Reuse the existing vacancy catalogue and office planning flow; no new dependency, standalone landing page, account gate or data model.
- Enter area/rate manually, start from a suitable published listing, or carry the existing office calculator's suggested area into the budget. Listing choices reuse the existing price/area safeguards, including the unresolved Kingfisher conflict. Listings with missing/invalid positive area/rate are excluded from automatic starting figures.
- Show indicative base rent and a subtotal of known parking, other property charges, utilities and connectivity. Blank/invalid charges stay unconfirmed; explicit zero is a confirmed zero. Missing/invalid base figures and overflow produce no numeric estimate. Display two decimal places.
- Confirm the VAT basis of all inputs; the tool does not calculate VAT or assume the source rate's VAT treatment. Avoid double counting package inclusions. Deposits, fit-out, relocation and other once-off costs are excluded; the result is not a quotation or complete occupation cost.
- Client-side values are not wired into enquiry payloads, persisted, added to URLs or new analytics events. Existing consent/analytics configuration is unchanged; this is not a broader privacy certification.
- Preserve existing search/filter behaviour, category links, office calculator, enquiries and source property data. Use native keyboard-accessible disclosure and labelled inputs, with a live estimate status.

## Verification and release

- **Implementation:** live at [the vacancy rental-budget tool](https://www.mid-point.co.za/vacancies#rental-budget), discoverable from Insights and the vacancy introduction.
- **Testing:** 225 tests across 60 files passed, including PostgreSQL integration and half-cent/unknown-zero/invalid/overflow cases. Production builds and schema controls passed; exact final-source [CI](https://github.com/blendproperty/midpoint/actions/runs/39782938243) succeeded.
- **Commit and push:** final source `9eadb367f15234eb5fa8bd74fb35786abbe219c1` pushed on the isolated implementation branch. Original dirty checkout preserved; final context/evidence promoted separately by normal fast-forward.
- **Merge:** [PR18](https://github.com/blendproperty/midpoint/pull/18) squash `f089b87d473263696bcf29459979e4da3f7f8efb` exactly matches the tested source tree.
- **Deployment/configuration:** [release](https://github.com/blendproperty/midpoint/actions/runs/39783309298) succeeded on attempt 2 after an initial SSH connection timeout before remote commands. Exact runtime `f089b87d4732` verified; no new migration/configuration/dependency.
- **Live production verification:** 48 browser checks and three visually inspected layouts (1440/390/320px), including actual input/selection/reset flows, half-cent display and existing office-calculator flow. Independent schema audit: 51 URLs, zero errors/warnings/fetch failures. All 19 articles, six guides and 16 vacancy source records unchanged; routine sync timestamps excluded. [Durable live evidence](rental-budget-live-20261022.json), [independent schema report](schema-rental-budget-live-20261022.json). No real enquiry or third-party analytics event sent by the test browser.

## Preserved gates

Google's reCAPTCHA issue remains user-confirmed. Historical official Schema.org queue: 32 Midpoint URLs; only three fresh page results were completed on the prior runtime before the user redirected work. No fresh official result is implied for the tool release. Keep owner-approved specifications/plans, disputed-area reconciliation, availability, current/proposed works, asking-rate VAT/charges and package terms, real customer/device UAT, real consented GA4-to-CRM receipt/qualified baseline, indexing/ranking/lead outcomes and all prior provider/payment, privacy/legal/finance, training/approval gates open.
