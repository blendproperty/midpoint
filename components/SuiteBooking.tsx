"use client";

import { useState } from "react";
import type { Suite } from "@prisma/client";

type Props = { suite: Suite };

export default function SuiteBooking({ suite }: Props) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [availability, setAvailability] = useState<
    "idle" | "checking" | "available" | "unavailable"
  >("idle");
  const [result, setResult] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.round(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              86_400_000
          )
        )
      : 0;
  const total = nights * suite.nightlyRate;

  async function checkDates() {
    if (!checkIn || !checkOut) return;
    setAvailability("checking");
    const res = await fetch(`/api/suites/${suite.id}/availability`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkIn, checkOut }),
    });
    const data = await res.json();
    setAvailability(data.available ? "available" : "unavailable");
  }

  async function reserve(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        suiteId: suite.id,
        checkIn,
        checkOut,
        totalAmount: total,
        guestName: form.get("guestName"),
        guestEmail: form.get("guestEmail"),
        guestPhone: form.get("guestPhone"),
        company: form.get("company"),
      }),
    });
    const data = await res.json();
    setSubmitting(false);
    setResult(
      data.ok
        ? "Preview hold created. In the live version, this is where you'd be sent to pay."
        : data.reason || "Something went wrong."
    );
  }

  return (
    <div className="rounded-xl border border-neutral-200 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-midpoint-dark">{suite.name}</h2>
          <p className="mt-1 text-sm text-neutral-600">{suite.description}</p>
        </div>
        <p className="whitespace-nowrap text-sm font-medium text-neutral-700">
          R{suite.nightlyRate.toLocaleString()}/night
        </p>
      </div>

      <form onSubmit={reserve} className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          Check-in
          <input
            type="date"
            required
            value={checkIn}
            onChange={(e) => {
              setCheckIn(e.target.value);
              setAvailability("idle");
            }}
            onBlur={checkDates}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
          />
        </label>
        <label className="text-sm">
          Check-out
          <input
            type="date"
            required
            value={checkOut}
            onChange={(e) => {
              setCheckOut(e.target.value);
              setAvailability("idle");
            }}
            onBlur={checkDates}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2"
          />
        </label>
        <input
          name="guestName"
          required
          placeholder="Full name"
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm sm:col-span-2"
        />
        <input
          name="guestEmail"
          type="email"
          required
          placeholder="Email"
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        />
        <input
          name="guestPhone"
          placeholder="Phone (optional)"
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm"
        />
        <input
          name="company"
          placeholder="Company (optional)"
          className="rounded-lg border border-neutral-300 px-3 py-2 text-sm sm:col-span-2"
        />

        {nights > 0 && (
          <p className="text-sm text-neutral-600 sm:col-span-2">
            {nights} night{nights === 1 ? "" : "s"} · R{total.toLocaleString()} total
          </p>
        )}
        {availability === "unavailable" && (
          <p className="text-sm text-red-600 sm:col-span-2">
            Those dates aren&apos;t available.
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || nights === 0 || availability === "unavailable"}
          className="rounded-full bg-midpoint-cyan px-4 py-2.5 text-sm font-semibold text-midpoint-dark disabled:opacity-50 sm:col-span-2"
        >
          {submitting ? "Holding…" : "Reserve (preview only — no payment)"}
        </button>
        {result && <p className="text-sm text-neutral-700 sm:col-span-2">{result}</p>}
      </form>
    </div>
  );
}
