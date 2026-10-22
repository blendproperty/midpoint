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
| 15. Accurate schema | Previous release has 51 independent live passes. Official checks resumed for three pages with zero errors/warnings; current historical queue is 32, and Google remains incomplete. Those results apply to the prior runtime, not this new tool release. |

The document's guaranteed ranking jumps and routine-publishing claims are not acceptance criteria. Current Google guidance on [helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [spam policies](https://developers.google.com/search/docs/essentials/spam-policies) and [FAQ feature retirement](https://developers.google.com/search/updates) was checked in this chat's initial assessment. Search engines can use valid schema without displaying a particular search feature.

## Rental-budget implementation

- Reuse the existing vacancy catalogue and office planning flow; no new dependency, standalone landing page, account gate or data model.
- Enter area/rate manually, start from a suitable published listing, or carry the existing office calculator's suggested area into the budget. Listing choices reuse the existing price/area safeguards, including the unresolved Kingfisher conflict. Listings with missing/invalid positive area/rate are excluded from automatic starting figures.
- Show indicative base rent and a subtotal of known parking, other property charges, utilities and connectivity. Blank/invalid charges stay unconfirmed; explicit zero is a confirmed zero. Missing/invalid base figures and overflow produce no numeric estimate. Display two decimal places.
- Confirm the VAT basis of all inputs; the tool does not calculate VAT or assume the source rate's VAT treatment. Avoid double counting package inclusions. Deposits, fit-out, relocation and other once-off costs are excluded; the result is not a quotation or complete occupation cost.
- Client-side values are not wired into enquiry payloads, persisted, added to URLs or new analytics events. Existing consent/analytics configuration is unchanged; this is not a broader privacy certification.
- Preserve existing search/filter behaviour, category links, office calculator, enquiries and source property data. Use native keyboard-accessible disclosure and labelled inputs, with a live estimate status.

## Verification and release

- **Implementation:** complete locally; production release pending.
- **Testing:** 224 tests across 60 files passed, including PostgreSQL integration, arithmetic/unknown-zero/invalid/overflow cases and rendered listing eligibility. Initial production build passed; final text-aligned build and browser checks pending.
- **Commit and push:** pending on isolated `codex/seo-rental-budget-20261022`, based on verified canonical main `47c53f7`. Original dirty checkout preserved.
- **Merge:** pending. **Deployment/configuration:** pending normal gated release; no configuration/data migration intended. **Live production verification:** pending.

## Preserved gates

Google's reCAPTCHA issue remains user-confirmed. Historical official Schema.org queue: 32 Midpoint URLs; only three fresh page results were completed on the prior runtime before the user redirected work. No fresh official result is implied for the tool release. Keep owner-approved specifications/plans, disputed-area reconciliation, availability, current/proposed works, asking-rate VAT/charges and package terms, real customer/device UAT, real consented GA4-to-CRM receipt/qualified baseline, indexing/ranking/lead outcomes and all prior provider/payment, privacy/legal/finance, training/approval gates open.
