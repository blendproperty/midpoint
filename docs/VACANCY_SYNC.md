# Vacancy sync and listing presentation

The public vacancy catalogue uses the existing `Vacancy` table. Blend Listings
remains the source of imported records; editor-created records have no external
ID and are not deprecated by reconciliation. No schema migration is added.

## Schedule

The Compose `vacancy-sync` service uses the same versioned application image as
`web`. It has no public ports, database credentials or provider API key. It calls
the web service internally with the server-only `VACANCY_SYNC_SECRET` header.

- Nightly full authenticated reconciliation: 00:30 Africa/Johannesburg.
- Weekly read-only health verification: Monday 01:00 Africa/Johannesburg.
- Startup checks sync freshness and catches up when unhealthy or older than 26 hours.
- Failed calls retry after five minutes, without overlapping scheduler calls.
- Review failures in `docker compose -f compose.prod.yml logs vacancy-sync` and
  the saved sync result in `/admin/vacancies`. Container logging is implemented;
  external failure notifications are not configured.

The upstream public Midpoint route inspected delegates to `servePublicListings`
with `fixedPortfolio: MIDPOINT`. It is a Bearer-authenticated, paginated full
snapshot. No change-event publisher was identified in the inspected integration;
event-driven delivery remains a future upstream integration. The nightly job
exceeds the requested minimum weekly schedule without needing that publisher.

## Release prerequisites

1. Retain the current application image, commit, Compose configuration and a
   verified database backup. Do not run bootstrap seeding.
2. Confirm `LISTINGS_API_BASE_URL`, an authorised `LISTINGS_API_KEY`, and a strong
   `VACANCY_SYNC_SECRET` exist in the server environment. Never put keys in the
   repository or browser. Existing keys can be reused after verifying scope.
3. Run the normal gated release. It builds web/migrate, applies migrations only,
   starts web and then starts the version-matched scheduler. Both CI workflows
   run the PostgreSQL vacancy rollback/concurrency tests.
4. Verify the exact served release, authenticated health response, scheduler
   logs, source/destination counts and representative unit prices, availability,
   images and detail/enquiry links. Verify a real nightly run and Monday check.
   A successful local preview does not establish these production results.

## Data guards

All pages are fetched and checked for consistent pagination, total count,
duplicate/missing identifiers and invalid numerical fields. A maximum of 20
pages and 15-second request timeout bound upstream fetches. An empty snapshot
cannot hide existing published imported records: it fails for manual review.
That safeguard also means a genuinely empty portfolio requires operator review.

An advisory transaction lock serializes editor and scheduled runs across app
containers. Fetch and all writes occur inside the transaction; a later mapping
or write failure rolls back earlier writes. Records removed from a valid full
snapshot become drafts, never deleted. Results retain explicit configuration
and failure states, with committed-change counters reset on rollback.

## Presentation

Cards show real source fields with up to four feature icons; the detail page
retains the full feature list. Missing prices/areas show "On request" and missing
photos use an explicit placeholder. Rates are monthly per square metre; VAT,
parking and additional charges require leasing-team confirmation. No estimated
total rent, invented amenities or unsupported property specifications are added.

Filters retain the existing server GET fallback, calculator and enquiry tracking.
Responsive cards use one/two/three columns and allow sorting by area/rate.

## Rollback

Stop `vacancy-sync` before rolling back web. Restore the retained application
image and Compose configuration together. No schema rollback is required. A
code rollback alone does not reverse previously imported prices or publication
changes; compare the saved source snapshot/backup and restore only reviewed
vacancy data if necessary. Preserve manual vacancies and unrelated project data.
