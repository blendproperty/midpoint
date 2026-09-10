"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { money } from "@/lib/stay-pricing";
import { trackAnalyticsEvent } from "@/lib/analytics";
type RecordView = {
  reference: string;
  category: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  paymentStatus: string;
  total: number;
  expiresAt: string | null;
  cancellationRequested: boolean;
  messages: { subject: string; body: string }[];
};
export default function StayManage({
  reference = "",
  payment = false,
}: {
  reference?: string;
  payment?: boolean;
}) {
  const router = useRouter(),
    [record, setRecord] = useState<RecordView | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [access, setAccess] = useState("");
  async function load() {
    const r = await fetch(
      "/api/stay?reference=" + encodeURIComponent(reference),
    );
    const b = await r.json();
    if (r.ok) setRecord(b);
    else setError(b.error);
  }
  useEffect(() => {
    if (reference) {
      load();
      setAccess(sessionStorage.getItem("suite-access-" + reference) || "");
    }
  }, [reference]);
  async function lookup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fields = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const r = await fetch("/api/stay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "lookup", ...fields }),
      });
      const b = await r.json();
      if (!r.ok) throw new Error(b.error);
      router.push("/manage-booking?reference=" + b.reference);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function action(action: string, outcome?: string) {
    setBusy(true);
    setError("");
    try {
      if (action === "pay")
        trackAnalyticsEvent("payment_started", {
          test_mode: true,
          value: record?.total,
          room_category: record?.category,
        });
      const r = await fetch("/api/stay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, reference, outcome }),
      });
      const b = await r.json();
      if (!r.ok) throw new Error(b.error);
      if (b.declined) {
        setError(
          "Test payment declined. Your room hold remains active so you can retry.",
        );
      } else if (action === "pay") {
        trackAnalyticsEvent("booking_completed", {
          test_mode: true,
          value: record?.total,
          currency: "ZAR",
          room_category: record?.category,
        });
        router.push("/stay/confirmation?reference=" + reference);
      } else await load();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  if (!reference)
    return (
      <form onSubmit={lookup} className="stay-card mx-auto max-w-xl space-y-5">
        <h2 className="text-2xl font-semibold">Retrieve your booking</h2>
        <p className="text-sm text-stone-600">
          Use the reference, email and private access code from your
          confirmation screen.
        </p>
        {[
          ["reference", "Booking reference"],
          ["email", "Email"],
          ["accessCode", "Private access code"],
        ].map(([name, label]) => (
          <label key={name} className="stay-label">
            {label}
            <input
              name={name}
              required
              type={
                name === "email"
                  ? "email"
                  : name === "accessCode"
                    ? "password"
                    : "text"
              }
              className="stay-input"
            />
          </label>
        ))}
        {error && (
          <p role="alert" className="text-red-700">
            {error}
          </p>
        )}
        <button className="stay-button" disabled={busy}>
          {busy ? "Finding booking…" : "View booking"}
        </button>
      </form>
    );
  if (!record)
    return (
      <div className="stay-card">
        {error ? (
          <>
            <p role="alert">{error}</p>
            <Link
              href="/manage-booking"
              className="mt-4 inline-block underline"
            >
              Retrieve booking
            </Link>
          </>
        ) : (
          <p>Loading your booking…</p>
        )}
      </div>
    );
  return (
    <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1fr_340px]">
      <section className="stay-card">
        <p className="stay-eyebrow">
          {payment ? "Step 2 of 3 · Test payment" : "Your test reservation"}
        </p>
        <h2 className="mt-3 text-3xl font-semibold">
          {record.status === "CONFIRMED"
            ? "Test booking confirmed"
            : record.status === "CANCELLED"
              ? "Booking cancelled"
              : record.status === "PENDING"
                ? "Your room is held"
                : record.status.replaceAll("_", " ")}
        </h2>
        <p className="mt-4 text-stone-600">
          {record.firstName} {record.lastName} · {record.email}
        </p>
        <p className="mt-4 rounded-xl bg-stone-100 p-4 font-mono text-sm">
          {reference}
        </p>
        {payment && record.status === "PENDING" && (
          <div className="mt-6 space-y-4">
            <p className="text-sm">
              No card details or money are collected. Choose an outcome to
              exercise the full payment journey. Hold expires{" "}
              {record.expiresAt
                ? new Date(record.expiresAt).toLocaleTimeString()
                : "soon"}
              .
            </p>
            <button
              disabled={busy}
              onClick={() => action("pay", "success")}
              className="stay-button w-full"
            >
              Simulate successful payment
            </button>
            <button
              disabled={busy}
              onClick={() => action("pay", "declined")}
              className="stay-secondary w-full"
            >
              Simulate declined payment
            </button>
            <button
              disabled={busy}
              onClick={() => action("pay", "corporate")}
              className="stay-secondary w-full"
            >
              Confirm on corporate account (test)
            </button>
            <p className="text-xs text-stone-500">
              Corporate test requires company details and an enabled corporate
              code.
            </p>
          </div>
        )}
        {record.status === "CONFIRMED" && (
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              className="stay-secondary"
              href={"/api/stay/document?format=ics&reference=" + reference}
            >
              Add to calendar
            </a>
            <a
              className="stay-secondary"
              href={"/api/stay/document?reference=" + reference}
            >
              Download confirmation
            </a>
            <a
              className="stay-secondary"
              href="https://www.google.com/maps/search/?api=1&query=162+Tonetti+Street+Midrand"
              target="_blank"
              rel="noreferrer"
            >
              Directions
            </a>
          </div>
        )}
        {access && (
          <details className="mt-6 rounded-xl border p-4">
            <summary className="cursor-pointer font-semibold">
              Save your private access code
            </summary>
            <p className="mt-2 text-sm">
              Keep this private. You need it with your reference and email to
              retrieve your booking on another device.
            </p>
            <code className="mt-3 block break-all text-sm">{access}</code>
          </details>
        )}
        {["PENDING", "CONFIRMED"].includes(record.status) && !payment && (
          <div className="mt-6">
            {record.cancellationRequested ? (
              <p className="rounded-xl bg-amber-50 p-4">
                Cancellation requested. Staff will review it in the booking
                dashboard.
              </p>
            ) : (
              <button
                disabled={busy}
                onClick={() => action("cancel")}
                className="stay-secondary"
              >
                Request cancellation
              </button>
            )}
          </div>
        )}
        {record.messages.map((m, i) => (
          <details className="mt-6 border-t pt-5" key={i}>
            <summary className="cursor-pointer font-semibold">
              Confirmation email preview
            </summary>
            <p className="mt-2 text-xs text-stone-500">
              Captured in the staging inbox; no email sent externally.
            </p>
            <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-7">
              {m.body}
            </pre>
          </details>
        ))}
        {error && (
          <p role="alert" className="mt-5 text-red-700">
            {error}
          </p>
        )}
        <div className="mt-8 flex gap-5 text-sm">
          <Link href="/stay" className="underline">
            Search another stay
          </Link>
          <Link href="/manage-booking" className="underline">
            Manage another booking
          </Link>
          <a href="mailto:boitumelo@blendproperty.co.za" className="underline">
            Contact the team
          </a>
        </div>
      </section>
      <aside className="stay-card self-start">
        <h3 className="text-xl font-semibold">{record.category}</h3>
        <p className="mt-5">
          {record.checkIn.slice(0, 10)} → {record.checkOut.slice(0, 10)}
        </p>
        <p className="mt-2">{record.guests} guests</p>
        <p className="mt-5 text-2xl font-semibold">
          {money(Math.round(record.total * 100))}
        </p>
        <p className="mt-3 text-sm">
          Payment: {record.paymentStatus.replaceAll("_", " ")} (test)
        </p>
        <p className="mt-5 text-xs text-stone-500">
          This is a staging reservation. No real accommodation is reserved and
          no payment is taken.
        </p>
      </aside>
    </div>
  );
}
