import { SignJWT } from "jose";
import assert from "node:assert/strict";
async function run() {
  const base = "http://localhost:3107";
  const token = await new SignJWT({
    email: "local-qa@example.test",
    role: "SUPER_ADMIN",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("local-qa")
    .setExpirationTime("10m")
    .sign(
      new TextEncoder().encode(
        "local-booking-test-secret-not-production-20260910",
      ),
    );
  for (const path of [
    "/admin/bookings",
    "/admin/calendar",
    "/admin/rooms",
    "/admin/rates",
  ]) {
    const r = await fetch(base + path, {
      headers: { Cookie: "midpoint_admin_session=" + token },
      redirect: "manual",
    });
    assert.equal(r.status, 200, path);
    const html = await r.text();
    assert(!html.includes("NEXT_REDIRECT"));
    console.log(path + " authenticated render passed");
  }
}
run().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
