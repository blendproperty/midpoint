"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { trackAnalyticsEvent } from "@/lib/analytics";
import DateRangePicker from "@/components/DateRangePicker";
export default function BookingSearch({
  compact = false,
  defaults = {},
}: {
  compact?: boolean;
  defaults?: {
    checkIn?: string;
    checkOut?: string;
    guests?: string;
    code?: string;
  };
}) {
  const router = useRouter(),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [start, setStart] = useState(defaults.checkIn || ""),
    [end, setEnd] = useState(defaults.checkOut || "");
  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!start || !end || end <= start) {
      setError("Choose check-in and check-out dates.");
      return;
    }
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<
      string,
      string
    >;
    data.checkIn = start;
    data.checkOut = end;
    setBusy(true);
    trackAnalyticsEvent("booking_search", {
      check_in: start,
      check_out: end,
      guests: Number(data.guests),
      test_mode: true,
    });
    router.push("/stay?" + new URLSearchParams(data));
    setBusy(false);
  }
  const nights =
    start && end
      ? Math.round((+new Date(end) - +new Date(start)) / 86400000)
      : 0;
  return (
    <form
      onSubmit={submit}
      className={
        "relative rounded-2xl border border-stone-200 bg-[#faf8f3] p-4 text-[#27362f] shadow-sm " +
        (!compact
          ? "lg:grid lg:grid-cols-[2fr_.65fr_.85fr_auto] lg:items-end lg:gap-4"
          : "space-y-4")
      }
    >
      <DateRangePicker
        checkIn={start}
        checkOut={end}
        onChange={(a, b) => {
          setStart(a);
          setEnd(b);
        }}
      />
      <label className="stay-label mt-3 lg:mt-0">
        Guests
        <select
          name="guests"
          defaultValue={defaults.guests || "1"}
          className="stay-input"
        >
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {n} guest{n > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </label>
      <label className="stay-label mt-3 lg:mt-0">
        Corporate / promo code
        <input
          name="code"
          placeholder="Optional"
          defaultValue={defaults.code}
          maxLength={30}
          className="stay-input"
        />
      </label>
      <button disabled={busy} className="stay-button mt-4 w-full lg:mt-0">
        {busy ? "Searching…" : "Search availability"}
      </button>
      {nights > 0 && (
        <p className="mt-2 text-xs text-stone-500 lg:col-span-4">
          {nights} nights · Your dates are carried through checkout
        </p>
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700 lg:col-span-4">
          {error}
        </p>
      )}
    </form>
  );
}
