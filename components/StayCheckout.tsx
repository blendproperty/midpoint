"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import StaySummary from "@/components/StaySummary";
import { money, type StayQuote, type StayConfig } from "@/lib/stay-pricing";
import { trackAnalyticsEvent } from "@/lib/analytics";
import { getStoredAttribution } from "@/lib/attribution";
type Props = {
  categoryId: string;
  title: string;
  initial: StayQuote;
  extras: StayConfig["extras"];
};
export default function StayCheckout({
  categoryId,
  title,
  initial,
  extras,
}: Props) {
  const router = useRouter(),
    [quote, setQuote] = useState(initial),
    [selected, setSelected] = useState<string[]>([]),
    [business, setBusiness] = useState(false),
    [other, setOther] = useState(false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [quoting, setQuoting] = useState(false),
    key = useRef(""),
    version = useRef(0);
  useEffect(() => {
    key.current = crypto.randomUUID();
    trackAnalyticsEvent("begin_checkout", {
      room_category: categoryId,
      nights: initial.nights,
      guests: initial.guests,
      value: initial.totalCents / 100,
      test_mode: true,
    });
  }, [categoryId, initial]);
  async function changeExtra(id: string, checked: boolean) {
    const next = checked ? [...selected, id] : selected.filter((x) => x !== id);
    setSelected(next);
    setQuoting(true);
    setError("");
    const v = ++version.current;
    try {
      const r = await fetch("/api/stay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "quote",
          categoryId,
          ...initial,
          extras: next,
        }),
      });
      const b = await r.json();
      if (!r.ok) throw new Error(b.error);
      if (v === version.current) setQuote(b.quote);
      trackAnalyticsEvent("add_extra", { extra_id: id, test_mode: true });
    } catch (e) {
      setError((e as Error).message);
    } finally {
      if (v === version.current) setQuoting(false);
    }
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const fields = Object.fromEntries(
      new FormData(event.currentTarget).entries(),
    );
    try {
      const r = await fetch("/api/stay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...fields,
          attribution: getStoredAttribution(),
          action: "reserve",
          categoryId,
          checkIn: initial.checkIn,
          checkOut: initial.checkOut,
          guests: initial.guests,
          code: initial.code,
          extras: selected,
          consent: fields.consent === "on",
          idempotencyKey: key.current,
        }),
      });
      const b = await r.json();
      if (!r.ok) throw new Error(b.error);
      sessionStorage.setItem("suite-access-" + b.reference, b.accessCode);
      router.push("/stay/payment?reference=" + encodeURIComponent(b.reference));
    } catch (e) {
      setError((e as Error).message);
      setBusy(false);
    }
  }
  const input = (
    name: string,
    label: string,
    type = "text",
    required = true,
  ) => (
    <label className="stay-label" key={name}>
      {label}
      <input
        className="stay-input"
        name={name}
        type={type}
        required={required}
        maxLength={200}
      />
    </label>
  );
  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <form onSubmit={submit} className="space-y-6">
        <section className="stay-card">
          <p className="stay-eyebrow">Step 1 of 3</p>
          <h2 className="mb-6 mt-2 text-2xl font-semibold">Your details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {input("firstName", "First name")}
            {input("lastName", "Last name")}
            {input("email", "Email", "email")}
            {input("mobile", "Mobile", "tel")}
            {input("country", "Country")}
          </div>
          <label className="mt-5 flex gap-3 text-sm">
            <input
              type="checkbox"
              checked={other}
              onChange={(e) => setOther(e.target.checked)}
            />
            I am booking for someone else
          </label>
          {other && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {input("guestFirstName", "Guest first name")}
              {input("guestLastName", "Guest last name")}
            </div>
          )}
          <label className="mt-5 flex gap-3 text-sm">
            <input
              type="checkbox"
              checked={business}
              onChange={(e) => setBusiness(e.target.checked)}
            />
            Booking for business
          </label>
          {business && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {input("company", "Company")}
              {input("vatNumber", "Company VAT number", "text", false)}
              {input("poNumber", "Purchase order", "text", false)}
              {input("costCentre", "Cost centre", "text", false)}
            </div>
          )}
          <label className="stay-label mt-5">
            Special requests
            <textarea
              name="requests"
              className="stay-input"
              maxLength={2000}
              rows={3}
            />
          </label>
        </section>
        <section className="stay-card">
          <h2 className="text-2xl font-semibold">Make it your stay</h2>
          <p className="mt-2 text-sm text-stone-500">
            Optional test services. Nothing is selected automatically.
          </p>
          {extras
            .filter((e) => e.enabled)
            .map((e) => (
              <label
                key={e.id}
                className="mt-4 flex items-center justify-between gap-4 border-t pt-4"
              >
                <span className="flex gap-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(e.id)}
                    onChange={(ev) => changeExtra(e.id, ev.target.checked)}
                  />
                  {e.name}
                </span>
                <span className="text-sm">
                  {money(Math.round(e.price * 100))}
                  {e.perNight ? " / night" : ""}
                </span>
              </label>
            ))}
        </section>
        <section className="stay-card">
          <label className="flex items-start gap-3 text-sm">
            <input name="consent" type="checkbox" required className="mt-1" />
            <span>
              I accept the displayed test stay and cancellation terms, and
              consent to my details being stored for this test booking. No real
              reservation or charge will be made.
            </span>
          </label>
          {error && (
            <p role="alert" className="mt-4 text-red-700">
              {error}
            </p>
          )}
          <button
            disabled={busy || quoting}
            className="stay-button mt-6 w-full"
          >
            {busy
              ? "Securing your room…"
              : quoting
                ? "Updating total…"
                : "Continue to test payment"}
          </button>
        </section>
      </form>
      <div className="lg:sticky lg:top-28 lg:self-start">
        <StaySummary quote={quote} title={title} />
      </div>
    </div>
  );
}
