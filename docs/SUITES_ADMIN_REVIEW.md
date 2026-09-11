# The Suites at Midpoint — staff workspace

## Review entry point

Open https://midpoint.onpointoffices.co.za/admin/suites and sign in with an existing authorised Midpoint admin account. Staging /admin now opens the Suites overview; Website management → Website dashboard retains the original content-management dashboard.

This is a test operations system. All reservation values, payment states, refunds and communication previews are simulated. Finance/provider integration and real email delivery are not enabled.

## What to review

1. **Overview:** arrivals and departures for today's South African date, checked-in guests, tonight's availability, next arrivals, cancellation requests, room inspections, unpaid test balances, 14-day occupancy outlook and recent activity. No invented growth percentages or revenue forecasts. The sample paid-booking figure is explicitly not recognised revenue.
2. **Reservations:** server-side search by guest, email, reference or company; status/payment filters; arrivals, departures, in-house, cancellations and unpaid views; 20-record pagination.
3. **New test reservation:** enter category, dates and synthetic guest details. The server prices the stay and atomically holds a real room, then confirms an unpaid staff test reservation. Duplicate submissions with the same request key do not create additional bookings. No email or payment is sent.
4. **Reservation detail:** review guest/stay and attribution, amend dates/room, use valid status actions, save internal notes and inspect communication previews and activity. Cancellation, no-show and simulated settlement ask for confirmation. Existing transaction rules recheck availability and prevent conflicting moves.
5. **Room readiness:** unassessed, dirty, clean and inspected; persistent handover note, actor and timestamp. Checkout marks the room dirty. Readiness is an operational checklist, not a booking block; use maintenance blocks to stop sales.
6. **Calendar:** previous/next 14 days, date selection, linked reservations, separate colours for holds/confirmed/in-house, visible inactive inventory and maintenance blocks.
7. **Guest directory:** guest records grouped by email, searchable and paginated; links to reservation history.
8. **Rooms / rates:** category capacity and base rates, physical room assignments/status, extras, codes and policies. Inventory saves now show inline success/errors. Settings are provisional test values.
9. **Finance & launch:** explicitly pending provider decision, inventory/opening date approval, pricing/policy approval, real guest emails, staff UAT and controlled production activation. No button pretends to connect a payment provider.

## Acceptance checks

- Sign in; review overview on desktop and mobile. Open/close mobile navigation using keyboard as well as touch.
- Create a synthetic reservation, find it by email, add an internal note, amend its room/dates and confirm the refreshed totals.
- Test check-in/out and confirm the room becomes dirty; save its inspection status and refresh to confirm persistence.
- Confirm a conflicting room move/block is rejected. Test a cancellation using a synthetic booking only.
- Verify existing website content-management links remain available.
- Complete authenticated deployed staff UAT before operational use. Automated database integration and local authenticated browser tests are not a substitute for business approval.

## Open boundaries

- No real finance integration, money collection/refund, reconciliation export, invoicing or email delivery.
- No channel-manager synchronisation, multi-property operations, granular hotel-staff roles or advanced financial reporting.
- Final physical room details, pricing, operating policies, data retention and staff training remain approval gates.
- New readiness states start unassessed. No room is declared operational or inspected by the migration.
- Existing shared staging/production infrastructure remains shared. Production guest booking routes remain excluded.
