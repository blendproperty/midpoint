"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, ChevronDown } from "lucide-react";
import { calculateRentalBudget } from "@/lib/space-calculator";
import { indicativeMonthlyRental } from "@/lib/leasing-comparison";
import { vacancyDetailHref, vacancyLabel, type VacancyListing } from "@/lib/vacancy-shared";

const emptyBudget = { area: "", rate: "", parking: "", operating: "", utilities: "", connectivity: "" };
const fields = [
  { key: "area", label: "Floor area (m²)", min: 0.01 },
  { key: "rate", label: "Asking rate (R / m² / month)", min: 0.01 },
  { key: "parking", label: "Parking (R / month)", min: 0 },
  { key: "operating", label: "Other property charges (R / month)", min: 0 },
  { key: "utilities", label: "Utilities (R / month)", min: 0 },
  { key: "connectivity", label: "Connectivity (R / month)", min: 0 },
] as const;
const money = (value: number) => `R${value.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function RentalBudgetCalculator({ listings, plannedArea }: { listings: VacancyListing[]; plannedArea?: number }) {
  const [values, setValues] = useState({ ...emptyBudget, area: plannedArea === undefined ? "" : String(plannedArea) });
  const [selectedId, setSelectedId] = useState("");
  const eligible = listings.filter(listing => indicativeMonthlyRental(listing) !== null);
  const selected = eligible.find(listing => listing.id === selectedId);
  const budget = calculateRentalBudget(Number(values.area), Number(values.rate), [values.parking, values.operating, values.utilities, values.connectivity].map(value => value === "" ? null : Number(value)));

  return (
    <details id="rental-budget" className="group mt-6 scroll-mt-40 rounded-card border border-midpoint-dark/15 bg-white p-5 md:p-6">
      <summary className="flex cursor-pointer items-center gap-3 font-semibold text-midpoint-dark"><Calculator aria-hidden="true" className="h-5 w-5 shrink-0" /><h2 className="text-lg">Monthly rental budget calculator</h2><ChevronDown aria-hidden="true" className="ml-auto h-5 w-5 shrink-0 transition-transform group-open:rotate-180" /></summary>
      <p className="mt-4 max-w-3xl text-sm leading-6 text-midpoint-grey-400">Estimate base rent and add the monthly charges you know. Start from a published listing or enter your own figures. Amounts are in South African rand. VAT is not calculated; confirm the VAT basis, availability and full quotation with leasing.</p>
      <label className="mt-5 block max-w-2xl text-sm font-semibold text-midpoint-dark">Start from a listing (optional)
        <select value={selectedId} onChange={event => {
          const listing = eligible.find(item => item.id === event.target.value);
          setSelectedId(event.target.value);
          setValues(current => ({ ...current, area: listing ? String(listing.sizeSqm) : "", rate: listing ? String(listing.ratePerSqm) : "" }));
        }} className="mt-2 w-full min-w-0 rounded-xl border border-midpoint-dark/15 bg-white p-3 font-normal">
          <option value="">Enter my own area and rate</option>
          {eligible.map(listing => <option key={listing.id} value={listing.id}>{vacancyLabel(listing)}</option>)}
        </select>
      </label>
      {selected && <p className="mt-2 text-sm text-midpoint-grey-400">Starting figures come from the <Link href={vacancyDetailHref(selected)} className="text-midpoint-dark underline">published listing</Link>. Additional charges below are your inputs. Confirm current terms with leasing.</p>}
      <p className="mt-5 text-sm text-midpoint-grey-400">Leave unknown charges blank. Enter zero only when you have confirmed there is no separate charge. Use the same VAT basis for every input and add only costs not already included in the asking rate.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map(({ key, label, min }) => <label key={key} className="block min-w-0 text-sm font-semibold text-midpoint-dark">{label}
          <input type="number" inputMode="decimal" min={min} step="0.01" value={values[key]} aria-invalid={values[key] !== "" && (!Number.isFinite(Number(values[key])) || Number(values[key]) < min)} placeholder={min === 0 ? "To confirm" : undefined} onChange={event => {
            setValues(current => ({ ...current, [key]: event.target.value }));
            if (key === "area" || key === "rate") setSelectedId("");
          }} className="mt-2 w-full rounded-xl border border-midpoint-dark/15 p-3 font-normal aria-[invalid=true]:border-red-600" />
        </label>)}
      </div>
      <div role="status" aria-label="Rental budget estimate" aria-live="polite" className="mt-6 rounded-xl bg-midpoint-dark p-5 text-white">
        <p className="text-sm">Indicative base rent / month: <strong>{budget.baseRent === null ? "Enter a valid area and rate" : money(budget.baseRent)}</strong></p>
        <p className="mt-3 text-lg">Known monthly subtotal (VAT not calculated): <strong>{budget.subtotal === null ? "Not calculated" : money(budget.subtotal)}</strong></p>
        <p className="mt-2 text-sm text-white/80">{budget.unconfirmedCharges ? `${budget.unconfirmedCharges} monthly charge${budget.unconfirmedCharges === 1 ? "" : "s"} still to confirm. This is a partial budget.` : "Includes the monthly charges you entered; this is an estimate, not a quotation."}</p>
      </div>
      <p className="mt-4 text-sm leading-6 text-midpoint-grey-400">Deposits, fit-out, relocation and other once-off costs are excluded.</p>
      <div className="mt-4 flex flex-wrap items-center gap-5 text-sm font-semibold text-midpoint-dark">
        <Link href="/contact-us#Contact" className="underline">Confirm a full quote with leasing</Link>
        <button type="button" onClick={() => { setValues(emptyBudget); setSelectedId(""); }} className="underline">Clear budget</button>
      </div>
    </details>
  );
}
