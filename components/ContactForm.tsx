"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

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
    } catch {
      setStatus("error");
    }
  }

  const input =
    "w-full rounded-xl border border-midpoint-grey-100 bg-white px-4 py-3 text-sm";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" required placeholder="Full name" className={input} />
        <input name="company" placeholder="Company" className={input} />
        <input name="email" type="email" required placeholder="Email address" className={input} />
        <input name="phone" type="tel" placeholder="Phone number" className={input} />
      </div>
      <fieldset className="text-sm">
        <legend className="mb-2 font-medium">I&apos;m interested in:</legend>
        <div className="flex flex-wrap gap-4">
          {["Office space", "Warehouse space", "Serviced offices"].map((o) => (
            <label key={o} className="flex items-center gap-2">
              <input type="checkbox" name="interest" value={o} /> {o}
            </label>
          ))}
        </div>
      </fieldset>
      <textarea name="message" rows={4} placeholder="Tell us about your requirements" className={input} />
      <label className="flex items-start gap-2 text-sm text-midpoint-grey-400">
        <input type="checkbox" name="consent" required className="mt-1" />
        I consent to Midpoint&apos;s privacy policy.
      </label>
      <button
        disabled={status === "sending"}
        className="rounded-full bg-midpoint-dark px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
      {status === "sent" && (
        <p role="status" className="text-sm font-medium text-green-700">
          Thanks — your enquiry is on its way to the leasing team.
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="text-sm font-medium text-red-700">
          The message didn&apos;t send. Try again, or email us directly.
        </p>
      )}
    </form>
  );
}
