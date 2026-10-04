"use client";

import { useEffect, useId, useRef, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { getStoredAttribution } from "@/lib/attribution";

import EnquiryField from "@/components/EnquiryField";

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
      getResponse: (id?: number) => string;
      reset: (id?: number) => void;
      render: (
        container: HTMLElement,
        params: { sitekey: string }
      ) => number;
    };
  }
}

type Props = {
  siteKey?: string;
  successMessage?: string;
  // Set when someone arrives here via a specific VacancyCard's "Enquire"
  // button (e.g. /contact-us?space=1+Kingfisher+Avenue&interest=Warehouse+space)
  // so the enquiry captures which space they actually clicked on instead of
  // landing as a blank, context-free form.
  defaultInterest?: string;
  spaceName?: string;
};

export default function ContactForm({ siteKey, successMessage, defaultInterest, spaceName }: Props = {}) {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [consent, setConsent] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);
  const [captchaRequested, setCaptchaRequested] = useState(false);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | undefined>(undefined);

  const recaptchaSiteKey = siteKey || DEFAULT_RECAPTCHA_SITE_KEY;
  const selectedInterest = defaultInterest && interests.includes(defaultInterest) ? defaultInterest : "";
  const initialMessage = spaceName ? `I'm interested in the space at ${spaceName}.\n\n` : "";

  // Google's reCAPTCHA script only auto-scans the page for ".g-recaptcha"
  // divs ONCE, at the moment the script itself finishes loading. That's fine
  // on a hard page refresh (script loads fresh, form div already exists,
  // scan finds it) — but arriving here via a client-side Link navigation
  // (e.g. clicking "Enquire" on a vacancy card) mounts a brand-new instance
  // of this component/div while the script may have already loaded earlier
  // in the session, so its one-time scan never runs again and the widget
  // silently never appears. Rendering it explicitly here, on every mount,
  // fixes both cases regardless of whether the script was already loaded.
  useEffect(() => {
    if (!captchaRequested) return;
    let cancelled = false;
    let attempts = 0;

    function tryRender() {
      if (cancelled || !recaptchaRef.current) return;
      if (window.grecaptcha?.render) {
        // Guard against rendering twice into the same node (e.g. React
        // Strict Mode's dev double-invoke of effects).
        if (recaptchaRef.current.childElementCount === 0) {
          widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
            sitekey: recaptchaSiteKey,
          });
        }
        return;
      }
      // Script hasn't finished loading yet (first-ever load of the page) —
      // keep checking briefly until it's ready, then give up quietly.
      attempts += 1;
      if (attempts < 40) {
        setTimeout(tryRender, 150);
      }
    }

    tryRender();
    return () => {
      cancelled = true;
    };
  }, [captchaRequested, recaptchaSiteKey]);

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

    const captchaResponse = window.grecaptcha?.getResponse(widgetIdRef.current);
    if (!captchaResponse) {
      setCaptchaError(true);
      return;
    }
    setCaptchaError(false);
    setStatus("sending");

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
      if (!res.ok) throw new Error("failed");
      const result = await res.json() as { ok?: boolean; enquiryId?: string };
      if (!result.ok || !result.enquiryId) throw new Error("enquiry was not saved");
      trackAnalyticsEvent("generate_lead", {
        form_name: "contact_enquiry",
        lead_id: result.enquiryId,
        interest: typeof data.interest === "string" ? data.interest : undefined,
        vacancy_name: spaceName,
        source: attribution?.lastTouch?.source,
        medium: attribution?.lastTouch?.medium,
        campaign: attribution?.lastTouch?.campaign,
      });
      setStatus("sent");
      form.reset();
      setConsent(false);
      window.grecaptcha?.reset(widgetIdRef.current);
    } catch {
      setStatus("error");
    }
  }

  const field = "dark-field enquiry-field w-full rounded-xl border border-white/40 bg-white/5 px-4 py-3.5 text-sm text-white placeholder-white/70 focus:border-midpoint-cyan focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-midpoint-cyan";
  return <form onSubmit={handleSubmit} onFocus={() => setCaptchaRequested(true)} className="space-y-6">
    {captchaRequested && <Script src="https://www.google.com/recaptcha/api.js" strategy="afterInteractive" />}
    {spaceName && <p className="rounded-lg border border-midpoint-cyan/30 bg-midpoint-cyan/10 px-4 py-3 text-sm text-midpoint-cyan">Enquiring about: <span className="font-semibold">{spaceName}</span></p>}
    <p className="text-sm text-white/80">All fields are required. We use your details to respond to your enquiry.</p>
    <div className="grid gap-4 sm:grid-cols-2">
      <EnquiryField id={`${id}-firstName`} label="First name" required><input id={`${id}-firstName`} name="firstName" autoComplete="given-name" required className={field} /></EnquiryField>
      <EnquiryField id={`${id}-lastName`} label="Last name" required><input id={`${id}-lastName`} name="lastName" autoComplete="family-name" required className={field} /></EnquiryField>
      <EnquiryField id={`${id}-phone`} label="Phone number" required><input id={`${id}-phone`} name="phone" type="tel" autoComplete="tel" required className={field} /></EnquiryField>
      <EnquiryField id={`${id}-email`} label="Email address" required><input id={`${id}-email`} name="email" type="email" autoComplete="email" required className={field} /></EnquiryField>
    </div>
    <EnquiryField id={`${id}-interest`} label="Space interest" required>
      <select id={`${id}-interest`} name="interest" required defaultValue={selectedInterest} className={field}>
        <option value="" disabled className="text-midpoint-dark">Choose a space type</option>
        {interests.map(o => <option key={o} value={o} className="text-midpoint-dark">{o}</option>)}
      </select>
    </EnquiryField>
    <EnquiryField id={`${id}-message`} label="Message" required><textarea id={`${id}-message`} name="message" required rows={4} defaultValue={initialMessage} className={field} /></EnquiryField>
    <label className="flex items-start gap-3 text-sm text-white/80">
      <input type="checkbox" required checked={consent} onChange={e => setConsent(e.target.checked)} className="enquiry-field mt-1 h-4 w-4 shrink-0 accent-midpoint-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-midpoint-cyan" />
      <span>I consent to Midpoint&apos;s <Link href="/privacy-policy" className="text-white underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-midpoint-cyan">privacy policy</Link> (required).</span>
    </label>
    <div ref={recaptchaRef} />
    {captchaError && <p role="alert" className="rounded-lg border border-red-300 bg-red-500/10 p-3 text-sm font-medium text-red-200">Please confirm you&apos;re not a robot before submitting.</p>}
    <button disabled={status === "sending" || !consent} className="rounded-full bg-midpoint-cyan px-8 py-3 text-sm font-semibold text-midpoint-dark hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-midpoint-cyan disabled:opacity-60">{status === "sending" ? "Sending…" : "Send enquiry"}</button>
    {status === "sent" && <div ref={feedbackRef} role="status" className="flex items-center gap-3 rounded-xl border border-midpoint-cyan bg-midpoint-cyan/15 px-5 py-4 text-base font-semibold text-midpoint-cyan"><CheckCircle2 size={22} className="shrink-0" aria-hidden="true" />{successMessage || DEFAULT_SUCCESS_MESSAGE}</div>}
    {status === "error" && <div ref={feedbackRef} role="alert" className="flex items-center gap-3 rounded-xl border border-red-300 bg-red-500/10 px-5 py-4 text-base font-semibold text-red-200"><AlertCircle size={22} className="shrink-0" aria-hidden="true" />The message didn&apos;t send. Try again, or email us directly.</div>}
  </form>;
}
