# Midpoint organic leasing measurement — 16 October 2026

## Verified evidence

Read-only checks used 16 September through 13 October 2026, Africa/Johannesburg, matching the 28-day search baseline. This period predates the storage refresh and cannot measure its impact.

| Layer | Result | What it establishes |
|---|---|---|
| Midpoint saved enquiries | Three; all have attribution; two organic, one paid | Captured enquiries, not qualification |
| Midpoint contact status | All three NEW; no enquiries marked handled | Local workflow has not recorded qualification |
| Blend CRM reconciliation | All three external IDs matched exactly once; two ASSIGNED, one KILLED; one has first-response timestamp | Handoff records exist; assignment and response do not prove qualification |
| CRM structured attribution | Source/medium/campaign fields empty for these records | Structured channel reporting needs reconciliation; source/medium are sent in message notes |
| GA4 key-event report, all channels | mailto_click: four; tel_click: three; no returned generate_lead, qualify_lead or close_convert_lead rows | Click activity is not a qualified-lead baseline; saved counts do not reconcile with returned capture events |
| GA4 configuration | Connected Midpoint web stream G-9XLN2SH5ER; generate_lead, qualify_lead and close_convert_lead registered as key events; no custom dimensions | Configuration alone does not prove those events were received |
| Live browser | Correct GA/GTM scripts loaded; observed page_view collection response HTTP 204; no captured console errors | Transport observed for page view only; no live form or qualified event submitted |
| Provider configuration | Direct CRM URL/key present; n8n and legacy listings fan-out absent | CRM is the configured route; no inbox/provider receipt claimed |

No customer names, emails, phones, message bodies, lead IDs, private endpoints or credentials belong in the SEO evidence or analytics payloads. Reconciliation ran server-side and returned aggregates only. No real/test enquiry was inserted into production and no external message was sent.

## Event boundaries

| Event / signal | Trigger | Reporting use |
|---|---|---|
| generate_lead / form_name=contact_enquiry | Client receives ok plus a saved enquiryId after captcha and database save | Saved leasing enquiry; not necessarily delivered or qualified |
| generate_lead / form_name=suites_booking_request | Separate accommodation request | Exclude from office/warehouse/serviced-office leasing goals |
| phone_click, email_click, whatsapp_click; GTM tel_click/mailto_click | Contact link interaction | Intent only; do not count as confirmed or qualified enquiries |
| qualify_lead | Human confirms genuine leasing need, space requirement, timing and usable contact, excluding spam/tests and amenity-only contacts | Qualified business outcome; do not infer from save, assignment or handled flags |
| close_convert_lead | Confirmed commercial conversion recorded by the responsible team | Separate later outcome, not a form submission |

ContactForm already guards generate_lead on successful persistence and attaches interest, saved ID and attribution without customer contact fields. API failure/captcha/downstream-unavailable boundaries are covered by isolated tests. No qualification event emitter was found in this Midpoint application; registration in GA4 is not an implementation. No automatic qualification was added, and CRM/contact stages were not relabelled.

## Remaining verification and owner gates

1. Leasing must record qualification and its date/reason consistently in the authoritative CRM. ASSIGNED is not QUALIFIED, and KILLED is excluded. The human qualification definition and responsibility need commercial-owner acceptance.
2. Run one clearly identified, consented end-to-end leasing test with the owner: captcha, saved ID, matching CRM record, GA4 DebugView/realtime capture, delivery/readback and correct form/interest attribution. Keep it excluded from production lead totals. A real form test can trigger external communications and needs an agreed test recipient and delivery scope before submission.
3. Reconcile the historical three saved IDs privately against GA4 export/debug evidence if available. The current key-event report has no lead ID custom definition and cannot establish event-level matches. Browser/privacy blockers, earlier release timing and tag configuration remain possible causes; no single cause is proven.
4. Confirm the CRM intake contract before adding structured utmSource/utmMedium/utmCampaign or a qualification-to-GA4 integration. That is separate CRM work; preserve deduplication by Midpoint enquiry ID and avoid duplicate client/server events. Historical attribution notes remain intact. No Measurement Protocol credential, CRM schema or provider setting changed here.
5. Retain first/last-touch source and original landing page through enquiry. Use comparable 28-day qualified organic enquiry totals, reconcile to CRM outcomes, and exclude duplicates, test/spam, accommodation and amenity demand. Until qualification recording and analytics reconciliation pass, the 90-day percentage goal has no accepted qualified baseline.

GA4 generate_lead currently has a configured default value of USD 1 despite the property reporting currency being ZAR. Do not interpret that configured value as actual leasing revenue. No conversion values, Ads bidding goals, key-event settings or GTM settings were changed.

References: [Google recommended lead events](https://developers.google.com/analytics/devguides/collection/ga4/reference/events#qualify_lead), [Article markup](https://developers.google.com/search/docs/appearance/structured-data/article).
