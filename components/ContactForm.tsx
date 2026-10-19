"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { trackSavedLeasingEnquiry } from "@/lib/analytics";
import { getStoredAttribution } from "@/lib/attribution";
import { site } from "@/lib/site";

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
    grecaptcha?: {
      ready: (callback: () => void) => void;
      getResponse: (id?: number) => string;
      reset: (id?: number) => void;
      render: (
        container: HTMLElement,
        params: { sitekey: string; callback?: () => void; "expired-callback"?: () => void; "error-callback"?: () => void }
      ) => number;
    };
  }
}

type Props = {
  siteKey?: string;
  contactEmail?: string;
  successMessage?: string;
  // Set when someone arrives here via a specific VacancyCard's "Enquire"
  // button (e.g. /contact-us?space=1+Kingfisher+Avenue&interest=Warehouse+space)
  // so the enquiry captures which space they actually clicked on instead of
  // landing as a blank, context-free form.
  defaultInterest?: string;
  spaceName?: string;
};

export default function ContactForm({ siteKey, contactEmail = site.email, successMessage, defaultInterest, spaceName }: Props = {}) {
  const [status, setStatus] = useState<Status>("idle");
  const [consent, setConsent] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);
  const [captchaRequested, setCaptchaRequested] = useState(false);
  const [captchaReady, setCaptchaReady] = useState(false);
  const [captchaLoadError, setCaptchaLoadError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("We couldn’t confirm receipt. Please contact the leasing team before retrying.");
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | undefined>(undefined);

  const recaptchaSiteKey = siteKey || DEFAULT_RECAPTCHA_SITE_KEY;
  const selectedInterest = defaultInterest && interests.includes(defaultInterest) ? defaultInterest : "";
  const initialMessage = spaceName ? `I'm interested in the space at ${spaceName}.\n\n` : "";

  function renderCaptcha() {
    const captcha = window.grecaptcha;
    if (!captcha) { setCaptchaLoadError(true); return; }
    // Provider readiness can take longer than six seconds on a mobile connection.
    captcha.ready(() => {
      const element = recaptchaRef.current;
      if (!element) return;
      try {
        if (element.childElementCount === 0) {
          widgetIdRef.current = captcha.render(element, {
            sitekey: recaptchaSiteKey,
            callback: () => { setCaptchaError(false); setCaptchaLoadError(false); },
            "expired-callback": () => setCaptchaError(true),
            "error-callback": () => setCaptchaLoadError(true),
          });
        }
        setCaptchaReady(true);
        setCaptchaLoadError(false);
      } catch {
        setCaptchaLoadError(true);
      }
    });
  }

  // The confirmation/error message renders below the Submit button, which on
  // a long form (or a small viewport) can sit below the fold — someone could
  // submit, see nothing happen, and not realise it actually went through
  // until they scrolled down. Bringing it into view removes that ambiguity.
  useEffect(() => {
    if ((status === "sent" || status === "error") && feedbackRef.current) {
      feedbackRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [status]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const captchaResponse = widgetIdRef.current === undefined ? "" : window.grecaptcha?.getResponse(widgetIdRef.current);
    if (!captchaResponse) {
      setCaptchaError(true);
      return;
    }
    setCaptchaError(false);
    setStatus("sending");
    setErrorMessage("We couldn’t confirm receipt. Please contact the leasing team before retrying.");

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const attribution = getStoredAttribution();
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          sourcePath: `${window.location.pathname}${window.location.search}`,
          attribution,
          "g-recaptcha-response": captchaResponse
        })
      });
      const result = await res.json() as { ok?: boolean; enquiryId?: string; crmDelivered?: boolean; error?: string };
      if (res.status === 400 && result.error === "reCAPTCHA verification failed. Please try again.") {
        window.grecaptcha?.reset(widgetIdRef.current);
        setCaptchaError(true);
        setStatus("idle");
        return;
      }
      if (!res.ok) {
        setErrorMessage(res.status === 429
          ? "Too many attempts. Please wait a few minutes or contact the leasing team."
          : res.status === 400 ? "Please check your name and email before submitting."
          : "We couldn’t confirm receipt. Please contact the leasing team before retrying.");
        throw new Error("failed");
      }
      if (!result.ok || !result.enquiryId) throw new Error("enquiry was not saved");
      trackSavedLeasingEnquiry(result, data.interest, attribution);
      setStatus("sent");
      form.reset();
      setConsent(false);
      window.grecaptcha?.reset(widgetIdRef.current);
    } catch {
      setStatus("error");
    }
  }

  const field =
    "dark-field w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-white/50 transition-colors duration-150 focus:border-midpoint-cyan focus:bg-white/10 focus:outline-none focus:ring-1 focus:ring-midpoint-cyan";

  return (
    <form
      id="Contact"
      onSubmit={handleSubmit}
      onFocus={() => setCaptchaRequested(true)}
      aria-busy={status === "sending"}
      className="scroll-mt-24 space-y-6"
    >
      {captchaRequested ? (
        <Script key={recaptchaSiteKey} src="https://www.google.com/recaptcha/api.js?render=explicit" strategy="afterInteractive" onReady={renderCaptcha} onError={() => setCaptchaLoadError(true)} />
      ) : null}

      {spaceName && (
        <p className="rounded-lg border border-midpoint-cyan/30 bg-midpoint-cyan/10 px-4 py-3 text-sm text-midpoint-cyan">
          Enquiring about: <span className="font-semibold">{spaceName}</span>
        </p>
      )}

      <p className="text-sm text-white/80">All fields are required.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm"><span>First name</span><input name="firstName" required autoComplete="given-name" placeholder="First Name" className={field} /></label>
        <label className="flex flex-col gap-2 text-sm"><span>Last name</span><input name="lastName" required autoComplete="family-name" placeholder="Last Name" className={field} /></label>
        <label className="flex flex-col gap-2 text-sm"><span>Phone number</span><input name="phone" type="tel" required autoComplete="tel" placeholder="Phone Number" className={field} /></label>
        <label className="flex flex-col gap-2 text-sm"><span>Email</span><input name="email" type="email" required autoComplete="email" placeholder="Email" className={field} /></label>
      </div>

      <label className="block space-y-2 text-sm"><span>Space type</span>
      <select name="interest" required defaultValue={selectedInterest} className={field}>
        <option value="" disabled className="text-midpoint-dark">
          I&apos;m interested in:
        </option>
        {interests.map((o) => (
          <option key={o} value={o} className="text-midpoint-dark">
            {o}
          </option>
        ))}
      </select>
      </label>

      <label className="block space-y-2 text-sm"><span>Message</span>
      <textarea
        name="message"
        required
        rows={4}
        placeholder="Message"
        defaultValue={initialMessage}
        className={field}
      />
      </label>

      <label className="flex items-start gap-2 text-sm text-midpoint-grey-400">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1"
        />
        <span>I consent to Midpoint&apos;s <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline">privacy policy</a>.</span>
      </label>

      <div ref={recaptchaRef} className={captchaRequested ? "min-h-[78px]" : undefined} />
      {captchaRequested && !captchaReady && !captchaLoadError && <p role="status" className="text-sm text-white/80">Loading security check…</p>}
      {captchaLoadError && <p role="alert" className="text-sm text-white">The security check couldn’t load. Your details are still here; <a href={`mailto:${contactEmail}`} className="underline">email the leasing team</a>.</p>}
      {captchaError && (
        <p role="alert" className="text-sm font-medium text-red-400">
          Please complete the security check again before submitting.
        </p>
      )}

      <button
        disabled={status === "sending"}
        className="rounded-full bg-midpoint-cyan px-8 py-3 text-sm font-medium text-midpoint-dark transition-transform duration-100 ease-out hover:opacity-90 active:scale-[0.97] disabled:opacity-60 disabled:active:scale-100"
      >
        {status === "sending" ? "Sending…" : "Submit"}
      </button>

      {/* Bigger, boxed, and scrolled into view on submit (see the useEffect
          above) instead of a small line of text that could land below the
          fold and go unnoticed after clicking Submit. */}
      {status === "sent" && (
        <div
          ref={feedbackRef}
          key="sent"
          role="status"
          className="flex animate-fade-in-up items-center gap-3 rounded-xl border border-midpoint-cyan bg-midpoint-cyan/15 px-5 py-4 text-base font-semibold text-midpoint-cyan"
        >
          <CheckCircle2 size={22} className="shrink-0" aria-hidden="true" />
          {successMessage || DEFAULT_SUCCESS_MESSAGE}
        </div>
      )}
      {status === "error" && (
        <div
          ref={feedbackRef}
          key="error"
          role="alert"
          className="flex animate-fade-in-up items-center gap-3 rounded-xl border border-red-400 bg-red-500/10 px-5 py-4 text-base font-semibold text-red-400"
        >
          <AlertCircle size={22} className="shrink-0" aria-hidden="true" />
          <span>{errorMessage} <a href={`mailto:${contactEmail}`} className="underline">Email the leasing team</a>.</span>
        </div>
      )}
    </form>
  );
}
