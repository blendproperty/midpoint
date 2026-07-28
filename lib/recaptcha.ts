const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

// Verifies the token the browser widget produced (grecaptcha.getResponse())
// against Google's siteverify endpoint using the SECRET key (never expose
// this one client-side — it's the counterpart to NEXT_PUBLIC_RECAPTCHA_SITE_KEY
// / the recaptchaSiteKey field in Site Settings, which is the public key).
//
// Fails OPEN (returns true) if RECAPTCHA_SECRET_KEY isn't configured yet, or
// if Google's endpoint is briefly unreachable — a missed spam filter during
// a rare outage is preferable to silently losing every real enquiry. Once
// the secret is set, a genuinely failed/missing token is rejected.
export async function verifyRecaptcha(
  token: string | undefined | null,
  remoteIp?: string
): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.error("RECAPTCHA_SECRET_KEY is not set — skipping server-side verification");
    return true;
  }
  if (!token) return false;

  try {
    const params = new URLSearchParams({ secret, response: token });
    if (remoteIp) params.set("remoteip", remoteIp);

    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("reCAPTCHA verification request failed", err);
    return true;
  }
}
