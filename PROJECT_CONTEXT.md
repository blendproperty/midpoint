# Midpoint Project Context

## 2026-10-09 — Brochure readability and original image proportions deployed and live verified

- Implementation: responds to the Sunbird brochure presentation feedback. Replaces narrow-column narrative/mid-sentence continuation and repeated inline source markers with a brief full-width cover summary, complete narrative paragraphs and a separate structured property-detail section. Marked source features render as individual two-column bullets; unstructured source text stays full width without guessed boundaries. Decimal areas and every original specification remain. All original listing photographs remain; cover downloads now preserve original proportions without panoramic cropping, and every PDF photo uses aspect-ratio-preserving containment. Small cover thumbnails/four-photo grids replaced by larger two-photo gallery pages. Midpoint logo/colours/Figtree/contact links retained. No schema, listing data, upstream feed or credential changes.
- Testing: local suite 146 passed / five integration-or-live gated skips (151 total); final focused brochure tests eight passed, including decimal-safe feature parsing and portrait image proportion preservation. Final Next production build/application type checks passed. Generated all 13 brochures and independently verified all 125 source photos/Figtree; PDF transformation checks confirmed all drawn image proportions, including repeated logos. Rendered all cover/second pages in contact sheets, plus Sunbird cover, full details and gallery at readable resolution; full description/property details including lease term fit together without orphaned last bullet. Evidence: tmp/layout-local-validation.json, tmp/gallery-pdf-validation.json, tmp/layout-sheet-*.png and tmp/sunbird-final-*.png. Prior unrelated standalone scheduler tsc diagnostics remain documented below. Local artifacts are not deployed proof.
- Commit and push: implementation and canonical context committed as f06ba791a76833b28a231127001746e6e36a3eed and pushed to origin/codex/midpoint-brochure-gallery and origin/main. Isolated branch started at verified remote main d5a19784d8b9795f141c949a9cd70eab975766de. Original dirty checkout and unrelated artifacts preserved. This final evidence-only context update is committed/pushed with CI skip; runtime remains f06ba791a768.
- Merge: verified fast-forward main promotion d5a1978..f06ba79; no PR merge.
- Deployment/configuration: GitHub Actions Deploy to VPS run 37934595073 succeeded, including the PostgreSQL integration test gate (https://github.com/blendproperty/midpoint/actions/runs/37934595073). SSH readback confirmed exact deployed SHA f06ba791a76833b28a231127001746e6e36a3eed and running web/vacancy scheduler on matching midpoint-web:f06ba791a768 images. Retained midpoint-web:rollback-brochure-layout-20261009. Existing backup remains. No new service/configuration, schema/data or credentials required.
- Live production verification: on 2026-10-09 the public vacancies page served exact f06ba791a768 deployment marker. Real mobile/desktop browser checks at 390/1440px passed 13 card download actions, correct detail actions and native downloads; all 13 endpoints returned valid HTTP 200/application/pdf, unknown ID returned 404, no application errors/horizontal overflow. Downloaded PDFs independently confirmed all 125 source photographs, Figtree fonts, exact identity/contact/detail links, every saved feature and published area/rate/availability. PDF transformation inspection verified every drawn image, including repeated logos (201 placements), preserves original aspect ratio. All six pages of the actual production Sunbird download rendered and visually reviewed; full description and all 18 property-detail bullets fit together on page two, with eight photos retained across cover/gallery pages. Delivered output/pdf/gallery/midpoint-midpoint-commercial-unit-7-sunbird-road-gf.pdf is the actual downloaded production document. Evidence: tmp/brochure-live-checks.json, tmp/layout-live-validation.json, tmp/gallery-live-validation.json, tmp/live-pdf-content-checks.json, tmp/live-pdfs/, tmp/sunbird-production-*.png and desktop/mobile screenshots. This proves the corrected production downloads, not business/presentation acceptance.
- Outstanding gates: presentation acceptance from user/leasing team and accuracy of source specifications/photos/rates/availability/VAT/parking remain business acceptance. Existing 30-image capacity and all other provider/data/legal/training/SEO/Suites gates remain.

## 2026-10-09 — Brochure source-photo galleries and Midpoint Figtree deployed and live verified

- Implementation: supersedes the earlier single-cover-image brochure limitation. Brochures now retrieve the complete gallery through the existing authenticated Midpoint-scoped Blend Listings feed, matched strictly by the Vacancy externalId. The first page shows the exact listing cover and up to two supporting photographs; remaining images appear on branded gallery pages. All 13 current spaces' source galleries are included (125 unique image URLs across the spaces). Manual local vacancies use their saved image. Unknown/withdrawn source IDs return 404, provider/configuration/image failures return 503 rather than publishing a silently incomplete gallery. Image requests remain allowlisted, size/pixel/time bounded and processed in batches of three; gallery capacity is 30 distinct images per listing.
- Branding/font: embedded Figtree Regular and Bold TTF match the website's Figtree family, replacing the previous standard Helvetica PDF fonts. Midpoint logo, confirmed colours, contact details and exact per-space Midpoint links remain. Fonts are vendored with their SIL Open Font License and pinned upstream source commit in `public/fonts/figtree/SOURCE.txt`. The user's Blend 2 Weaver reference was visually inspected; its same cover/interior photographs appear in the revised Midpoint first page, with all seven source photographs retained across two pages. No edits to the attached reference file, schema, production listing data, upstream repository or secrets.
- Testing: 37 files / 149 tests passed with both PostgreSQL integration flags enabled against dedicated disposable localhost:55439/midpoint_booking_test; Next production build and application type checks passed. Added exact external-ID matching, source ordering/deduplication, withdrawn source, missing credentials/provider and complete-gallery route tests, plus assertions for embedded Figtree and every supplied photograph. Independent PDF inspection matched all 13 source records and 125 images exactly and confirmed Figtree Regular/Bold font resources. 2 Weaver first/gallery pages visually reviewed; evidence in `tmp/gallery-pdf-validation.json` and `output/pdf/gallery/`. Source feed was authenticated from existing production configuration without exposing its credential. Local generation is not production proof; latest compiled local gallery browser fixture setup was not performed after its command was rejected by policy. Existing standalone scheduler-test tsc diagnostics remain as documented below.
- Commit and push: implementation and canonical context committed as b49ac58b679c0c2fb79106204c63dc80578c05fe and pushed to origin/codex/midpoint-brochure-gallery and origin/main. Isolated branch started at verified remote main bd73d18ffe033013c8a403bf640b29858d2be761. Prior checkout changes/artifacts preserved. This final evidence-only context update is committed/pushed with CI skip; runtime remains b49ac58b679c.
- Merge: verified fast-forward main promotion bd73d18..b49ac58 using the established release flow; no PR merge.
- Deployment/configuration: GitHub Actions Deploy to VPS run 37932865488 succeeded, including its test gate (https://github.com/blendproperty/midpoint/actions/runs/37932865488). SSH readback confirmed exact deployed SHA b49ac58b679c0c2fb79106204c63dc80578c05fe and running web/vacancy scheduler on matching midpoint-web:b49ac58b679c images. Prior runtime d98b5ab33bcd retained as midpoint-web:rollback-brochure-gallery-20261009; the earlier protected database/Compose backup remains available. Existing LISTINGS_API_BASE_URL/LISTINGS_API_KEY are reused server-side; no new service, schema/data changes or credential configuration.
- Live production verification: on 2026-10-09 the public vacancies page served exact b49ac58b679c deployment marker. Real browser checks passed at 390/1440px, with 13 card actions, correct detail actions/filenames and native downloads. All 13 brochure endpoints returned HTTP 200/application/pdf and valid PDF bytes; unknown ID returned 404. No application errors or horizontal overflow. Independent inspection of the downloaded production PDFs confirmed exact source gallery counts for all 13 spaces / 125 photos, embedded Figtree Regular/Bold, exact unit identity, all saved features, contacts, clickable exact detail links and published area/rate/availability labels. The downloaded 2 Weaver brochure was rendered and visually reviewed across both pages, including all seven photographs. Evidence: tmp/brochure-live-checks.json, tmp/gallery-live-validation.json, tmp/live-pdf-content-checks.json, tmp/live-pdfs/, tmp/gallery-production-1.png and -2.png, plus desktop/mobile screenshots. The delivered output/pdf/gallery/midpoint-2-weaver-avenue-unit-2-2-weaver-avenue.pdf is the actual downloaded production document. These checks prove functioning production downloads, not business acceptance.
- Outstanding gates: user/leasing-team presentation acceptance and source property/photograph/rate/availability/VAT/parking accuracy remain business acceptance. Galleries above 30 images would require raising the documented capacity. All previously recorded provider, legal, data, finance, training, Suites, SEO and clock-trigger gates remain unchanged.

## 2026-10-09 — Per-space Midpoint brochures deployed and live verified

- Implementation: added a Download brochure action to every vacancy card and individual detail page. `/vacancies/[id]/brochure` generates an A4 PDF from this site's current published Vacancy row, with the exact unit/building, Midpoint logo and confirmed dark/cyan colours, photograph, area, rate, availability, full description, all distinct features, current site contact details, dated qualifications and clickable links to the exact Midpoint detail page. Long content flows onto branded continuation pages. CMS HTML entities/checkmark symbols are normalized; missing/unavailable images have an honest fallback. No schema, production data, upstream repository or integration-credential changes.
- Scope and freshness: only PUBLISHED rows in Midpoint's own Vacancy table can produce a brochure; unknown, deprecated and other-portfolio IDs return 404. Database/generation failures return 503 rather than a stale document. Responses are attachments with no-store/noindex; image requests use an HTTPS hostname allowlist, reject redirects, cap downloaded bytes/pixel count and time out. Per-client request limiting is consistent with this site's single-container deployment.
- Testing: 36 test files / 142 tests passed with booking and vacancy PostgreSQL integration enabled against dedicated disposable `localhost:55439/midpoint_booking_test`; all 52 existing migrations applied locally. Next production build and its application type checks passed. Brochure tests cover published-only selection, unknown rows, database failure, PDF metadata/links, pagination, missing imagery/numeric values, hostile image addresses, size limits and request limiting. Separate `npx tsc --noEmit` reported existing scheduler-test inference/ProcessEnv diagnostics in `tests/vacancy-sync-scheduler.test.ts`; that standalone diagnostic remains outside this change and is not represented as passing.
- Local visual/browser verification: generated all 13 current publicly advertised listing snapshots (11 single-page PDFs and two continuation brochures), verified PDF text, identity, logo/photos/contact/links and visually reviewed office, serviced-office and warehouse layouts plus continuation pages. Compiled browser preview passed 390/1440px, 13 card actions, detail-page action, actual native browser downloads, all 13 PDF endpoints, unknown-ID 404 and no application errors or horizontal overflow. Local snapshots are test evidence, not production proof. Evidence retained in `tmp/brochure-local-checks.json`, `tmp/pdf-validation.json`, screenshots and `output/pdf/` beside the isolated checkout.
- Commit and push: implementation and canonical context committed as `d98b5ab33bcd3306fa3a68dbd7862e2467a0ef41`, pushed to origin/codex/midpoint-space-brochures and origin/main; independent ls-remote and remote context readback confirmed publication. Isolated checkout began at `ce05ee40c72fe60a08147d7fe6d8956e71c94968`; original OneDrive checkout and unrelated changes preserved. This final evidence-only context update is committed/pushed with CI skip; runtime remains d98b5ab33bcd.
- Merge: verified fast-forward main promotion `ce05ee4..d98b5ab`; no PR merge.
- Deployment and configuration: GitHub Actions Deploy to VPS run 37931088435 succeeded (https://github.com/blendproperty/midpoint/actions/runs/37931088435), including the test gate. SSH readback confirmed exact deployed SHA d98b5ab33bcd3306fa3a68dbd7862e2467a0ef41 and running web/vacancy scheduler on matching `midpoint-web:d98b5ab33bcd` images. Verified protected database/Compose backup checksums at `/opt/midpoint/backups/brochures-20261009` (directory 700, database 600), and retained `midpoint-web:rollback-brochures-20261009`. No extra PDF service/configuration is required; PDF generation runs inside the existing web container. No schema/production data/provider configuration changes.
- Live production verification: on 2026-10-09 the public vacancies page served exact d98b5ab33bcd deployment marker and all 13 Download brochure actions. Real browser checks passed at 390/1440px with actual native downloads, correct filenames and detail-page actions; all 13 public brochure endpoints returned HTTP 200/application/pdf and valid PDF bytes, and unknown-ID scope returned 404. No browser application errors or horizontal overflow. Downloaded PDFs independently matched exact unit identity, published area/rate/availability, all saved features, Midpoint logo/photographs, leasing contacts and clickable exact detail links. Office/serviced-office/warehouse/continuation layouts visually reviewed. Evidence: `tmp/brochure-live-checks.json`, `tmp/live-pdf-content-checks.json`, `tmp/live-pdfs/`, `tmp/brochure-*-live-*.png` and rendered PDF screenshots. These checks prove functioning production downloads, not leasing acceptance or conversion outcomes.
- Outstanding gates: leasing-team review of brochure presentation, underlying property specifications/imagery/rates/availability and VAT/parking/service-charge accuracy remain business acceptance. Existing Suites, source-data, provider, finance, legal/approval, training, external-site/SEO and scheduled-clock acceptance gates remain unchanged. No enquiry/email is sent by downloading a brochure; analytics click events do not prove conversion or business outcomes.

## 2026-10-09 — Padel image repair and asset links deployed and verified

- Implementation: runtime release fc99e21884064116a1d0d88e44b769e38ba62467 delivers the active-gallery image loading repair, public Hub amenity links, contextual tenant services and five-asset footer network described below. Existing Suites disclosure and Insights pillar/article hierarchy retained.
- Testing: local 34-file / 133-test suite passed with PostgreSQL integration enabled, final production build/type checks passed and compiled desktop/mobile checks passed. GitHub Actions test job succeeded. Live browser interaction checks wait for page load/client initialization before pressing gallery controls.
- Commit and push: implementation plus canonical context committed as fc99e21884064116a1d0d88e44b769e38ba62467 and pushed to origin/codex/amenities-assets-20261009 and origin/main. Independent ls-remote and remote-tracking context readback confirmed publication. This final evidence update is committed/pushed with CI skip; runtime remains fc99e2188406.
- Merge: verified fast-forward promotion from 70cae7448599bd9a8720df119ff1c73af9f5d099; no PR merge.
- Deployment and configuration: Deploy to VPS run 37891068497 succeeded on 2026-10-09 (https://github.com/blendproperty/midpoint/actions/runs/37891068497). SSH readback confirmed exact runtime SHA, running web and vacancy scheduler with matching images. Current pre-release image retained as midpoint-web:rollback-assets-20261009. No schema/data, provider or credential changes.
- Live production verification: exact fc99e2188406 release marker observed on home, amenities and spaces. At 390/1440px each page passed four loaded Padel card images, slide controls, enlarged-image decoding, keyboard wrap/Escape, four Hub links and five correct footer destinations without nofollow. Suites coming-soon/AI notice and internal destination preserved. Contextual STOR24 and OnPoint links verified on business-park and serviced-office guides. No horizontal overflow or browser application exceptions. Desktop/mobile screenshots visually reviewed. Evidence retained beside checkout in assets-live-results.json, assets-production-results.json, asset-destinations.json and assets-live-*.png. Temporary local preview/database stopped after validation.
- Outstanding gates: this proves Midpoint outbound linking and working image delivery. External reciprocal-site changes, real SEO recrawl/indexing/ranking, referral performance and third-party transaction/UAT remain unperformed. All previously recorded property, Suites, provider, finance/data, legal/approval, training and other acceptance gates remain unchanged.

## 2026-10-09 — Padel card loading and tenant asset links (validated; release pending)

- Implementation: live diagnosis reproduced Padel card images with empty currentSrc and zero natural width despite an HTTP 200 image response; the enlarged image decoded successfully. The active photo in each native scrolling amenity gallery now uses eager loading, while inactive slides retain lazy loading. Native controls, enlarged viewer and Suites coming-soon/AI disclosures are preserved.
- Implementation (links): Fond/Gym/Padel cards link to their corresponding public Midpoint Hub routes, with an additional Hub directory link. Spaces, Amenities, the business-park guide and serviced-office guide have contextual OnPoint, STOR24 and Blend portfolio service cards plus a Blend group link. The public footer provides descriptive crawlable links to all five requested assets; About's Blend link label now matches the destination. All links are standard HTML anchors without nofollow. No reciprocal edits to other repositories or invented tenant discounts/booking availability.
- Destination verification: HTTPS reads returned 200 for midpointhub.com/hub, /fond, /gym, /padel; www.blendproperty.co.za; listings.blendproperty.co.za; stor24.co.za; onpointoffices.co.za. Singular listing.blendproperty.co.za did not resolve and is not used. Evidence: sibling asset-destinations.json. This verifies destinations, not SEO rankings or third-party transactional functions.
- Testing: all 34 files / 133 tests passed with booking/vacancy PostgreSQL integration enabled; production build and type checks passed. Compiled browser checks at 390/1440px passed all four Padel card images, gallery navigation, enlargement, keyboard wrap/Escape, four Hub links, five footer destinations and no horizontal overflow/application exceptions on home, amenities and spaces. Additional service-link placement checks passed on business-park and serviced-office guides. Desktop/mobile gallery and service screenshots visually reviewed. Browser acceptance waits for document readiness and specific images/controls rather than unrelated network idle. Evidence: sibling assets-local-results.json and assets-local-*.png.
- Commit and push: isolated codex/amenities-assets-20261009 starts at verified origin/main 70cae7448599bd9a8720df119ff1c73af9f5d099. Canonical context accompanies implementation; publication pending. Original OneDrive checkout and unrelated work preserved.
- Merge: pending verified fast-forward promotion; no PR merge claimed.
- Deployment and configuration: live preflight confirmed runtime c7fd8735059b3b8654c1d79b93a79988aba6f431 and clean tracked server tree. Retained the actual running image as midpoint-web:rollback-assets-20261009. This is a code-only change with no schema, data, credential or provider configuration writes. Deployment pending.
- Live production verification: correction and new links pending exact-release desktop/mobile browser checks after deployment; no production completion claimed here.
- Outstanding gates: real SEO recrawl, indexing/ranking and referral results remain unobserved. Reciprocal links on external sites are outside this Midpoint website change. Existing property, Suites, provider, data, finance, legal/approval, training and other UAT gates remain recorded below.

## 2026-10-09 — Insights hierarchy deployed and live verified

- Implementation: release `c7fd8735059b3b8654c1d79b93a79988aba6f431` delivers the pillar-only Insights directory, assigned supporting article lists, article-to-pillar backlinks and authenticated editorial assignment selector described in the preparation entry below.
- Testing: all 34 test files / 133 tests and final production build/type checks passed locally. GitHub Actions test job also succeeded with all migrations and PostgreSQL booking/vacancy integration enabled. Migration backfill/content-preservation, repeated execution, foreign-key unlinking and draft/protected exclusions were independently checked locally.
- Commit and push: implementation and canonical context committed as `c7fd8735059b3b8654c1d79b93a79988aba6f431`, pushed to origin/codex/insights-pillar-hierarchy-20261008 and origin/main; independent remote readback confirmed both heads and PROJECT_CONTEXT.md on main. This evidence-only follow-up is committed/pushed with CI skip; runtime remains `c7fd8735059b`.
- Merge: verified fast-forward promotion from `aba6c771c042cbd9211b6cf930f33481e01ef7ba` to release `c7fd8735059b3b8654c1d79b93a79988aba6f431`; no PR merge.
- Deployment and configuration: GitHub Actions Deploy to VPS run `37886370589` completed successfully on 2026-10-09 (https://github.com/blendproperty/midpoint/actions/runs/37886370589). Migration `20261009090000_blog_pillar_relationship` applied once and completed. Independent SSH readback confirmed exact release, web and vacancy scheduler running with matching images. Pre-release database/uploads/configuration and rollback image are retained in the protected backup; full database restore/count comparison passed. No provider or credential changes.
- Live production verification: public Insights served exact marker `c7fd8735059b` and passed at 390/1440px: six published public pillar cards, no duplicated blog cards, no horizontal overflow or application exceptions. Warehouses has six assigned supporting articles; Blog retains its six articles; all six articles link back to Warehouses and all six public pillar destinations return HTTP 200. Other pillars show no unrelated articles. Six article photographs decoded successfully; desktop/mobile screenshots visually reviewed. Production query confirmed six warehouse assignments and unchanged public titles, body content, summaries, publication dates and imagery against the pre-release snapshot. Evidence retained beside this checkout in `insights-live-results.json`, `insights-production-results.json`, `insights-live-image-results.json` and live screenshots.
- Outstanding gates: authenticated production editorial save/UAT and future article-topic assignments remain editorial acceptance; the selector and save validation are verified locally. Google recrawl, indexing/ranking and business performance are unobserved. Existing scheduler future-trigger, property/commercial, Suites, provider, data, finance, legal/approval, training and other UAT gates below remain unchanged.

## 2026-10-09 — Insights pillar directory and supporting articles (validated; release pending)

- Implementation: `/insights` now lists published, unprotected pillar guides only; removed the duplicated blog feed and the unrelated resource rows. Each pillar can render its explicitly assigned published supporting articles; every assigned article links back to its public pillar. Pillar breadcrumbs include Insights. Blog remains the article index, with clarified introductory copy. Existing URLs, canonical controls, access gates and authored content retained.
- Implementation (editor/data): added nullable indexed BlogPost-to-PillarPage foreign key with ON DELETE SET NULL and authenticated editorial pillar selection in new/edit blog forms. Migration `20261009090000_blog_pillar_relationship` assigns only the six reviewed existing warehouse article slugs to the published/unprotected Warehouses guide. No drafts published, protected pages unlocked, or article content rewritten. Standalone articles remain possible; future topic assignment is an editorial choice.
- Testing: all 34 files / 133 tests passed with booking and vacancy PostgreSQL integration enabled on the dedicated local test database; 52 migrations applied. Production build/type checks passed. Migration backfill affected exactly six records, repeat affected zero; titles/body/status unchanged; deleting a temporary guide preserved its article and cleared the relationship. New action tests cover authentication, create/update assignment, invalid pillar rejection and removing an assignment.
- Browser validation: compiled local preview at 390/1440px passed six pillar cards, no article cards on Insights, six warehouse supporting articles, six articles on Blog, all six article-to-guide backlinks and all six pillar destinations. Draft/protected guide exclusions and unpublished article exclusion passed. New/edit editor selector and saved selection loaded correctly; no browser application exceptions or horizontal overflow. Insights screenshots visually reviewed; actual uploaded article photography is verified during live acceptance. Evidence retained beside this checkout in `insights-local-results.json`, `insights-local-*.png` and verification scripts.
- Commit and push: work on `codex/insights-pillar-hierarchy-20261008` from verified origin/main `aba6c771c042cbd9211b6cf930f33481e01ef7ba`. Original OneDrive checkout/unrelated work preserved. This record accompanies the implementation commit; push/promotion are pending at this point.
- Merge: pending fast-forward promotion; no PR merge claimed.
- Deployment and configuration: pre-release SSH readback confirmed the expected remote baseline, clean tracked tree and running image. Protected production backup in `/opt/midpoint/backups/insights-20261009` includes database, uploads, configuration and rollback image. Full database restore into a temporary isolated container succeeded with matching BlogPost, PillarPage and operational record counts. Migration-only gated deployment remains pending; no credentials/provider configuration changes.
- Live production verification: pending exact release marker, migration readback, six public pillar destinations, article relationship/content readback and responsive desktop/mobile checks. No production completion claimed yet.
- Outstanding gates: authenticated production editorial UAT and future article assignments; Google recrawl/indexing/rankings are not proven by this change. Existing vacancy scheduler observation, property specifications, commercial/legal approvals, Suites, provider, data, finance, training and other UAT gates remain as recorded below.

## 2026-10-08 — Vacancies catalogue deployed; authenticated automatic-sync runtime verified

- Implementation: the professional catalogue and guarded sync described below are now deployed. Midpoint branding, responsive image cards, source-backed feature icons, prices/areas/availability, filters/sorting, calculator, details/enquiry routes and honest missing-data/photo presentation are live. No schema redesign, upstream repository change or credential rotation.
- Testing: the production release pipeline passed all 33 test files / 129 tests with PostgreSQL booking and vacancy integration enabled. [GitHub Actions run 37752720967](https://github.com/blendproperty/midpoint/actions/runs/37752720967) completed test and deploy successfully. Production image build passed. Final server audit verified all 51 existing migrations completed and representative Vacancy, SiteSetting, Enquiry, Contact, Room and Reservation counts unchanged from the backup.
- Commit and push: authorised non-force fast-forward promotion advanced origin/main from `df8dd8c2e3903932918d024e671074157e468532` to release `e23ed341716e0e29325d732cea30203a0a61e061`, incorporating implementation `4bf0d0c5633cc6d2315e4ae6a2d57387dab3fded` and the canonical release/backup context. Remote main was independently read back at the release SHA. This final evidence-only context update is committed and promoted to main with CI skipped; application image/served revision intentionally remains the validated release. Original OneDrive checkout and unrelated changes remain untouched. PROJECT_CONTEXT.md presence on intended remote main is checked after publication before handoff.
- Merge: direct fast-forward promotion under Brett's explicit production instruction; no PR exists. The connector's earlier PR-permission error did not prevent authorised normal Git publication or the gated Actions release.
- Deployment and configuration: production checkout/image and public deployment identifier verified at `e23ed341716e`; running scheduler uses the exact same image as web, the unprivileged nextjs user and read-only root filesystem. Existing scoped provider/cron credentials are configured and actual provider authentication succeeds; no competing host cron job exists. Nightly 00:30 Africa/Johannesburg reconciliation and Monday 01:00 read-only verification are active in the container's scheduler. Migration-only deployment retained; bootstrap seed was not invoked.
- Backup/rollback: fresh restricted server-side custom archive was fully restored without errors in a disposable network-isolated PostgreSQL container; six representative table counts matched. Upload archive tested, backup/configuration checksums and restrictive permissions reverified after release, retained application image remains tagged for rollback and previous commit/Compose/environment/container metadata preserved privately. No backup data or secrets disclosed. Temporary restore container removed.
- Live production verification: public browser returned the exact new deployment on /vacancies at 390/768/1440px with all 13 listings and no horizontal overflow or application exceptions. Passed sector/area/search filters, rate sort, empty/reset behavior, mobile calculator containment, actual detail navigation and no-JavaScript warehouse filtering. Unauthenticated public sync POST rejected with 401. Desktop and mobile detail screenshots visually reviewed; synthetic telemetry intercepted and no enquiry submitted.
- Live integration verification: invoked the deployed scheduler's own authenticated request helper inside its running container, using the internal service network and server-only secret. Actual full reconciliation fetched 13, updated 13, created 0 and deprecated 0; health returned healthy=true, fetched=13, published=13 and error=null. All 13 source/destination records matched on building, unitName, sector, sizeSqm, ratePerSqm, availability, description, features, image and publication status. Final successful verification timestamp 2026-10-08T11:24:16.113Z (13:24 SAST). This is an actual production/provider write/readback, not a simulated feed.
- Remaining acceptance: release and live integration gates above are closed. The first future clock-triggered nightly and Monday runs have not yet been observed; cadence logic passed tests and the same running scheduler request path is live-verified. Event-driven upstream publishing and external failure notifications remain unimplemented. Leasing-team UAT, source specification/availability/imagery accuracy, commercial VAT/parking/additional-charge confirmation, training and all existing Suites, finance, provider, editorial, data and approval gates outside this deployment remain unchanged. No actual lead-delivery, conversion or business outcome claimed.


## 2026-10-08 — Authorised vacancies production release (promotion in progress)

- Approval and scope: Brett explicitly requested "push to production please" after reviewing the implemented catalogue and scheduler. Continue from the isolated validated branch; preserve the unrelated OneDrive checkout changes.
- Implementation/testing: release candidate `34874dbd3d5de8ac037d530d1aa4826420a7a8aa` retains the 129-test/33-file PostgreSQL-enabled validation, production build and browser results below. No runtime code changed in this release-preparation update. Server preflight confirmed a clean tracked main checkout at `f73488fc382261d456749b7726db07438d428762`; remote main `df8dd8c2e3903932918d024e671074157e468532` differs from it only in documentation.
- Backup/rollback: a fresh protected server-side custom PostgreSQL archive was fully restored into a network-isolated temporary PostgreSQL container with no restore errors. Vacancy, SiteSetting, Enquiry, Contact, Room and Reservation counts matched before/after the archive and in the restore. Archive/configuration/upload checksums recorded privately; uploads archive tested; existing application image tagged for rollback and previous commit/Compose/environment/container metadata retained with restricted permissions. Temporary restore container removed. No production backup contents or secrets copied locally.
- Deployment/configuration preflight: production provider API key and cron secret are already configured; cron secret length verified at least 32 characters without disclosure. Actual authenticated Blend Listings feed returned HTTP 200, consistent page 1/limit 100/total 13/totalPages 1, all LIVE statuses and numerical areas/rates. No existing host vacancy-sync cron job was found. No credential rotation, provider change or schema migration is required.
- Commit/push and merge: this release preparation evidence is committed on the isolated feature branch before authorised fast-forward promotion to main. PR creation through the connector was previously denied; normal Git publication and authenticated Actions read access work. Promotion uses a non-force push, preserving intervening remote changes if any. CI/deployment completion is not yet claimed.
- Live production verification: new catalogue and scheduler remain pending until the gated release finishes and exact served revision, responsive UI, representative source/destination field parity and authenticated reconciliation/health are verified. Actual future nightly/Monday execution and leasing-team UAT remain separate acceptance evidence. Existing provider, data, commercial, finance, training, editorial and approval gates remain preserved.


## 2026-10-08 — Professional vacancy catalogue and automatic Blend Listings reconciliation (validated locally; production pending)

- Implementation: redesigned the existing vacancy catalogue with Midpoint dark teal/cyan branding, responsive one/two/three-column image cards, unit/building hierarchy, monthly rate per m², readable availability dates, floor area, four sourced feature icons, focused detail/enquiry/WhatsApp actions and explicit missing-price/area/photo states. Existing search, sector/size/availability filters, office calculator, server GET fallback and analytics remain; added area/rate sorting. Detail pages share feature icons and honest image fallbacks. No schema migration or upstream repository mutation.
- Integration inspection: actual Blend Listings source route delegates to `servePublicListings` with fixed MIDPOINT portfolio; authenticated paginated full snapshot feeds the existing `Vacancy` model. The existing cron endpoint had no scheduler tracked in deployment. Source-side change-event publication was not identified in the inspected integration; event-driven publishing remains unimplemented.
- Implementation (automation): added version-matched internal Compose scheduler for nightly reconciliation at 00:30 Africa/Johannesburg and Monday 01:00 read-only freshness verification, startup catch-up and five-minute retries. Secrets stay server-side. Full-page/count/identifier/numeric validation, request/page limits, empty-feed refusal, PostgreSQL advisory lock and atomic writes protect existing data; manually created vacancies are not deprecated. Saved results expose explicit failures, and listing/detail routes revalidate after changes. Container logs exist; external failure alerts remain unconfigured.
- Testing: 33 files / 129 tests passed with all booking and vacancy PostgreSQL integration tests enabled against a dedicated disposable PostgreSQL 16 database; all 51 existing migrations applied there, no bootstrap seed. Includes actual rollback after a later failure, concurrent sync serialization/manual-row preservation, malformed/incomplete/duplicate/empty feed handling, scheduler timing/authentication, and stale/failed health checks. Production build and TypeScript checks passed. Compose configuration, scheduler syntax and diff whitespace validation passed.
- Browser validation: compiled local preview with the 13 current publicly visible listing snapshots passed 390/768/1440px rendering/no overflow, filters, rate sorting, empty/reset state, mobile calculator containment, actual detail navigation, no-JavaScript server filtering, unauthenticated 401 and local authenticated health. No browser application exceptions. Desktop/mobile screenshots visually reviewed. Snapshot/local credentials are test evidence, not authenticated provider sync or production proof. User-facing evidence is in this chat's outputs directory.
- Commit and push: isolated branch `codex/vacancies-design-sync-20261008` starts at verified origin/main `df8dd8c2e3903932918d024e671074157e468532`. Original OneDrive checkout and unrelated modifications preserved. Implementation and canonical context commit `4bf0d0c5633cc6d2315e4ae6a2d57387dab3fded` pushed successfully to origin/codex/vacancies-design-sync-20261008. Independent `git ls-remote` readback confirmed that SHA and unchanged origin/main baseline; remote-tracking branch readback confirmed this PROJECT_CONTEXT.md on the intended feature branch. This follow-up evidence is committed/pushed on the same branch. Main promotion remains pending.
- Merge: no merge/main promotion performed. Draft PR creation was attempted through the GitHub connector and rejected with HTTP 403 `Resource not accessible by integration`; no PR exists and PR CI has not run. The pushed review branch remains available; the GitHub integration needs PR permission or an authorised maintainer must create/promote it.
- Deployment and configuration: production unchanged. Compose service and CI integration gates implemented in code; no server keys, backup, running scheduler or production configuration were inspected or altered. `LISTINGS_API_KEY`, `VACANCY_SYNC_SECRET`, current source API scope, protected backup/rollback readiness and release access require verification before promotion. Operational release/rollback instructions are in `docs/VACANCY_SYNC.md`.
- Live production verification: read-only public source inspection confirmed 13 listings on the current page; the new UI and scheduler are not live. Exact deployed revision, representative source/destination values/counts, successful authenticated provider reconciliation, real nightly/Monday runs and leasing-team acceptance remain pending. Upstream listing specifications, VAT/parking/service charges, availability correctness, imagery and all existing UAT, provider, data, finance, training, Suites, editorial and approval gates remain unchanged. No production conversion, lead-delivery or business outcome claimed.


## 2026-10-06 — Midpoint brand Google Search campaign and budget reallocation

- Implementation: published `Midpoint | Brand | Search` (campaign `24330541324`) in Blend Property Group Google Ads account `5635711564`, with an independent R42/day budget. Reduced enabled Midpoint PMax `24101834365` from R320 to R288/day and commercial Search `24101993216` from R100 to R90/day. Combined enabled Midpoint daily budget remains R420. STOR24 campaigns remain paused and unchanged.
- Testing: read-only Google Ads API readback confirmed all three enabled campaign budgets, eight enabled keywords (exact and phrase variants of midpoint business park, midpoint midrand, midpoint office park and midpoint business estate), one responsive search ad with 15 headlines and four descriptions, and final URL https://www.mid-point.co.za/. Verified Google Search only, Search Partners/Display disabled, Midrand location criterion `1028673`, and presence-only geographic targeting. API request evidence: budget/status `SyHnqRx6t-gJsn99080Wow`; targeting `WuW_qFajXYE8Q4OOOzjX4g`; ad `3yhimuKkDh4fCX2CiuT31A`; keywords `X2CdFfZ8qXDBaC2zy2yerw`.
- Commit and push: evidence commit `645ceb671283e448b9574f9b66b068ce0475d29c` was pushed directly to origin/main on 2026-10-06 from isolated branch `codex/midpoint-brand-evidence-20261006` from verified origin/main `80485a6169e5f5d001328ea3a6634f7d2cf4a140`, by direct fast-forward promotion with CI skipped. Original OneDrive checkout and all unrelated changes are preserved. Remote refs/heads/main was independently verified at that commit, with PROJECT_CONTEXT.md present. This follow-up records the completed push evidence.
- Merge: no application merge or PR required; context-only fast-forward promotion.
- Deployment and configuration: campaign publication and budget changes were saved in live Google Ads after account identity verification/pop-up access. Maximize clicks bidding; AI Max matching, text customization and URL expansion disabled. No website code, database, provider credentials or website deployment changed.
- Live production verification: API confirms brand campaign ENABLED and ad REVIEWED/APPROVED. At readback it had zero impressions/clicks/conversions; this proves saved configuration and approval, not actual serving, lead delivery or campaign performance. One individual headline asset was still under review. Website conversion end-to-end UAT, lead quality, performance and existing project/provider/business gates remain unverified or unchanged. PMax's pre-existing missing lead-form warning remains open. Rollback: pause brand and restore PMax/Search daily budgets to R320/R100.

This is the canonical delivery record for production-impacting Midpoint work. A task is complete only when each applicable stage below has evidence; unresolved gates remain explicit.

## 2026-10-02 — Business-park noindex report recheck

- Implementation: diagnostic only; no application, CMS or indexing configuration change was needed. The initial 20260731110000 migration explicitly created this page as a review-only/noindex record; the 30 September indexing correction remains effective.
- Testing/live production verification: fresh HTTP response and rendered Chromium DOM on https://www.mid-point.co.za/business-park-midrand returned 200 with index, follow and no blocking X-Robots-Tag header. Apex-domain and trailing-slash variants also rendered index, follow; two Googlebot user-agent requests with no-cache headers returned the same directive. These user-agent simulations are not Google Search Console live inspection. The canonical is the requested www URL; sitemap includes that URL with lastmod 2026-09-30T08:24:36.859Z. New guide heading/content remains present. Served release f73488fc3822 matches the latest production release documented below.
- Commit and push: evidence-only update from codex/midpoint-area-guide, fast-forwarded to origin/main baseline a5b8c21; intended for main with CI skip. Original OneDrive changes and generated files preserved.
- Merge: no runtime merge required; evidence-only fast-forward promotion, no PR.
- Deployment and configuration: unchanged; no redeployment or index toggle performed during this diagnosis.
- Outstanding evidence: the source/date of the user's noindex warning has been requested but not supplied. An older crawl/report remains a possibility, not an established cause. Actual Google indexing/ranking, Search Console processing and all existing editorial, commercial, Suites, provider and UAT gates remain unverified or unchanged.

## 2026-10-02 - SEO capability parity with Stor24 CMS (published and live verified)

- Approved rollout: user explicitly requested publication after backup. Protected production PostgreSQL custom archive was fully restored into an isolated temporary database; representative table counts matched, checksum/permissions verified, and previous image/commit/configuration retained. Revision `e77e9099bbde691736d10816d3aaffa7def107c6` fast-forwarded main and GitHub run `36965120234` completed test/deploy successfully; new planning migration applied. Live checks uncovered the pre-existing availability-report page redirect dropping campaign queries, so it is now routed through the shared query-preserving middleware with regression coverage. The corrective release passed the final live checks below.

- Safe release adjustment: automatic VPS deployment explicitly overrides the migration service command with `npx prisma migrate deploy`, avoiding unrelated bootstrap seed mutations. The seed remains available for intentional setup; existing CI integration gate, SSH secrets, build/deploy order and live check are unchanged. Added deployment regression checks, parsed both YAML files, and validated Compose with `--no-interpolate --quiet` (no credentials output). This adjustment was validated locally before the approved production release. Full suite after adjustment: 28 files / 108 tests; runtime application/build/browser evidence below remains applicable because this follow-up changes workflow, comments, tests and delivery notes only.

- Final deployment: `f73488fc382261d456749b7726db07438d428762` fast-forwarded main; [GitHub Actions run 36965761226](https://github.com/blendproperty/midpoint/actions/runs/36965761226) passed test and deploy. Local final validation passed 28 files / 109 PostgreSQL-enabled tests, production build/type checks and incremental lint. Production checkout and public deployment identifier match `f73488fc3822`; migration `20261002060000_content_ideas` completed, 51 migrations applied and the new planning table is empty. Existing representative record counts are unchanged from backup.
- Backup and rollback: a protected server-side custom PostgreSQL archive was fully restored into an isolated temporary database; representative counts matched. Archive checksum and permissions were independently rechecked; temporary restore container removed. Previous application commit `e96f1338d0c48de473b5cf726a0ea82dbcffff80`, image, Compose/configuration and a retained rollback image tag are recorded privately alongside the backup. No database/configuration contents or secrets were copied into the repository or disclosed.
- Live verification: 100 public HTTP/HTML checks passed across static pages, existing pillars, published vacancy/article delivery, page-specific OG/X/canonicals, FAQ placement, sitemap deduplication/exclusions, robots, llms, admin noindex/authentication and campaign-query retention. Live Edge browser checks at 390/1440px passed exact deployment, canonical/social DOM, no horizontal overflow and no application exceptions; screenshots visually reviewed. Evidence is retained in sibling `seo-verification/live-results.json`, `live-browser-results.json` and live screenshots. No synthetic content or indexing notification was sent to production. No Google indexing/ranking outcome claimed.

- Scope and evidence: actual Midpoint website (`blendproperty/midpoint`), isolated branch `codex/midpoint-seo-parity-20261002`, baseline `121e02db865ed2887860841260f4a29862ebdb35`. Stor24 CMS inspected at `e77f3c1bf68dac656f2aceed9af4d5fa1f838d6b`, including its current context, Payload collections, SEO review/overview and private content ideas. The requirement-by-requirement matrix with source paths and architectural boundaries is in `docs/SEO_PARITY_2026-10-02.md`. Original OneDrive checkout and unrelated Hub/FOND work are untouched.
- Implementation: consistent editable metadata/canonical/index controls and OG/X delivery across static, CMS and vacancy pages; broader Page SEO editor; real-date filtered sitemap and configured robots/discovery delivery; safe canonical writes and query-preserving redirects; correct FAQ placement; private content ideas; authorised Google-report shortcuts; reactive writing checks/search preview, retained closed-section social image and mobile workspace fixes. Existing brand, content, authentication and automatic schema architecture retained. Writing scores and report links do not claim rankings, account verification or imported Google metrics.
- Database: additive `20261002060000_content_ideas` adds the authenticated planning table and validation constraints. All 51 migrations applied to disposable local PostgreSQL 16; production migration subsequently applied through the approved migration-only deployment, with no seed or credential/permission changes. Progress tracking does not publish content.
- Testing: PostgreSQL-enabled full suite passed (27 files, 106 tests); final SEO delivery suite passed (10 tests); production build/type checks passed. Changed-source ESLint passed 49 files with no errors/warnings using a task-local runner; existing repository-wide lint command remains unconfigured and launches setup. Compiled Edge browser verification covers metadata save/readback, social image retention, canonical/index delivery, sitemap/robots/llms, redirects, authenticated/private idea lifecycle, reactive TinyMCE body and desktop/mobile layouts. All 60 compiled-browser checks passed; desktop/mobile screenshots were visually reviewed. Results and screenshots are retained in sibling `seo-verification`.
- Commit/publication: runtime implementation commit `2c3749476bb3db37217a134cf6e07d2d6a86f445` on the named local branch; final evidence commit and patch/bundle paths are supplied in task handoff. After explicit user approval, main was fast-forwarded to the verified release; no PR merge was needed. Runtime correction and final release: `f73488fc382261d456749b7726db07438d428762`.
- Remaining gates: authenticated production editorial UAT; external Google ownership, sitemap processing and actual indexing/outcomes. Local tests do not resolve existing commercial, Suites, infrastructure or provider acceptance gates. Rollback retains the additive planning table/data while restoring the previous application.

## 2026-09-30 — Midrand business-park leasing guide

- Implementation: expanded the existing /business-park-midrand CMS page with a workspace comparison, Halfway House access guidance, a transparent illustrative occupancy-cost comparison, building-viewing checklist, operating/coming-soon amenity distinctions, leasing steps and 11 tenant FAQs. Added contextual links to existing office, warehouse, serviced-office, location, amenities and vacancy pages. Removed stale fixed rental ranges, internal editorial language and the implication that Blend has owned the estate since 2006. No market averages, travel times, tenant statistics or availability promises invented.
- Presentation and search metadata: guide-specific section navigation, useful content before feature cards, accessible comparison tables, title/description/canonical updates and dateModified. The named manager is presented as a property contact; no new human expert review is claimed. The guide's Place markup omits the shared unconditional amenities list. Other pillar-page layouts and publication/access controls are preserved.
- Testing: 49 migrations applied to a disposable local PostgreSQL database. Reapplying the targeted update affected exactly one row, preserved publication/access/media fields and left the other two existing pillar records unchanged. Final release checks passed: all 26 test files / 96 tests with PostgreSQL integration enabled, production build, type checks and compiled-browser readback including the clarified Place markup. Initial test invocation used a non-allowlisted local database address and was rejected by two existing safety guards; rerunning against the required disposable test endpoint passed.
- Browser evidence: local production preview passed HTTP 200, canonical/indexability, 11 FAQs, section anchors, table semantics and hero/overflow checks at 390/768/1440px with no browser exceptions. Desktop and mobile screenshots were visually reviewed. Screenshots, the pre-change public HTML and verification scripts are retained outside the repository in the attached worktree's sibling verification directory. Local publication of the preview record is test data only.
- Commit and push: content/runtime commit 4f4cfa2ca00dd8413743c8f5b08245ca832d11b9 and indexing follow-up e96f1338d0c48de473b5cf726a0ea82dbcffff80 pushed from isolated branch codex/midpoint-area-guide to origin/main, baseline 025a8dd693db22c13f4dafc86781704c5376605e. Unrelated changes in the original OneDrive checkout are preserved. Final evidence-only update uses CI skip.
- Merge: both fast-forward promotions to main completed; no PR merge.
- Deployment and configuration: GitHub Actions runs 36688451854 (content) and 36689124521 (indexing) succeeded, including PostgreSQL tests and server deployment. Both migrations applied successfully; no provider/environment changes. Runtime release e96f1338d0c4 was independently observed on the public page.
- Live production verification: initial acceptance detected noindex and sitemap exclusion; saved pre-release HTML proved the same directive existed before this task. After the indexing correction, public /business-park-midrand returned 200 on e96f1338d0c4 with index, follow, no noindex response header, and the self-canonical URL. robots.txt allows crawling. The dynamic sitemap now includes the exact URL with lastmod 2026-09-30T08:24:36.859Z.
- Live browser acceptance: passed all 11 visible FAQ/schema answer matches, dateModified, guide-specific Place markup, section anchors, accessible tables, arithmetic and illustrative-price caveat, coming-soon Suites wording and all seven contextual internal destinations (HTTP 200). At 390/768/1440px the hero text remained contained and document width matched viewport width; no browser exceptions. Live desktop/mobile screenshots visually reviewed. Evidence is in verification/live-result.json and live-*.png beside the attached checkout. This proves release and crawl eligibility, not Google indexing or rankings.
- Indexing correction validation: the follow-up clears noIndex only on the already-published, unprotected business-park-midrand record. Local PostgreSQL checks passed: draft and password-protected cases remain unchanged, public/unprotected case becomes indexable and other pillar pages remain unchanged. All 50 migrations applied locally; final local compiled-browser acceptance passed. No draft publication or access unlock is performed. Local preview processes and both task-owned database containers were stopped after validation; data retained.
- Outstanding gates: Google recrawl, actual indexing/ranking and organic-enquiry measurement; current unit specifications, commercial terms and amenity operating details remain subject to the leasing team's confirmation. No new property-manager sign-off, field survey or Search Console/backlink audit was performed. Existing Suites opening, inventory, provider, finance, data, training, legal/approval and staff-UAT gates elsewhere in this record remain unchanged.

## 2026-09-15 — Suites coming-soon and AI-rendering disclosure

- Implementation: per Brett's confirmation that Suites imagery is currently AI-rendered, added Coming soon badges and explicit AI-rendering notices to the shared Suites card, image overlays, enlarged gallery, Suites landing-page hero and gallery. Added AI-rendering alt text and illustrative/final-finishes caveat. Public enquiry copy now refers to future stays; existing enquiry processing and staging booking gates are unchanged. No opening date invented.
- Testing: 26 files / 93 tests passed, with 3 PostgreSQL tests deferred to CI; existing CTA expectation updated for the authorised copy change. Final production build passed. Local production browser verified the card and enlarged notice, notice persistence when navigating, AI alt text, no notice on Fond, landing hero disclosure and the separate Suites gallery modal disclosure. Mobile card screenshot reviewed; no browser exceptions in the disclosure check.
- Commit and push: runtime 25dae92e6664d16dcdff9ddb9b6724fff5024497 pushed to origin/main from codex/amenities-showcase, baseline 1178917. Unrelated changes preserved; evidence follow-up uses CI skip.
- Merge: fast-forward promotion to main completed; no PR merge.
- Deployment and configuration: GitHub Actions run 34953915794 succeeded, including database integration tests and server deployment. No data/configuration changes.
- Live production verification: on 2026-09-15 homepage and amenities browser checks confirmed Coming soon and AI-rendering disclosure on the Suites card and enlarged viewer, persistence after navigation, AI alt text, no disclosure applied to Fond and no browser exceptions. Public Suites landing page returned 200; its hero, separate gallery modal and future-stay enquiry wording passed browser readback.
- Outstanding gates: Suites remain coming soon. Actual photographs, opening date, final finishes and all existing accommodation/provider/finance/data/training/UAT gates remain unverified or unchanged.

## 2026-09-15 — Enlarge amenity photographs

- Implementation: all four shared amenity galleries now have clickable photo buttons with an Enlarge cue. The selected photo opens in a native modal dialog with uncropped responsive imagery, captions/count, previous/next controls, arrow-key navigation, mobile horizontal swipe, Escape/close/backdrop dismissal, keyboard focus containment/return and restored background-scroll state. Enlarged images mount only when opened. No new packages, data or provider changes.
- Testing: 26 files / 93 regression tests passed; 3 PostgreSQL tests deferred to CI. Final production build passed. Local production browser checks passed opening all four galleries, selected second-photo readback, uncropped image sizing, navigation/wrap, Tab containment, focus return, body-scroll restoration, all dismissal paths and mobile touch swipe. Existing gallery checks passed at 390/768/1440px with 16 photos and no browser exceptions. Desktop/mobile enlarged screenshots visually reviewed. Initial focus-containment failure corrected and retested successfully.
- Commit and push: runtime d2fe4f6ca94184a298e2d088136357759b6845f9 pushed to origin/main from codex/amenities-showcase, baseline 47af269; unrelated root changes preserved. Follow-up evidence uses CI skip.
- Merge: fast-forward promotion to main completed; no PR merge.
- Deployment and configuration: GitHub Actions run 34953065388 succeeded, including unit/PostgreSQL integration tests and server deployment. No configuration changes.
- Live production verification: on 2026-09-15 homepage and /amenities returned 200 on release d2fe4f6ca941. Browser checks on both pages passed opening all four galleries, selected photo, uncropped images, next/previous and keyboard wrap, focus containment/return, restored scroll, Escape/close/backdrop dismissal and mobile touch swipe; final runs recorded no browser exceptions. Initial pre-load automated clicks timed out; tests were corrected to wait for page load. One separate diagnostic visit recorded a transient React hydration warning; subsequent identical visits and both complete live test runs were clean. Its underlying cause was not established and is not claimed fixed.
- Outstanding gates: physical-device/user acceptance remains; investigate further if the transient hydration warning recurs. Existing accommodation, finance, provider, data, training and staff-UAT gates remain unchanged.

## 2026-09-15 — Correct amenities duplication and restore The Suites

- Implementation: corrected the earlier showcase composition, which left duplicate CMS lifestyle cards below the galleries and relegated accommodation to a small mention. Added The Suites at Midpoint as a fourth full gallery on the homepage and amenities page, with four existing suite images optimised to WebP (199,748 bytes total) and a link to the existing public Suites page. Gallery grid uses four desktop columns, two tablet columns and one mobile column.
- Page composition: amenities-only filtering removes the superseded Fond, Gym/Padel and Suites feature cards while preserving trails, backup power/water and future unrelated CMS features. Removed the redundant amenities badge strip. Moved section navigation above the showcase; Highlights links to the galleries and Estate facilities links to the remaining supporting cards. Other pillar pages and stored CMS records are unchanged. Operating-status caveats and existing booking/provider gates are retained.
- Testing: 26 test files / 93 tests passed, 3 PostgreSQL tests deferred to CI. Added a regression test proving duplicate lifestyle entries are excluded while supporting/new CMS features survive. Production build passed. Local production-browser checks passed four galleries/16 images, Suites heading/link, controls, keyboard navigation and no overflow at 390/768/1440px; desktop screenshot reviewed. Public Suites destination returned 200 before promotion. Local database-backed page unavailable; full amenities composition requires live readback.
- Commit and push: runtime commit e291929274fce561bf1ba6616f36bb79a178b0c5 pushed to origin/main from codex/amenities-showcase, baseline 0071c33. Unrelated root changes preserved; follow-up evidence commit uses CI skip.
- Merge: fast-forward promotion to main completed; no PR merge.
- Deployment and configuration: GitHub Actions run 34952043731 completed successfully, including unit/PostgreSQL integration tests and server deployment. No database/configuration changes.
- Live production verification: on 2026-09-15 both public pages passed browser checks for four galleries/16 images, Suites heading/link, arrows, keyboard navigation, scroll/count synchronisation and no overflow at 390/768/1440px, with zero browser exceptions. /amenities returned 200 on release e291929274fc; its only remaining CMS feature headings are 1.8 km of landscaped trails and Generator-backed power and backup water. Exactly one The Suites at Midpoint heading and the new Highlights anchor were verified. Live supporting-facilities screenshot and local desktop/mobile Suites screenshots visually reviewed.
- Outstanding gates: none for this presentation correction beyond physical-device/user acceptance. Existing accommodation, provider, finance, data, training and staff-UAT gates below remain unchanged.

## 2026-09-15 — Amenities photo showcase

- Implementation: replaced the homepage icon marquee with three photo cards for Fond, Gym and Padel, also rendered on the amenities pillar page. Each native scroll-snap gallery has four supplied images, previous/next controls, keyboard navigation, photo count and reduced-motion support. Desktop uses three columns; mobile stacks the cards. Existing CMS content and accommodation/provider gates are preserved; no new booking links, database changes or packages.
- Image optimisation: 12 selected images from Brett's Midpoint Hub folders converted to metadata-stripped WebP, capped at 1400px. Source total 4,056,057 bytes; output 1,953,468 bytes (51.8% smaller), with Next responsive sizing and lazy loading.
- Testing: npm test passed 25 files / 92 tests; 3 PostgreSQL integration tests skipped locally and remain CI-gated. npm run build passed compilation, type checking and route generation. Playwright against the local production build verified three galleries / 12 images, next/previous boundaries, keyboard navigation, scroll/count synchronisation, no browser exceptions and no horizontal overflow at 390, 768 and 1440px. Desktop/mobile screenshots visually reviewed. Local runtime used database fallbacks; the CMS-backed amenities route requires live verification after deploy.
- Commit and push: runtime commit 3fc84552044db55d92c9e4b0983168eaea104ef9 pushed to origin/main from codex/amenities-showcase, baseline 10a2300. Unrelated root checkout changes preserved. This follow-up evidence update uses CI skip.
- Merge: fast-forward promotion to main completed; no PR merge.
- Deployment and configuration: GitHub Actions Deploy to VPS run 34943721409 succeeded, including unit/PostgreSQL integration tests, server build and served-release verification. No configuration changes.
- Live production verification: on 2026-09-15, homepage and /amenities returned HTTP 200 and served release 3fc84552044d with the new showcase. All 12 WebP assets returned 200 with image/webp. Playwright passed all three gallery controls, keyboard navigation, scroll/count synchronisation and 390/768/1440px overflow checks on both public pages, with no browser exceptions. Live desktop screenshot visually reviewed. An initial rapid automated keypress ran before the visible counter settled; repeating after waiting for the displayed slide counter passed on both pages. Local emulated mobile touch swipe also passed; physical-device UAT was not performed.
- Outstanding gates: physical-device/user acceptance remains optional for the visual update. All existing accommodation, finance, provider, data, training and staff-UAT gates elsewhere in this record remain unchanged.

## 2026-09-11 — Booking introduction copy

- Implementation: removed the requested sentence "Two considered ways to stay in Midrand." from /stay; retained the practical date/price/booking instructions. No functional, data or finance changes.
- Testing: local regression suite passed 25 files / 92 tests, with 3 PostgreSQL integration tests skipped locally. CI will run database tests and gate deployment.
- Commit/push/merge: runtime commit 00cbc6a3f89e1124ae5c9cad62278ca21add0865 fast-forwarded from codex/suites-staging to main; unrelated generated files preserved. Follow-up evidence-only commit uses CI skip.
- Deployment/configuration/live verification: GitHub Actions run 34573415340 succeeded, including database tests and server build/deploy. Live staging /stay returned 200 with deployment 00cbc6a3f89e; removed sentence absent and remaining date/price instructions present. Staging noindex/nofollow/noarchive/nosnippet retained. All existing finance, email and operational approval gates remain unchanged.

## 2026-09-11 — Brett administrator access recovery

- Implementation/configuration: verified the requested existing account and retained its SUPER_ADMIN role. At the user's explicit request, replaced its password with a cryptographically random credential, invalidated previous unused reset tokens, and created a one-use, one-hour staging password-setup link. No password, hash or reset token is recorded here. Accounts remain shared with production; the password change affects both hosts.
- Testing/live verification: normal HTTPS staging login returned 200; its issued session then loaded /admin/suites with HTTP 200. This proves authentication and dashboard rendering, not full operational UAT.
- Deployment: account-data recovery only; no runtime code or infrastructure deployment. SMTP configuration variables are populated, but delivery remains unverified and the reset-email URL still uses the configured shared domain. This recovery does not claim to fix email delivery or host selection.
- Commit/push/merge: evidence-only update to be fast-forwarded to origin/main with CI skip; no application changes or PR merge. Remaining operational, finance and staff-UAT gates below remain unchanged.

## 2026-09-11 — Suites staff operations workspace

### Implementation

- Premium responsive staff shell and sign-in, live database overview, searchable/paginated reservations and guest directory, staff-created unpaid test bookings, private reservation notes, room-readiness handover and checkout-to-dirty workflow. Calendar navigation and inventory feedback improved; existing website management remains accessible.
- Added migration 20260911060000_suites_operations for readiness metadata and private BookingNote records. Existing rooms start UNASSESSED. Staff actions retain session authentication, transactional room allocation and test-only reservation boundaries.
- Review guide: docs/SUITES_ADMIN_REVIEW.md. Staging /admin opens /admin/suites; original website dashboard remains available through Website management.

### Testing

- Local disposable PostgreSQL integration run: 25 files / 95 tests passed, including staff creation/idempotency, notes, readiness and checkout; existing concurrency tests passed. Nine authenticated admin routes passed the local smoke script.
- Authenticated local browser: created an unpaid test reservation, saved an internal note and room-readiness update; reviewed desktop overview and mobile reservation/navigation layouts. Synthetic records exist only in the disposable local database.
- Final release run: all 95 tests passed with PostgreSQL enabled; npm run build passed compilation, type checks and route generation. Repeated all nine authenticated admin smoke routes against the compiled production build: passed. Desktop login/overview visually checked at 1440px; overview document width 1425px with no horizontal overflow. Saved local Room 01 INSPECTED state/note read back from PostgreSQL.

### Commit and push

- Runtime commit 51e19cd5e1ab121fe3c12fdf9673df24451aed86 pushed from codex/suites-staging to origin/main, baseline 259c67c2f7d28d5fc2c576d9de5eca3540f2774b. Unrelated root changes and generated files excluded. Follow-up evidence-only commit uses CI skip.

### Merge

- Fast-forward promotion to main completed; no PR merge.

### Deployment and configuration

- GitHub Actions Deploy to VPS run 34557535242 succeeded at 03:16:51 UTC (05:16:51 SAST), including PostgreSQL tests, server image build, migration deployment and served-release check. Runtime deployment identifier 51e19cd5e1ab. No finance provider, real payment collection, refunds or guest email delivery enabled.

### Live production verification

- Live HTTP checks after deployment: staging /admin/login and /stay returned 200 with deployment 51e19cd5e1ab and noindex/nofollow/noarchive/nosnippet header. Staging robots.txt remains User-agent: * / Disallow: /. Unauthenticated /admin/suites, /admin/housekeeping and /admin/guests redirect 307 to /admin/login; no private content exposed.
- Production home and Suites showcase returned 200 with deployment 51e19cd5e1ab; /stay and /api/stay remained true 404. Browser refreshed the deployed login and visually verified the new design.
- Local compiled-build browser additionally verified guest search to matching reservation history, original website dashboard access, calendar, mobile login (390px document/viewport) and persisted readiness screen (375px document within 390px viewport). Local test server/database stopped without deleting data.
- Authenticated deployed operations have NOT been exercised in this run: no production staff credentials were created or bypassed. Local authenticated/database proof and successful deployment are distinct from staff UAT.

### Outstanding gates

- Authenticated deployed staff UAT, approved inventory/opening dates, pricing/policies, provider decision and finance integration, real guest emails, data retention and staff training remain required before operational launch. Existing roles remain SUPER_ADMIN/EDITOR, not granular hotel roles. No channel-manager synchronisation or financial reporting/reconciliation is claimed.
- Existing public-page duplicate contact-form feedback remains outside this admin release.

## 2026-09-10 — Main navigation opens Suites showcase first

### Implementation

- Corrected both desktop and mobile "Book a Stay" menu links from /stay to /the-suites-at-midpoint. The showcase hero's "Book your stay" still opens /stay. This preserves the requested showcase-first journey.

### Testing

- Local tests: 24 files passed; 89 tests passed and 2 database integration tests skipped. Added coverage for both menu variants; existing hero destination coverage retained. Type checking passed, exit 0. Deployment CI tests/build passed.

### Commit and push

- Runtime commit f3ae2c0b00c3757ecff7731143d6890b7c656216 pushed to origin/main from codex/suites-staging, baseline 1f30d0f55febee8bea7d7ee44ebd24d57f5e19e4. Unrelated root/generated files preserved. Follow-up evidence-only commit uses CI skip.

### Merge

- Fast-forward promotion completed; no PR merge.

### Deployment and configuration

- GitHub Actions run 34482581305 completed successfully for f3ae2c0b00c3757ecff7731143d6890b7c656216. No data or configuration changes.

### Live production verification

- Browser verification on staging: refreshed previously stale /stay tab; opened responsive menu and clicked Book a Stay; URL changed to /the-suites-at-midpoint with showcase heading. Clicked Book your stay; URL changed to /stay with Find your stay heading. Repeated menu navigation and left showcase open.
- Served HTML contains both menu variants targeting /the-suites-at-midpoint; staging noindex response header remains. Production /stay still returns 404.

### Outstanding gates

- All test-only booking, provider, commercial approval and UAT gates remain. Duplicate contact-form feedback remains unresolved and is not part of this navigation-only fix.

## 2026-09-10 — Suites hero booking button

### Implementation

- Replaced the staging showcase hero's "Check dates" label with "Book your stay"; its existing /stay destination is retained. The showcase page remains /the-suites-at-midpoint.
- Production uses "Request availability" and retains its enquiry anchor because live bookings remain disabled. No booking activation or unrelated layout changes.

### Testing

- Added regression coverage for staging label/destination and production enquiry fallback. Local tests: 24 files passed, 88 tests passed, 2 database integration tests skipped (database not enabled for this copy change). Type checking passed, exit 0.

### Commit and push

- Runtime commit 35175c493d27896246d7c1a31817a38b6e3ab755 pushed from codex/suites-staging to origin/main, fast-forward from verified 7496dcfcc1b803c137d787940b1adae450654375. Unrelated root/generated changes preserved. Follow-up evidence-only context commit uses CI skip.

### Merge

- Fast-forward promotion completed; no PR merge.

### Deployment and configuration

- GitHub Actions run 34481543440 completed successfully, including tests and server deployment. No configuration or database changes.

### Live production verification

- Verified served staging showcase HTML on 2026-09-10: the cyan hero anchor is labelled "Book your stay" with href="/stay". Showcase and destination /stay return 200; staging noindex remains in place.
- Production showcase retains enquiry fallback ("Request availability" to #request-to-book), while production /stay remains excluded. No real booking/payment activation.

### Outstanding gates

- Existing test-only booking, provider, commercial approval and UAT gates remain unchanged. Duplicate contact-form feedback remains separate and unresolved.

## 2026-09-10 — Correct accommodation branding

### Implementation

- Corrected accommodation category names to Studio and Executive Suite under The Suites at Midpoint. OnPoint remains the separate serviced-office brand.
- Added scoped data migration for existing category names/slugs and unsent TEST_PREVIEW confirmation bodies. Stable category IDs and reservation relationships remain unchanged; historical migrations are preserved.
- New room URLs are /stay/studio and /stay/executive-suite. Legacy room URLs redirect with search details preserved; old checkout links remain accepted. Updated booking metadata.

### Testing

- Local migration applied successfully to disposable PostgreSQL. All 23 test files / 89 tests passed, including migrated category labels, legacy slug compatibility and booking transaction integration.
- Type checking passed (npx tsc --noEmit, exit 0). Deployment CI also passed its tests and production build.
- Initial extended HTTP check used an incorrect test assertion (expected category object, while API returns a string). Corrected the smoke-script assertion; deployed API behavior was unchanged. Repeated smoke passed.

### Commit and push

- Runtime commit eec61f60d650c4a6e009a04e44989519095b5964 pushed to origin/main from codex/suites-staging, fast-forward from verified 9cd7e7a40f4cde73d54dc3f14720da9a36eb132c. Root checkout changes and generated files preserved.
- Follow-up delivery evidence and corrected smoke-script assertion are committed with CI skipped; no additional runtime change.

### Merge

- Fast-forward promotion to main completed; no PR merge.

### Deployment and configuration

- GitHub Actions run 34479871731 completed successfully for eec61f60d650c4a6e009a04e44989519095b5964, including data migration and application deployment. Staging domain and production booking exclusion remain unchanged.

### Live production verification

- Staging /stay with 2027-01-08 to 2027-01-10 dates returned 200 with the correct accommodation title, /stay/studio links and no old OnPoint category names; noindex response header remains present.
- /stay/studio and /stay/executive-suite returned 200 with Studio / Executive Suite titles under The Suites at Midpoint. Legacy /stay/onpoint-studio emitted Next.js redirect plus meta refresh preserving dates and guest count to /stay/studio.
- Deployed HTTP booking smoke passed with TEST-260910-A78C950CD2, including Studio category, confirmation preview without OnPoint, legacy checkout, renamed detail routes, quote/hold/payment simulation, private access, calendar and cancellation request.
- Production homepage returned 200, production /stay remained 404, and serviced-office page returned 200 retaining Serviced Offices in Midrand | OnPoint at Midpoint.

### Outstanding gates

- Booking remains simulated: all commercial, inventory, provider/email, operational approval and UAT gates below remain open. Earlier duplicate-contact-form and hero-button wording feedback is separate and not changed by this branding correction.
- Two synthetic bookings were created during live smoke checks. The first check stopped after simulated confirmation due to the test-script assertion; staff should cancel that booking-qa@example.test record. The successful repeat has a cancellation request pending. No real payment or external email occurred.

## 2026-09-10 — Testable Suites booking platform

### Implementation

- Added the staging guest journey: date search, two room categories, supplied-image lightbox, server-priced checkout, 15-minute physical-room holds, simulated success/decline/corporate payments, confirmation, captured email previews, calendar/text downloads and private booking management/cancellation requests.
- Added authenticated booking dashboard, 14-day physical-room calendar, maintenance blocking, reassignment/date amendment, check-in/out, no-show, staff cancellation/test refund and simulated balance settlement. Inventory/base rates and validated policy, discount, extras and date-rule editors are configurable.
- PostgreSQL exclusion constraint independently prevents overlapping active reservations. Booking, maintenance and inventory mutations use transaction-scoped locks; expiry and idempotency are enforced server-side.
- Explicit SAMPLE configuration: 12 Studio / 6 Executive within the 18-room inventory; R1,150 / R1,650; 7-night 10%, 30-night 20%, MIDPOINT10 and CORP15. These are test fixtures, not approved operational inventory/rates.
- Captured first/last source, medium and campaign on bookings; suppressed production analytics tags and internal page-view counting on staging. Production booking routes remain closed.
- Added dated market references and operating/test instructions in docs/SUITES_BOOKING_TEST_GUIDE.md. No generated accommodation imagery, real card processing or external email transmission.
- Deployment workflow now tests migrations and concurrency against disposable PostgreSQL and applies additive migrations before switching the web container.

### Testing

- 2026-09-10: all 46 migrations applied successfully to dedicated disposable PostgreSQL 16 on localhost:55439.
- 2026-09-10: 22 test files / 86 tests passed with real database integration enabled. Includes invalid dates/pricing, two simultaneous last-room attempts, database exclusion enforcement, idempotency, declined/successful/corporate payment, single-message confirmation, expired holds, adjacent stays, conflicting/valid amendments, settlement, check-in/out, cancellation/refund, maintenance and production route exclusion.
- HTTP smoke passed locally for quote, hold, duplicate request, unauthorized access, cross-origin rejection, payment outcomes, confirmation message, calendar download, private-code lookup, cancellation request, guest routes and unauthenticated admin protection.
- All four admin screens rendered HTTP 200 with a local-only signed test session. No production admin credentials were exposed or created.
- Browser verification: mobile 390px results and room-gallery navigation; desktop 1440px detail/summary and navigation. No horizontal document overflow in inspected results/detail viewports.
- 2026-09-10: final production build passed compilation, type checking, page generation and build tracing (exit 0). Deployment verification follows below.

### Commit and push

- Implementation commit ca3b999146e9294f12bdf5674efd2cdfacfaa297 was pushed to origin/main from .worktrees/suites-staging, branch codex/suites-staging. Verified baseline: 715a4cb93fad44e31d99137555b17673dc1ea3e3.
- Follow-up guard commit dfc5e3dfe37949fdb0f02c20a9cfe159f2b83bc3 was also fast-forward pushed to origin/main. This evidence-only context update is committed separately with CI skipped; it changes no deployed runtime code.
- Unrelated changes in the root checkout are preserved. Generated next-env.d.ts and tsconfig.tsbuildinfo are excluded.

### Merge

- Implementation was promoted directly by fast-forward push to origin/main; no PR merge.

### Deployment and configuration

- GitHub Actions Deploy to VPS run 34478215420 completed successfully for ca3b999146e9294f12bdf5674efd2cdfacfaa297. Staging and production share one application/container/database; this change does not claim full infrastructure isolation.
- Final guard deployment run 34478909187 completed successfully for dfc5e3dfe37949fdb0f02c20a9cfe159f2b83bc3, including migration/integration-test gate and production build.
- New booking flows are staging-host gated, reservations are explicitly TEST, payment simulation never collects cards, and all email messages remain TEST_PREVIEW outbox records.

### Live production verification

- On 2026-09-10, staging and production served deployment ca3b999146e9. Production homepage HTTP 200; production booking API HTTP 404.
- Staging /stay HTTP 200 with X-Robots-Tag noindex, nofollow, noarchive, nosnippet; robots.txt disallows all. The served staging page excludes the production GTM script and shows 12 Studio / 6 Executive test rooms on unoccupied dates.
- Deployed synthetic HTTP journey passed with reference TEST-260910-109033E9D2: server quote, hold, retry idempotency, private access denial, origin protection, declined/success payment, one email preview, calendar download, private retrieval, cancellation request and admin protection. No money or email was transmitted.
- Live browser verification confirmed MIDPOINT10 changes the two-night Studio total to R2,070, then preserves dates and code in checkout; adding test late checkout updates the total to R2,320.
- Found production page exclusion was a streamed not-found screen with HTTP 200 rather than a true 404. Added an early middleware guard for /stay, its descendants, /manage-booking and /api/stay. After deployment dfc5e3dfe379, production /stay and /manage-booking both returned HTTP 404; staging /stay remained HTTP 200 with noindex response headers.
- The complete browser journey also confirmed synthetic reference TEST-260910-045C1D0A15 at R2,320, PAID (test), with the captured confirmation email and acknowledged cancellation request. Mobile confirmation/cancellation was visually checked at 390px. No real card, money or external email was used.
- Production homepage remains HTTP 200, robots metadata index/follow and WhatsApp destination 27600185206; /amenities remains HTTP 200 with The Suites at Midpoint heading.
- Temporary local app/database processes were stopped after testing. The disposable test database was retained, not deleted.
- The full HTTP smoke was repeated successfully on final deployment dfc5e3dfe379 with reference TEST-260910-B99B4E963F. This and the earlier HTTP/browser synthetic records have cancellation requests waiting for staff review.

### Outstanding gates

- Final room numbering/category split, image mapping, bed/capacity confirmation, commercial rates, tax/invoicing, extras, corporate eligibility and cancellation/operating terms require approval.
- Real gateway selection/integration, verified webhooks/reconciliation/refunds, approved sender configuration and actual email delivery, retention/abuse monitoring and staff/customer UAT remain live-readiness gates.
- This is a single-property test booking engine, not a full Booking.com marketplace. Per-day availability heatmaps, multi-room carts, advanced drag-and-drop pricing/calendar editing and external channel-manager synchronization are not delivered.
- Synthetic HTTP test bookings remain clearly labelled and can be cancelled by staff; no real reservations, payments or emails were made.

## 2026-09-10 — The Suites booking system, Phase 1

### Implementation

- Added the RoomCategory, Room and Reservation data foundation with explicit room, reservation and payment statuses; overlapping-stay availability uses the hotel boundary rule `existing check-in < requested check-out` and `existing check-out > requested check-in`.
- Added 18 inactive, blocked, unassigned placeholder physical-room records. This preserves the confirmed total without inventing the unknown Studio/Executive split, final room numbers or floors.
- Added the two approved public category names, only the features stated in the supplied brief, nullable/configurable capacity and rates, and the four supplied photographs. No stock imagery was generated.
- Added staging-only `/stay`, `/stay/onpoint-studio` and `/stay/onpoint-executive-suite` experiences with booking search, validated dates/guests/company code, server-calculated nights and availability, room galleries, category details and transparent rate-on-request states.
- Added a prominent booking search bar and supplied-photo gallery to `/the-suites-at-midpoint`, plus a staging-only `Book a Stay` navigation item.
- Added secure `/admin/rooms` inventory setup for category activation/rates/capacity and all 18 rooms' category, number, floor, operational status, activation and notes.
- Production-host access to the unfinished `/stay` routes is blocked until the data and release gates below are approved; staging remains protected by its existing noindex controls.

### Testing

- `npm test`: passed on 2026-09-10 — 21 test files and 77 tests passed, including date validation, overlap boundaries, 18-room migration safeguards and existing regressions.
- `npm run build`: passed on 2026-09-10 — Prisma generated successfully and Next.js compiled/type-checked the new search, category and admin inventory routes.

### Commit and push

- Commit `79039a3fa1f7e5e6e061e11d1bc160bf560068b2` (`Build Suites booking Phase 1`) was pushed to `origin/main` on 2026-09-10.

### Merge

- The verified isolated worktree was promoted directly to `main` by fast-forward; no pull-request merge was used.

### Deployment and configuration

- GitHub Actions `Deploy to VPS` run `34474718455` completed successfully on 2026-09-10; its migration step created the booking schema, two category records and 18 blocked/unassigned room records.

### Live production verification

- Staging `/the-suites-at-midpoint`, `/stay`, both category routes and a three-night dated search returned HTTP 200 with `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`.
- The dated search rendered the explicit `Availability is being configured` state because no unapproved room/category allocation was activated.
- Each supplied image asset returned HTTP 200; the live Suites page was visually verified at 1440px with the booking bar, staging-only `Book a Stay` navigation, supplied-photo experience and zero horizontal overflow.
- Production `https://www.mid-point.co.za/stay` returned HTTP 404, confirming the unfinished booking system is not publicly released there.

### Outstanding gates

- Business must supply the exact Studio/Executive room split, final room numbers/floors, confirmed category image mapping, Executive maximum occupancy, rates, taxes/fees, check-in/out times, cancellation terms and any stay restrictions before categories and rooms can be activated.
- Reservation checkout, transactional room assignment, confirmation/email, admin calendar, payments, corporate rates, promo codes, extras and manage-booking are later phases and are not represented as complete.
- No payment gateway has been selected; raw card data must never be stored by Midpoint.

## 2026-09-10 — Responsive shared navigation repair

### Implementation

- Moved the full desktop navigation handover from the 768px breakpoint to 1280px so the logo, two contact pills, six links and enquiry CTA are never forced into tablet-width space.
- Prevented both contact pills from wrapping and protected the logo, desktop groups and mobile-menu control from flex shrinking.
- The shared `Nav` component serves both `mid-point.co.za` and `midpoint.onpointoffices.co.za`, so the correction applies consistently to production and staging.

### Testing

- `npm test`: passed on 2026-09-10 — 19 test files and 74 tests passed, including a new regression test for the navigation breakpoint and no-wrap rules.
- `npm run build`: passed on 2026-09-10 — Next.js compiled and type-checked all application routes successfully.

### Commit and push

- Commit `c695a9a21af99921a91deb5ee2294953d6d5eac9` (`Fix responsive header overflow`) was pushed to `origin/main` on 2026-09-10.

### Merge

- The verified isolated worktree was promoted directly to `main` by fast-forward; no pull-request merge was used.

### Deployment and configuration

- GitHub Actions `Deploy to VPS` run `34470101456` completed successfully on 2026-09-10.

### Live production verification

- Browser verification at the reported 1009px viewport confirmed both staging and production use the compact menu, retain an unwrapped phone label and have no horizontal overflow.
- Browser verification at 1440px confirmed the complete desktop navigation is visible, the menu control is hidden, the phone label remains unwrapped and there is no horizontal overflow.
- Browser verification at 390px confirmed the compact navigation remains active with no horizontal overflow.
- The staging Suites page was also visually inspected at 1009px: the logo and menu remain separated, the hero heading and CTA are unobstructed, and the previously stacked phone pill is absent from the closed header.

### Outstanding gates

- None beyond deployment and live responsive verification for this layout repair.

## 2026-09-10 — Staging copy and The Suites booking-request showcase

### Implementation

- Added the dedicated `/the-suites-at-midpoint` showcase with corporate-stay positioning, feature cards, date/guest capture and explicit request-to-book language.
- Added a rate-limited, honeypot-protected `/api/suites-booking` endpoint that validates stay dates and stores each request in the existing Contacts and Enquiries administration workflow with campaign attribution.
- Added host-specific staging protection for `midpoint.onpointoffices.co.za`: blanket `robots.txt` disallow, `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`, and matching page metadata.
- The staging hostname currently routes to the same application container as production; the new experience is therefore code-isolated by hostname protections but does not yet have a separate container or database.

### Testing

- `npm test`: passed on 2026-09-10 — 18 test files and 73 tests passed, including staging header and robots exclusions.
- `npm run build`: passed on 2026-09-10 — Next.js production build compiled, type-checked and generated the Suites page and booking API.

### Commit and push

- Implementation commit `6554291d03a226b5d8c90ecb962d6b4a3ecf3495` and forwarded-host hardening commit `6cee51bd80ae906f8bf9d66bdd712346af52f06f` were pushed to `origin/main` on 2026-09-10.

### Merge

- The verified isolated worktree was promoted directly to `main` by fast-forward; no pull-request merge was used.

### Deployment and configuration

- GitHub Actions `Deploy to VPS` runs `34463207449` and `34463604332` completed successfully on 2026-09-10. The latter deployed the final reverse-proxy-aware crawler protection.

### Live production verification

- Before this change, both hosts returned HTTP 200 and the staging hostname served the production site, but staging had no `X-Robots-Tag` and its `robots.txt` allowed all crawlers.
- On 2026-09-10, `https://midpoint.onpointoffices.co.za/the-suites-at-midpoint` returned HTTP 200 and rendered the hero, six showcase cards, date/guest fields, consent and request-to-book CTA at desktop width.
- The staging home, Suites page, `robots.txt` and `sitemap.xml` all returned `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`; rendered HTML also contained `noindex` metadata, and staging `robots.txt` returned `User-agent: *` plus `Disallow: /`.
- The booking endpoint rejected an incomplete request with HTTP 400, confirming live server-side validation without creating test customer data.
- `https://www.mid-point.co.za/` remained HTTP 200 with no noindex header or metadata, confirming production indexing was not disabled.

### Outstanding gates

- Automatic availability, live inventory, rate rules, deposits/payments, cancellation terms and instant confirmation are not configured; submissions are booking requests requiring manual confirmation.
- A separate staging container/database and non-production integration configuration remain an infrastructure gate if full environment isolation is required.
- Final accommodation photography, room inventory, guest capacity, rates, operating policy and booking terms require business approval before production release.
- End-to-end submission/UAT with an approved test contact remains open; it was intentionally not performed during live verification to avoid creating customer or CRM data without an approved test identity.

## 2026-09-10 — Rename the accommodation amenity card

### Implementation

- Renamed the `/amenities` feature-card heading from `Corporate accommodation` to `The Suites at Midpoint`.
- Preserved the card description, image, ordering, status caveats and all broader amenities/SEO copy.
- Updated both the canonical seed content and a scoped production data migration.

### Testing

- `npm test`: passed on 2026-09-10 — 18 test files and 71 tests passed, including the scoped amenity-name test.
- `npm run build`: passed on 2026-09-10 — Next.js production build compiled, type-checked and generated all routes successfully.

### Commit and push

- Commit `dccec7d371a6e6f89b38e95af4bbfd7cede24f00` (`Rename accommodation amenity to The Suites at Midpoint`) was pushed to `origin/main` on 2026-09-10.

### Merge

- The verified branch was promoted directly to `main` as a fast-forward (`eaa7dc7..dccec7d`); no pull-request merge was used.

### Deployment and configuration

- GitHub Actions workflow `Deploy to VPS`, run `34451286832`, completed successfully on 2026-09-10.
- The deployment rebuilt the application and migration images and applied migration `20260910120000_rename_midpoint_suites_amenity` to the production amenities pillar.

### Live production verification

- On 2026-09-10, `https://www.mid-point.co.za/amenities` returned HTTP 200 and served deployment `dccec7d371a6`.
- The rendered amenity feature card has an `h3` heading of `The Suites at Midpoint`; its corporate-accommodation description and image remain in place.

### Outstanding gates

- None beyond deployment and live verification for this copy-only rename.

## 2026-09-09 — Replace the WhatsApp destination

### Implementation

- Requested destination: Blend Property Group mobile `+27 60 018 5206` (canonical digits: `27600185206`).
- Replaced the single site-wide WhatsApp setting used by the floating button and all vacancy WhatsApp links.
- Added the same value to the database migration, site-settings fallback, seed update/create path, and admin placeholder.
- Boitumelo's email address and the Midpoint office voice number are separate contact channels and were intentionally not changed.

### Testing

- `npm test`: passed on 2026-09-09 — 17 test files and 70 tests passed, including the canonical WhatsApp source test.
- `npm run build`: passed on 2026-09-09 — Next.js production build compiled, type-checked and generated all routes successfully.

### Commit and push

- Commit `bbc0c5a58d9270a99e2ac317ea793aca6f987537` (`Update Midpoint WhatsApp number`) was pushed to `origin/main` on 2026-09-09.

### Merge

- The verified branch was promoted directly to `main` as a fast-forward (`9faca95..bbc0c5a`); no pull-request merge was used.

### Deployment and configuration

- GitHub Actions workflow `Deploy to VPS`, run `34313228321`, completed successfully on 2026-09-09.
- The deployment rebuilt the application and migration images and applied migration `20260909120000_update_whatsapp_number`, setting the production `SiteSetting.whatsapp` value to `27600185206`.

### Live production verification

- On 2026-09-09, `https://www.mid-point.co.za/` returned HTTP 200, served deployment `bbc0c5a58d92`, and contained `https://wa.me/27600185206`.
- On 2026-09-09, `https://www.mid-point.co.za/vacancies` returned HTTP 200, served deployment `bbc0c5a58d92`, and contained vacancy links to `https://wa.me/27600185206`.
- No other `wa.me` destination numbers were present in either verified production response.

### Outstanding gates

- No UAT or external messaging-provider delivery test has yet been completed.
