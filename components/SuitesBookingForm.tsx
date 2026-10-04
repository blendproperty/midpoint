"use client";

import { useId, useState } from "react";
import EnquiryField from "@/components/EnquiryField";
import { CheckCircle2 } from "lucide-react";
import { getStoredAttribution } from "@/lib/attribution";
import { trackAnalyticsEvent } from "@/lib/analytics";

export default function SuitesBookingForm() {
  const id = useId();
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const field = "dark-field enquiry-field w-full rounded-xl border border-white/40 bg-white/10 px-4 py-3 text-white placeholder:text-white/70 focus:border-midpoint-cyan focus:outline-none focus:ring-2 focus:ring-midpoint-cyan";

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

  return <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
    <p className="text-sm text-white/80 sm:col-span-2">Tell us about a future stay. Required fields are marked; this enquiry does not reserve a room.</p>
    <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
    <EnquiryField id={`${id}-firstName`} label="First name" required><input id={`${id}-firstName`} name="firstName" required autoComplete="given-name" className={field} /></EnquiryField>
    <EnquiryField id={`${id}-lastName`} label="Last name" required><input id={`${id}-lastName`} name="lastName" required autoComplete="family-name" className={field} /></EnquiryField>
    <EnquiryField id={`${id}-email`} label="Email address" required><input id={`${id}-email`} name="email" type="email" required autoComplete="email" className={field} /></EnquiryField>
    <EnquiryField id={`${id}-phone`} label="Mobile number" required><input id={`${id}-phone`} name="phone" type="tel" required autoComplete="tel" className={field} /></EnquiryField>
    <EnquiryField id={`${id}-checkIn`} label="Preferred arrival" required><input id={`${id}-checkIn`} name="checkIn" type="date" required min={new Date().toISOString().slice(0, 10)} className={field} /></EnquiryField>
    <EnquiryField id={`${id}-checkOut`} label="Preferred departure" required><input id={`${id}-checkOut`} name="checkOut" type="date" required min={new Date().toISOString().slice(0, 10)} className={field} /></EnquiryField>
    <EnquiryField id={`${id}-guests`} label="Number of guests" required><select id={`${id}-guests`} name="guests" required defaultValue="" className={field}><option value="" disabled className="text-slate-900">Choose guest count</option>{[1,2,3,4].map(n => <option key={n} className="text-slate-900" value={n}>{n} guest{n > 1 ? "s" : ""}</option>)}</select></EnquiryField>
    <EnquiryField id={`${id}-company`} label="Company"><input id={`${id}-company`} name="company" autoComplete="organization" className={field} /></EnquiryField>
    <EnquiryField id={`${id}-message`} label="Stay requirements" className="sm:col-span-2"><textarea id={`${id}-message`} name="message" rows={4} placeholder="Tell us about your stay or any special requirements" className={field} /></EnquiryField>
    <label className="flex items-start gap-3 text-sm text-white/80 sm:col-span-2"><input type="checkbox" name="consent" required className="enquiry-field mt-1 h-4 w-4 shrink-0 accent-midpoint-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-midpoint-cyan" />I consent to Midpoint using these details to respond to my accommodation request (required).</label>
    <button disabled={status === "sending"} className="rounded-full bg-midpoint-cyan px-7 py-3 font-semibold text-midpoint-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-midpoint-cyan sm:col-span-2 sm:justify-self-start">{status === "sending" ? "Sending…" : "Enquire about future stays"}</button>
    {status === "error" && <p role="alert" className="rounded-lg border border-red-300 bg-red-500/10 p-3 text-sm text-red-200 sm:col-span-2">We could not save your request. Please try again or use the WhatsApp button.</p>}
  </form>;
}
