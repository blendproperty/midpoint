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

Implementation ready for validation and normal PR/CI promotion. Commit/push, merge, deployment and live verification will be recorded separately in `PROJECT_CONTEXT.md` after each is observed. Local checks do not establish production success.

## Remaining gates

Browser viewport testing does not establish physical iOS/Android or assistive-technology acceptance. Existing official schema/CAPTCHA, Kingfisher data, indexing/lead measurement, accommodation, provider, UAT, legal, finance, training and approval gates are unchanged; see the canonical context.
