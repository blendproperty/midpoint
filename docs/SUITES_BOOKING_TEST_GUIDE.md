# The Suites at Midpoint — staging booking test guide

Updated 2026-09-10. This is a test booking engine, not an OTA marketplace or a live payment service.

## What to test

1. Open /stay (or use the homepage / Suites search bar). Choose future dates and guests.
2. Compare Studio and Executive full-stay totals; view supplied photographs in the lightbox.
3. Select a category. Enter synthetic guest details, optionally another guest and corporate billing fields.
4. Select optional test extras. The server calculates every nightly rate, discount, inclusive VAT and total.
5. Continue to a 15-minute physical-room hold. Try a declined payment, then successful payment.
6. Confirm the reference, payment status, downloadable confirmation, calendar file and captured email preview.
7. Save the private access code. Retrieve the reservation at /manage-booking with reference, email and code. This additional secret prevents anyone with a guessed reference and known email reading guest details.
8. Request cancellation. Staff use /admin/bookings to review it, cancel and mark the simulated payment refunded.
9. Staff use /admin/calendar for the 18-room grid and maintenance blocks, booking detail for reassignment/date changes and check-in/out, /admin/rooms for inventory/base rates, and /admin/rates for discounts, extras and restrictions.

The existing admin login is required. No new shared password or public bypass is introduced.

## Explicit sample configuration — approval still required

- 18 physical rooms, provisionally assigned 12 Studio / 6 Executive for testing only. This is NOT a representation of the approved real-world split.
- Studio R1,150/night; Executive R1,650/night; both test capacity 2.
- 7–29 nights: 10% discount; 30+ nights: 20%.
- MIDPOINT10: 10%; CORP15: 15% and a simulated corporate account option when company details are entered.
- Best eligible discount wins; no stacking.
- Late checkout R250 and laundry R180 are clearly labelled test services, not confirmed available services.
- Test rates include 15% VAT; cleaning R0; arrival 14:00 / departure 10:00; cancellation notice 48 hours. These are provisional operating/test assumptions, not approved commercial or tax terms.
- Room numbers, category mapping, amenities, images and real capacities require final sign-off.

## Pricing research, accessed 2026-09-10

This is directional market positioning, not a live date-specific rate-shopping quotation. Public offers may be old, conditional or exclude items; exact dates, inclusions, availability and final taxes must be checked before adopting a live tariff.

- Gauteng Tourism's [Zodiac Luxury Suites listing](https://www.gauteng.net/attractions/zodiac-luxury-suites/) lists a Midrand one-bedroom executive suite sleeping two at R1,100/night, and two-bedroom accommodation at R1,600 special / R2,200 normal, with extended-stay discounts. The listing is an older published reference, not verified bookable inventory for our dates.
- [City Lodge Waterfall City](https://www.citylodgehotels.com/our-hotels/city-lodge-hotel-waterfall-city) advertises a 20% weekend best-available-rate promotion; it is a corporate-hotel comparator, not like-for-like serviced accommodation.
- [The Capital offers](https://thecapital.co.za/great-deals/) demonstrate advance-purchase and long-stay discounting, including 25% advance-booking offers under qualifying terms.

Recommendation for testing: use R1,150 Studio and R1,650 Executive, then validate against exact-date comparable bookings, confirmed room sizes, housekeeping frequency, operating costs, occupancy targets and VAT treatment before commercial approval. Do not claim the test tariffs are market-validated final rates.

## Safety and technical boundaries

- Staging is noindex; booking routes and API return 404 on production.
- Staging shares the deployed application and database with production, but all new reservations are explicitly TEST records and only the staging hostname exposes the test checkout.
- No raw card data is collected. Payment outcomes are a simulator, not a real gateway or sandbox provider certification.
- No emails are sent externally. Confirmation/cancellation messages are stored in a test outbox and previewed to the guest and staff.
- Production GA/GTM/Clarity tags are suppressed on staging. First/last source, medium and campaign are captured on the reservation and shown in booking detail. Booking event hooks can be inspected in the browser data layer; production reporting configuration and attribution acceptance testing remain separate.
- Transactions serialize inventory changes. PostgreSQL independently rejects overlapping active reservations for a physical room.
- Expired pending holds are ignored by search and cancelled atomically when another booking/payment/inventory operation runs.
- Admin amendments recalculate totals. A changed total resets the simulated payment balance to unpaid; staff can use “Mark test balance paid” to simulate settlement after an amendment or a corporate account payment.
- Cancellation and refund handling is manual staff review in the test environment; no real refund transaction occurs.
- Guest rate limits are process-local. Distributed abuse controls, retention policy and operational monitoring are live-readiness gates.
- Calendars select dates and report availability through search; per-day availability heatmaps and advanced drag-and-drop rate-calendar editing are not implemented.

## Automated verification

- Unit/business tests: npm test.
- Integration tests run ONLY with BOOKING_INTEGRATION=1 and the dedicated local database at localhost:55439/midpoint_booking_test. tests/stay-platform.test.ts verifies real PostgreSQL concurrency, database overlap exclusion, holds, payments, corporate flow, cancellations and maintenance.
- scripts/stay-http-smoke.ts tests the HTTP/cookie journey with synthetic data. Defaults to localhost:3107; BOOKING_TEST_BASE can explicitly select the approved staging hostname.
- The HTTP test leaves a clearly named synthetic TEST reservation with a cancellation request for staff review; it never contacts an email/payment provider.

## Before real bookings

Approve final inventory/category split, rates, amenities, operating and cancellation terms, VAT/invoicing, extras and corporate account eligibility. Select and provision a payment gateway, implement verified callbacks/reconciliation/refunds, approve sender credentials and real confirmation delivery, establish privacy/retention/support procedures, isolate staging infrastructure where required, and complete staff/customer UAT. Staging noindex must remain enabled; production booking routes remain closed until these gates pass.
