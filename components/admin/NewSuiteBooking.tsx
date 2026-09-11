"use client";
import { useActionState } from "react";
import { createBooking } from "@/app/admin/(protected)/suites/actions";
export default function NewSuiteBooking({categories,requestKey,today}:{categories:{id:string;name:string}[];requestKey:string;today:string}) {
  const [state,action,pending]=useActionState(createBooking,{error:""});
  return <form action={action}>
    {state.error&&<div role="alert" className="ops-notice amber">{state.error}</div>}
    <input type="hidden" name="idempotencyKey" value={requestKey}/>
    <div className="ops-form-grid">
      <label>Room category<select name="categoryId" required>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <label>Guests<select name="guests"><option value="1">1 guest</option><option value="2">2 guests</option></select></label>
      <label>Check-in<input type="date" name="checkIn" required min={today}/></label>
      <label>Check-out<input type="date" name="checkOut" required min={today}/></label>
      <label>First name<input name="firstName" required maxLength={80} autoComplete="given-name"/></label>
      <label>Last name<input name="lastName" required maxLength={80} autoComplete="family-name"/></label>
      <label>Email address<input name="email" type="email" required autoComplete="email" maxLength={200}/></label>
      <label>Mobile number<input name="mobile" type="tel" required maxLength={30} autoComplete="tel"/></label>
      <label>Country<input name="country" required maxLength={80} autoComplete="country-name" defaultValue="South Africa"/></label>
      <label>Company (optional)<input name="company" maxLength={150}/></label>
      <label>Corporate / promo code (optional)<input name="code" maxLength={30}/></label>
    </div>
    <label className="block text-xs mt-6">Guest requests<textarea name="requests" maxLength={2000} rows={3} className="block w-full mt-2"/></label>
    <label className="flex gap-3 items-start text-xs leading-6 mt-6"><input type="checkbox" name="consent" required className="mt-1"/>I am creating a test reservation with authorised guest details. No real stay or payment is being accepted.</label>
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4"><p className="text-xs text-stone-500 max-w-sm leading-6">The server checks availability and calculates the configured test rate. An available physical room is allocated automatically. The balance remains unpaid.</p><button disabled={pending||!categories.length} className="ops-button">{pending?"Creating reservation…":"Create unpaid test reservation"}</button></div>
  </form>;
}
