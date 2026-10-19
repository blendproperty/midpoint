# Midpoint Clarity review — 19 October 2026

Evidence: Outlook digest received 19 October, covering 11–17 October, and the authenticated Clarity dashboard, replay events and current public homepage. Replay AI summaries were used as leads; conclusions below distinguish observed events from hypotheses. Visitor identifiers, click IDs and form contents are omitted.

## Findings and action

| Priority | Finding | Evidence and disposition |
| --- | --- | --- |
| High | Invalid WhatsApp destination | Current homepage serves `wa.me/0000000000`. Existing approved source default, seed and 9 September migration agree on `27600185206`. Repair the all-zero global setting and defend the shared read path. Preserve any other configured number. Floating and vacancy links inherit the repair. Deployed setting and shared links verified; actual handset delivery remains untested. |
| High | Map image does nothing when clicked | 17 October desktop replay: repeated clicks on “Complete map of Midpoint” at 18:22–18:27, including rage events. Wrap the background image in a native full-size image link, preserve the separate marker/detail links, and expose a visible full-size link. No extra client JavaScript. |
| High, verification open | Form abandonment / repeated attempts | 16 October mobile contact replay has Submit clicks at 00:41, 00:51 and 00:55, without a verified success. Required-interest selection changes near the end. Clarity's Submit smart event is not proof of a saved enquiry, CRM receipt or inbox delivery. Current homepage loads a Google CAPTCHA iframe after focus and captured no browser error. A subsequent authorised single test on 19 October completed CAPTCHA, returned 200 and displayed success. Exact production reads found one saved enquiry and one matching CRM lead with the approved contact, midpoint source and test label. CRM recorded an assignment-email send. Recipient inbox delivery remains unverified; this passing new test does not diagnose the historical abandonment. |
| Medium, investigation open | Loading and interaction speed | Aggregate field sample: 80/100 from 72 pageviews; LCP 2.8s, INP 300ms, CLS 0.001. 55.6% good, 38.9% needs improvement, 5.6% poor. Worst rows: FAQ 7.7s / 880ms; two vacancy details 15s / 470ms and 16s / 210ms. Homepage row: LCP 2.8s / INP 270ms; contact: 2.6s / 260ms; spaces: 2.6s / 270ms. This historical sample predates subsequent releases. Fresh non-throttled HTTP checks returned FAQ in 0.529s and the two details in 0.869s / 0.502s; these are not mobile LCP measurements. Code inspection found the optional gallery awaited the full provider feed with a 15s timeout per page. Added an overall 1.5s abort budget for the interactive gallery, preserving its existing saved-photo fallback. Sync and PDF callers retain their existing 15s per-page behaviour. Caller-signal propagation and cancellation across pages are tested. Profile current mobile rendering/long tasks and compare fresh field data; no field improvement is established. |
| Medium, investigation open | Quick backs / reduced engagement | 25 sessions (10.20%) flagged. One sampled mobile session traversed home → spaces → warehouses → spaces; its summary suggests comparison, not a confirmed navigation failure. Pages/session 1.73, down 30.3%; duration about 2min, down 54.2%. Examine landing-page/placement intent and completed leasing outcomes before changing campaigns or navigation. No budget/targeting changes. |
| Review, no defect established | Dead clicks on text / FAQ | 13 October FAQ replay includes clicks on the heading and “Positioned in Midrand…” text. Those clicks do not establish a broken accordion. Mobile homepage example includes outbound actions; an outbound click also needs destination-level verification before calling it broken. Do not convert every text click into a link. |

## Weekly interpretation

245 human sessions (+9.87%); 59 bot sessions excluded. Dead clicks 32 sessions / 13.06% (digest rounds to 13.1%); rage clicks one session / 0.41%; quick backs 25 / 10.20%; no recorded JavaScript errors or excessive scrolling. Sessions can overlap across flags. All three frustration rates decreased week on week (digest: rage −8.98%, dead −38%, quick backs −31%). These are changes in rates as reported, not counts of distinct defects.

The digest says 30.3% scroll depth while the live dashboard for the same window says 36.25%; retain both rather than invent a reconciliation. Eight sessions have Clarity's Submit form smart event; none are thereby proven saved, delivered or qualified leasing leads. Referrer/paid-placement quality is a separate investigation; unfamiliar referrers alone do not establish invalid traffic.

## Scope and validation

Shared map caller: `ListingsGrid` on the public home page. Shared settings consumers include `RootLayout` / `SiteChrome`, vacancy schedule and vacancy detail pages. Only an optional AbortSignal parameter was added through the photo helper and feed reader; all callers were checked. CMS descriptions, vacancy data, analytics semantics and provider credentials are unchanged. The repair migration updates only the global all-zero WhatsApp placeholder, with no seed or broad reset.

Local unit suite after synchronising concurrent remote work: 186 passed / 10 database-gated tests skipped across 48 files. Focused tests render the map and retain marker/detail/filter targets; settings tests cover plain/formatted zero placeholders, empty/null fallback and preservation of a real configured value. Final production build compiled, type-checked and generated all routes successfully. Standalone tsc reports seven diagnostics in three unchanged baseline test files (legacy routes, brochure Buffer type and scheduler ProcessEnv); no new-file diagnostics. Local unit execution does not verify production migration, recipient delivery or field improvement. Hosted migrations/unit/integration job and deployment 39227390247 passed for 63fce26b5108. Live map image opening, warehouse filter and marker/card selection passed; actual 390px layout has matching client/scroll width. Temporary emulation reset. Exact release/live/test-record details are recorded separately in `PROJECT_CONTEXT.md`.

Outstanding owner leasing UAT, source-data/Kingfisher reconciliation, real CRM/GA4/inbox/handset delivery, Google processing and all prior provider, finance, legal, data, training and approval gates remain open.

The separate n8n enquiry webhook is unset; searches of accessible n8n Midpoint/enquiry workflows found Hub functions/gym flows, not a leasing notification flow. Existing CRM assignment email is a separate configured path and recorded a send for this test. No workflow was created or changed. The labelled test is not qualified demand. The follow-up below closes and excludes it from commercial CRM counts; recipient delivery remains open.

## Mobile and form follow-up — 19 October

The labelled test has now been closed in CRM as KILLED with TEST ONLY reason and audited status change; no open tasks remain. CRM overview, commercial reports, team and property counts now exclude the explicit TEST ONLY prefix while retaining genuine killed leads and null reasons. Audit records remain. CI/deploy 39238904742 passed for 2d011b3; live readback is recorded in canonical project context. Historical GA4 QA events still require exclusion in reconciliation.

PageSpeed mobile baseline: FAQ 69 / LCP 5.9s / FCP 3.8s / TBT 20ms / CLS 0; contact 84 / LCP 4.3s / FCP 1.1s / TBT 140ms / CLS 0. Moto G Power, slow 4G, Lighthouse 13.5, 19 October. FAQ loaded about 462KiB of offscreen Google Maps, despite loading=lazy. Hero request discovery flagged missing high fetch priority. The 28-day origin LCP 3.4s is separate historical field data. Baseline reports:

- FAQ: https://pagespeed.web.dev/analysis/https-www-mid-point-co-za-faqs/qrepy7t0sm?form_factor=mobile
- Contact: https://pagespeed.web.dev/analysis/https-www-mid-point-co-za-contact-us/1dwojql7xq?form_factor=mobile

Implementation defers the map until near view and prioritises the existing main hero image. Form provider readiness replaces the old six-second retry cutoff; labels/autocomplete and explicit loading, blocked-check, CAPTCHA rejection/expiry, rate-limit and uncertain-receipt feedback preserve entered values. Required consent now produces native browser validation. Optional webhook waiting is bounded after capture. Google's readiness API: https://developers.google.com/recaptcha/docs/loading . These changes address plausible failure mechanisms; they do not establish the cause of the 16 October session or prove improved conversion.

188 local tests passed / 10 skipped, production build passed; local browser fixtures verified delayed/blocked provider, native consent, success and recoverable error paths without external submission. Fresh deployed checks and lab comparison remain pending; real field improvement and owner UAT remain open.

### Deployed observations and remaining speed work

The first deployed comparison is deliberately retained, including results that did not improve:

| Mobile lab metric | FAQ before | FAQ after | Contact before | Contact after |
| --- | --- | --- | --- | --- |
| Performance | 69 | 69 | 84 | 78 |
| LCP | 5.9s | 5.9s | 4.3s | 4.4s |
| FCP | 3.8s | 3.9s | 1.1s | 1.1s |
| TBT | 20ms | 40ms | 140ms | 310ms |
| CLS | 0 | 0 | 0 | 0 |
| Accessibility | 92 | 97 | 92 | 97 |

FAQ comparison: https://pagespeed.web.dev/analysis/https-www-mid-point-co-za-faqs/03tyqaq8c6?form_factor=mobile . Contact comparison: https://pagespeed.web.dev/analysis/https-www-mid-point-co-za-contact-us/fg5wm4yr7k?form_factor=mobile . Runs used the same Google mobile profile, but are single synthetic samples. FAQ initial third-party table no longer includes Maps: about 462KiB removed from initial loading. Hero discovery now passes with fetchpriority=high. This is a payload/discovery improvement, not an established LCP, INP or conversion improvement. Contact TBT worsened in the sample; do not call mobile speed resolved. Remaining FAQ third-party work includes GTM/GA about 343KiB and 234ms main-thread work, Clarity about 44ms. Existing measurement is retained; a trace of remaining tasks and consent/attribution implications is required before changing tag timing or removing tags. Current PageSpeed still flags missing text compression, while independent production requests receive Brotli and origin gzip; the contradiction is unresolved, not grounds for a speculative configuration change.

Live browser checks: initial FAQ has zero Maps iframe; map appears after bringing its link into view, with a reserved frame and direct link. Contact has one #Contact target, labelled controls and high-priority hero. Google checkbox loaded after both fresh focus and client navigation on the first release. A later Google iframe stalled/raised reCAPTCHA Timeout without invoking the error callback; the final follow-up adds an always-visible email alternative and brighter consent text so that path has a usable exit. Do not infer provider reliability from one successful load. No additional real enquiry or notification was sent. A live eight-photo vacancy gallery advanced to 02/08, kept first-photo priority/eager attributes and opened its enlarged dialog.

The code and local recovery checks address avoidable form friction; actual abandonment/qualified-lead effects, physical-device testing, recipient delivery and existing owner/provider/data/training/approval gates remain open. Final release and canonical context evidence below is authoritative for deployment status.

The previously slow Sunbird detail also received a fresh mobile lab check: performance 64, LCP 6.6s, FCP 4.1s, TBT 130ms, CLS 0, accessibility 97, 19 October 12:54 SAST. https://pagespeed.web.dev/analysis/https-www-mid-point-co-za-vacancies-cms4oiw4v0004n60127izdqzj/1yfyqo4kdv?form_factor=mobile . There is no equivalent before-release lab sample; the historical 15–16s field observations cannot be used as its numeric baseline. The earlier optional-feed timeout bound fixes a source of long server waits, but does not make this LCP result good.

Additional compression check: public FAQ responses advertising the current browser Accept-Encoding list (gzip, deflate, br, zstd) returned Content-Encoding zstd and about 13.8–14.0KB transferred for both mobile Chrome and HeadlessChrome-Lighthouse user agents. This narrows the audit discrepancy; it does not explain the Google audit's result or prove an audit bug. No compression configuration was changed.

Final release: d1ee7c46fa575790c8338c7946f54dc232993fcc, Deploy to VPS run 39240573306 succeeded, hosted test job 118020109945 passed 199/199 across 50 files including database integrations. Server checkout and public contact browser deployment marker independently match. Permanent fallback mailto matches the configured leasing team; real Google checkbox loaded alongside it after focus. Screenshot inspected. No new live submission. A subsequent broad scripted urllib probe encountered HTTP 403 and is not counted as a passing route check. Earlier individual live browser/form/gallery checks stand; no claim every production route passed this final scripted probe. CRM closure/report filter deployment and remaining gates are recorded in both canonical contexts.
