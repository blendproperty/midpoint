"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackAnalyticsEvent } from "@/lib/analytics";

export default function BookingSearch({ compact = false, defaults = {} }: { compact?: boolean; defaults?: { checkIn?: string; checkOut?: string; guests?: string; code?: string } }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const field = "rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-[#74805d] focus:outline-none focus:ring-2 focus:ring-[#74805d]/20";
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget).entries()) as Record<string,string>;
    if (!values.checkIn || !values.checkOut || values.checkOut <= values.checkIn) { setError("Choose a check-out date after check-in."); return; }
    trackAnalyticsEvent("booking_search", { check_in: values.checkIn, check_out: values.checkOut, guests: Number(values.guests) });
    router.push(`/stay?${new URLSearchParams(values).toString()}`);
  }
  return <form onSubmit={submit} className={`rounded-2xl border border-black/10 bg-[#f7f2e8] p-4 shadow-xl ${compact ? "" : "lg:grid lg:grid-cols-[1fr_1fr_.8fr_1fr_auto] lg:items-end lg:gap-3"}`}>
    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">Check in<input name="checkIn" type="date" min={today} required defaultValue={defaults.checkIn} className={`${field} mt-1 w-full`} /></label>
    <label className="mt-3 block text-xs font-semibold uppercase tracking-wider text-slate-600 lg:mt-0">Check out<input name="checkOut" type="date" min={today} required defaultValue={defaults.checkOut} className={`${field} mt-1 w-full`} /></label>
    <label className="mt-3 block text-xs font-semibold uppercase tracking-wider text-slate-600 lg:mt-0">Guests<select name="guests" defaultValue={defaults.guests || "1"} className={`${field} mt-1 w-full`}>{[1,2,3,4].map(n=><option key={n} value={n}>{n} guest{n>1?"s":""}</option>)}</select></label>
    <label className="mt-3 block text-xs font-semibold uppercase tracking-wider text-slate-600 lg:mt-0">Corporate code<input name="code" defaultValue={defaults.code} placeholder="Optional" className={`${field} mt-1 w-full`} /></label>
    <button className="mt-4 w-full rounded-xl bg-[#27362f] px-6 py-3.5 text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#394b42] lg:mt-0">Search availability</button>
    {error && <p role="alert" className="mt-3 text-sm text-red-700 lg:col-span-5">{error}</p>}
  </form>;
}
