import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
async function run() {
  const base = process.env.BOOKING_TEST_BASE || "http://localhost:3107";
  assert(
    ["http://localhost:3107", "https://midpoint.onpointoffices.co.za"].includes(
      base,
    ),
  );
  let cookie = "";
  async function post(body: unknown) {
    const r = await fetch(base + "/api/stay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: base,
        ...(cookie ? { Cookie: cookie } : {}),
      },
      body: JSON.stringify(body),
    });
    const next = r.headers.get("set-cookie");
    if (next) cookie = next.split(";")[0];
    return { status: r.status, body: await r.json() };
  }
  const start = new Date(Date.now() + 120 * 86400000),
    end = new Date(+start + 2 * 86400000),
    checkIn = start.toISOString().slice(0, 10),
    checkOut = end.toISOString().slice(0, 10);
  const form = {
    action: "reserve",
    categoryId: "onpoint-studio",
    checkIn,
    checkOut,
    guests: 1,
    code: "MIDPOINT10",
    extras: ["late"],
    firstName: "Synthetic",
    lastName: "Booking QA",
    country: "South Africa",
    email: "booking-qa@example.test",
    mobile: "+27000000000",
    consent: true,
    idempotencyKey: randomUUID(),
  };
  const quote = await post({ ...form, action: "quote" });
  assert.equal(quote.status, 200);
  assert.equal(quote.body.quote.test, true);
  const result = await post(form);
  assert.equal(result.status, 200, JSON.stringify(result.body));
  const ref = result.body.reference;
  const retry = await post(form);
  assert.equal(retry.body.reference, ref);
  const denied = await fetch(base + "/api/stay?reference=" + ref);
  assert.equal(denied.status, 404);
  const csrf = await fetch(base + "/api/stay", {
    method: "POST",
    headers: {
      Origin: "https://untrusted.example",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ action: "pay", reference: ref, outcome: "success" }),
  });
  assert.equal(csrf.status, 403);
  const decline = await post({
    action: "pay",
    reference: ref,
    outcome: "declined",
  });
  assert.equal(decline.body.declined, true);
  const paid = await post({
    action: "pay",
    reference: ref,
    outcome: "success",
  });
  assert.equal(paid.body.status, "CONFIRMED");
  await post({ action: "pay", reference: ref, outcome: "success" });
  const detail = await fetch(base + "/api/stay?reference=" + ref, {
    headers: { Cookie: cookie },
  }).then((r) => r.json());
  assert.equal(detail.paymentStatus, "PAID");
  assert.equal(detail.messages.length, 1);
  assert.equal(detail.category, "Studio");
  assert(!detail.messages[0].body.includes("OnPoint"));
  const calendar = await fetch(
    base + "/api/stay/document?reference=" + ref + "&format=ics",
    { headers: { Cookie: cookie } },
  );
  assert.equal(calendar.status, 200);
  assert.match(await calendar.text(), /BEGIN:VCALENDAR/);
  cookie = "";
  const lookup = await post({
    action: "lookup",
    reference: ref,
    email: form.email,
    accessCode: result.body.accessCode,
  });
  assert.equal(lookup.status, 200);
  const cancel = await post({ action: "cancel", reference: ref });
  assert.equal(cancel.status, 200);
  for (const path of [
    "/stay",
    "/stay/studio",
    "/stay/executive-suite",
    "/stay/onpoint-studio",
    "/stay/checkout?room=onpoint-studio&checkIn=" +
      checkIn +
      "&checkOut=" +
      checkOut +
      "&guests=1",
    "/manage-booking",
  ]) {
    const r = await fetch(base + path);
    assert.equal(r.status, 200, path);
  }
  const auth = await fetch(base + "/admin/bookings", { redirect: "manual" });
  assert([302, 303, 307, 308].includes(auth.status));
  console.log(
    JSON.stringify(
      {
        base,
        reference: ref,
        passed: [
          "server quote",
          "hold",
          "idempotency",
          "guest privacy",
          "origin guard",
          "declined payment",
          "confirmed payment",
          "single email preview",
          "calendar download",
          "private-code retrieval",
          "cancellation request",
          "guest routes",
          "admin login protection",
        ],
        note: "Synthetic TEST booking awaits staff cancellation; no real money or email.",
      },
      null,
      2,
    ),
  );
}
run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
