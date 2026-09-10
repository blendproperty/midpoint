"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { getStoredAttribution } from "@/lib/attribution";
import { trackAnalyticsEvent } from "@/lib/analytics";

export default function SuitesBookingForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const field = "w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/55 focus:border-midpoint-cyan focus:outline-none";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const attribution = getStoredAttribution();
    try {
      const response = await fetch("/api/suites-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, attribution, sourcePath: window.location.pathname + window.location.search }),
      });
      const result = await response.json() as { ok?: boolean; enquiryId?: string };
      if (!response.ok || !result.ok) throw new Error("not saved");
      trackAnalyticsEvent("generate_lead", { form_name: "suites_booking_request", lead_id: result.enquiryId });
      form.reset();
      setStatus("sent");
    } catch { setStatus("error"); }
  }

  if (status === "sent") return (
    <div className="rounded-2xl border border-midpoint-cyan/40 bg-midpoint-cyan/10 p-8 text-white" role="status">
      <CheckCircle2 className="mb-4 h-9 w-9 text-midpoint-cyan" />
      <h3 className="text-2xl font-semibold">Request received</h3>
      <p className="mt-2 text-white/75">Our team will confirm availability, rates and the next steps with you. This is not yet a confirmed reservation.</p>
    </div>
  );

  return <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
    <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
    <input name="firstName" required placeholder="First name" className={field} />
    <input name="lastName" required placeholder="Last name" className={field} />
    <input name="email" type="email" required placeholder="Email address" className={field} />
    <input name="phone" type="tel" required placeholder="Mobile number" className={field} />
    <label className="text-sm text-white/70">Check-in<input name="checkIn" type="date" required min={new Date().toISOString().slice(0, 10)} className={`${field} mt-1`} /></label>
    <label className="text-sm text-white/70">Check-out<input name="checkOut" type="date" required min={new Date().toISOString().slice(0, 10)} className={`${field} mt-1`} /></label>
    <select name="guests" required defaultValue="" className={field}><option value="" disabled className="text-slate-900">Number of guests</option>{[1,2,3,4].map(n => <option key={n} className="text-slate-900" value={n}>{n} guest{n > 1 ? "s" : ""}</option>)}</select>
    <input name="company" placeholder="Company (optional)" className={field} />
    <textarea name="message" rows={4} placeholder="Tell us about your stay or any special requirements" className={`${field} sm:col-span-2`} />
    <label className="flex items-start gap-2 text-sm text-white/70 sm:col-span-2"><input type="checkbox" name="consent" required className="mt-1" />I consent to Midpoint using these details to respond to my accommodation request.</label>
    <button disabled={status === "sending"} className="rounded-full bg-midpoint-cyan px-7 py-3 font-semibold text-midpoint-dark sm:col-span-2 sm:justify-self-start">{status === "sending" ? "Sending…" : "Request to book"}</button>
    {status === "error" && <p role="alert" className="text-sm text-red-300 sm:col-span-2">We could not save your request. Please try again or use the WhatsApp button.</p>}
  </form>;
}
