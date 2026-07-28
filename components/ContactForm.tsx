"use client";

import { useRef, useState } from "react";
import Script from "next/script";

type Status = "idle" | "sending" | "sent" | "error";

const interests = ["Office space", "Warehouse space", "Serviced offices"];

// Default kept as a fallback for callers that don't pass siteKey, but the
// real value now comes from Site Settings (/admin/settings) so it can be
// changed without a code deploy if Google's reCAPTCHA admin console requires
// a different key/domain registration.
const DEFAULT_RECAPTCHA_SITE_KEY = "6LcKnCYtAAAAAEW_f1jLM5pQgwvr7GRodfsOyfbY";
const DEFAULT_SUCCESS_MESSAGE = "Thanks — your enquiry is on its way to the leasing team.";

declare global {
  interface Window {
    grecaptcha?: { getResponse: (id?: number) => string; reset: (id?: number) => void };
  }
}

type Props = { siteKey?: string; successMessage?: string };

export default function ContactForm({ siteKey, successMessage }: Props = {}) {
  const [status, setStatus] = useState<Status>("idle");
  const [consent, setConsent] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);
  const recaptchaRef = useRef<HTMLDivElement>(null);

  const recaptchaSiteKey = siteKey || DEFAULT_RECAPTCHA_SITE_KEY;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const captchaResponse = window.grecaptcha?.getResponse();
    if (!captchaResponse) {
      setCaptchaError(true);
      return;
    }
    setCaptchaError(false);
    setStatus("sending");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          sourcePath: window.location.pathname,
          "g-recaptcha-response": captchaResponse
        })
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
      form.reset();
      setConsent(false);
      window.grecaptcha?.reset();
    } catch {
      setStatus("error");
    }
  }

  const field =
    "w-full border-0 border-b border-white/20 bg-transparent px-0 py-3 text-sm text-white placeholder-white/50 focus:border-midpoint-cyan focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Script src="https://www.google.com/recaptcha/api.js" strategy="lazyOnload" />

      <div className="grid gap-6 sm:grid-cols-2">
        <input name="firstName" required placeholder="First Name" className={field} />
        <input name="lastName" required placeholder="Last Name" className={field} />
        <input name="phone" type="tel" required placeholder="Phone Number" className={field} />
        <input name="email" type="email" required placeholder="Email" className={field} />
      </div>

      <select name="interest" required defaultValue="" className={field}>
        <option value="" disabled className="text-midpoint-dark">
          I&apos;m interested in:
        </option>
        {interests.map((o) => (
          <option key={o} value={o} className="text-midpoint-dark">
            {o}
          </option>
        ))}
      </select>

      <textarea name="message" required rows={4} placeholder="Message" className={field} />

      <label className="flex items-start gap-2 text-sm text-midpoint-grey-400">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1"
        />
        I consent to Midpoint&apos;s privacy policy.
      </label>

      <div ref={recaptchaRef} className="g-recaptcha" data-sitekey={recaptchaSiteKey} />
      {captchaError && (
        <p role="alert" className="text-sm font-medium text-red-400">
          Please confirm you&apos;re not a robot before submitting.
        </p>
      )}

      <button
        disabled={status === "sending" || !consent}
        className="rounded-full bg-midpoint-cyan px-8 py-3 text-sm font-medium text-midpoint-dark transition hover:opacity-90 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Submit"}
      </button>

      {status === "sent" && (
        <p role="status" className="text-sm font-medium text-midpoint-cyan">
          {successMessage || DEFAULT_SUCCESS_MESSAGE}
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="text-sm font-medium text-red-400">
          The message didn&apos;t send. Try again, or email us directly.
        </p>
      )}
    </form>
  );
}
