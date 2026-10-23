# Blog and Insights navigation — 23 October 2026

## Scope

- Compact, opaque dark header on `/blog`, `/insights` and their descendants; the main page link has a cyan current-page indicator. Desktop editorial navigation gives priority to destinations and Enquire, with a quieter phone link and email retained in the mobile menu/footer.
- Six Blog guide links and four Insights availability/budget links use a shared responsive tile treatment, keyboard focus outline and hover state. Pillar cards, article ordering, commercial content and destinations remain unchanged.
- Shared mobile navigation excludes collapsed links from keyboard/accessibility navigation, restores focus on Escape and allows scrolling to the bottom on short screens. Existing home hero overlay, booking destination, contact channels and responsive breakpoint remain.
- Four runtime files changed; one repeatable browser assertion script added. No dependencies, database migrations, provider settings or production content edits.

## Validation

- `npm test -- --maxWorkers=2 --minWorkers=1` with disposable PostgreSQL, booking and vacancy-sync integration enabled.
- `npm run build`, including independent schema controls, production compilation and TypeScript checks.
- `node scripts/check-editorial-navigation.mjs BASE_URL EVIDENCE_DIRECTORY`: both indexes at 1440, 1280, 1009, 768, 390 and 320px. Asserts opaque/unobstructed header, current-page indicator, no document/header overlap, topic sizing, mobile keyboard exclusion, open/Escape/focus return, navigation and scroll unlock. Also checks a 390×500 menu, a supporting article, the retained home overlay and all ten topic destinations including the budget fragment. Screenshots at 1440 and 390px are reviewed separately.
- Local data is synthetic in a disposable database. Browser checks block external resources, analytics and non-GET requests. No enquiry, booking, email, telephone call or payment submitted.

## Release status

Source `9ef2eef9b967d7e40a070d2e433ee36752910f3f` passed final local 226 tests/61 files and [PR CI39914344079](https://github.com/blendproperty/midpoint/actions/runs/39914344079), including complete production build and independent schema controls. SHA-guarded [PR20](https://github.com/blendproperty/midpoint/pull/20) merged as `34f8247fb3d2ceef38d509662f0a2350fb148a43`; merged runtime files match tested source.

Final local browser checks passed all twelve page/viewport combinations and ten topic destinations, short-screen menu, supporting-article current state and home overlay with no browser errors. [Local evidence](navigation-local-20261023.json). Desktop/mobile screenshots were reviewed. Initial complete local build passed; final local compilation, type checks and page generation passed but standalone packaging hit disk exhaustion. Missing temporary cache files and a stopped disposable database also interrupted earlier reruns; after recovery the complete final local suite passed. Complete final build passed in CI. No environment or dependency workaround shipped. Recursive cleanup of this checkout's generated packaging was rejected by automatic approval review (only reason supplied: `blocked by policy`); the files were left in place as disk space became available again.

[Release39915337440](https://github.com/blendproperty/midpoint/actions/runs/39915337440) completed successfully with both test and deploy jobs passing. Both public indexes serve `34f8247fb3d2`, return200 and retain their self-canonicals. [HTTP evidence](navigation-live-http-20261023.json).

The same browser assertion script passed against production: twelve index/viewport combinations, all ten topic destinations, the budget fragment, short-screen menu, supporting-article active state and home overlay, with zero browser errors. [Live browser evidence](navigation-live-20261023.json). Actual production screenshots at1440/390px were reviewed for both pages. No horizontal overflow, clipped topic targets or header overlap found. These are browser viewport checks, with no production form submission or physical-device acceptance claim. Final documentation promotion is separate from the application deployment; `PROJECT_CONTEXT.md` retains the dated implementation, testing, commit/push, merge, deployment and live verification evidence.

## Remaining gates

Browser viewport testing does not establish physical iOS/Android or assistive-technology acceptance. Existing official schema/CAPTCHA, Kingfisher data, indexing/lead measurement, accommodation, provider, UAT, legal, finance, training and approval gates are unchanged; see the canonical context.
