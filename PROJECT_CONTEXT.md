# Midpoint Project Context

This is the canonical delivery record for production-impacting Midpoint work. A task is complete only when each applicable stage below has evidence; unresolved gates remain explicit.

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

- Pending at time of initial implementation.

### Merge

- Pending at time of initial implementation.

### Deployment and configuration

- Pending database migration and production deployment.

### Live production verification

- Pending confirmation that the floating button and vacancy WhatsApp links resolve to `https://wa.me/27600185206`.

### Outstanding gates

- No UAT or external messaging-provider delivery test has yet been completed.
