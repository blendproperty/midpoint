"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const interests = ["Office space", "Warehouse space", "Serviced offices"];

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [consent, setConsent] = useState(false);
  const [verified, setVerified] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
      form.reset();
      setConsent(false);
      setVerified(false);
    } catch {
      setStatus("error");
    }
  }

  const field =
    "w-full border-0 border-b border-white/20 bg-transparent px-0 py-3 text-sm text-white placeholder-white/50 focus:border-midpoint-cyan focus:outline-none";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <input name="firstName" required placeholder="First Name" className={field} />
        <input name="lastName" required placeholder="Last Name" className={field} />
        <input name="phone" type="tel" placeholder="Phone Number" className={field} />
        <input name="email" type="email" required placeholder="Email" className={field} />
      </div>

      <select name="interest" defaultValue="" className={field}>
        <option value="" disabled className="text-midpoint-dark">
          I&apos;m interested in:
        </option>
        {interests.map((o) => (
          <option key={o} value={o} className="text-midpoint-dark">
            {o}
          </option>
        ))}
      </select>

      <textarea name="message" rows={4} placeholder="Message" className={field} />

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

      {/* Visual placeholder to match the live site's spam-check step. Wire up
          a real Google reCAPTCHA (NEXT_PUBLIC_RECAPTCHA_SITE_KEY) before launch. */}
      <label className="flex w-fit items-center gap-3 rounded border border-midpoint-grey-100 bg-white px-4 py-3 text-sm text-midpoint-dark">
        <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} />
        I&apos;m not a robot
      </label>

      <button
        disabled={status === "sending" || !consent}
        className="rounded-full bg-midpoint-cyan px-8 py-3 text-sm font-medium text-midpoint-dark transition hover:opacity-90 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Submit"}
      </button>

      {status === "sent" && (
        <p role="status" className="text-sm font-medium text-midpoint-cyan">
          Thanks — your enquiry is on its way to the leasing team.
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
