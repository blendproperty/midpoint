import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { notFound } from "next/navigation";
import { bookingAction } from "../actions";
import { money } from "@/lib/stay-pricing";
import Link from "next/link";
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  await requireAdmin();
  const [{ id }, q] = await Promise.all([params, searchParams]);
  const r = await prisma.reservation.findFirst({
    where: { id, isTest: true },
    include: { room: true, category: true, messages: true },
  });
  if (!r) notFound();
  const rooms = await prisma.room.findMany({
      where: { categoryId: r.categoryId },
      orderBy: { roomNumber: "asc" },
    }),
    audit = await prisma.bookingAudit.findMany({
      where: { target: id },
      orderBy: { createdAt: "desc" },
    });
  const snap = r.snapshot as {
    booker?: Record<string, string>;
    attribution?: Record<
      string,
      { source: string; medium: string; campaign: string }
    >;
  } | null;
  return (
    <div>
      <Link href="/admin/bookings" className="underline">
        ← All bookings
      </Link>
      <h1 className="mt-5 text-3xl font-semibold">{r.bookingReference}</h1>
      <p className="mt-2">
        TEST · {r.status} · Payment {r.paymentStatus}
      </p>
      {q.error && (
        <p role="alert" className="mt-5 rounded bg-red-50 p-4 text-red-800">
          {q.error}
        </p>
      )}
      {q.saved && (
        <p role="status" className="mt-5 text-green-800">
          Booking updated.
        </p>
      )}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="stay-card">
          <h2 className="text-xl font-semibold">Guest & stay</h2>
          <p className="mt-4">
            {r.guestFirstName} {r.guestLastName}
          </p>
          <p>
            {r.guestEmail} · {r.guestMobile}
          </p>
          <p>{r.company}</p>
          {snap?.booker && (
            <dl className="mt-4 text-sm">
              {Object.entries(snap.booker)
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="flex gap-3">
                    <dt className="text-stone-500">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
            </dl>
          )}
          {snap?.attribution && (
            <div className="mt-4 text-sm">
              {Object.entries(snap.attribution).map(([k, t]) => (
                <p key={k}>
                  {k}:{" "}
                  {[t.source, t.medium, t.campaign].filter(Boolean).join(" / ")}
                </p>
              ))}
            </div>
          )}
          <p className="mt-4">
            {r.category.name} · {r.room?.roomNumber}
          </p>
          <p>
            {r.checkIn.toISOString().slice(0, 10)} →{" "}
            {r.checkOut.toISOString().slice(0, 10)}
          </p>
          <p className="mt-3 font-semibold">
            {money(Math.round(Number(r.total) * 100))}
          </p>
          <p className="mt-3">{r.notes}</p>
          {r.cancellationRequested && (
            <p className="mt-5 text-amber-700">
              The guest requested cancellation.
            </p>
          )}
          <form
            action={bookingAction.bind(null, id)}
            className="mt-6 flex flex-wrap gap-3"
          >
            {[
              ["checkin", "Check in"],
              ["checkout", "Check out"],
              ["cancel", "Cancel & test refund"],
              ["noshow", "No show"],
              ["settle", "Mark test balance paid"],
            ].map(([action, label]) => (
              <button
                key={action}
                name="action"
                value={action}
                className="stay-secondary"
              >
                {label}
              </button>
            ))}
          </form>
        </section>
        <section className="stay-card">
          <h2 className="text-xl font-semibold">Move / amend reservation</h2>
          <p className="mt-2 text-xs text-stone-500">
            Availability and price are rechecked. A changed total resets the
            test payment balance to unpaid.
          </p>
          <form
            action={bookingAction.bind(null, id)}
            className="mt-5 space-y-4"
          >
            <input type="hidden" name="action" value="move" />
            <label className="stay-label">
              Room
              <select
                className="stay-input"
                name="roomId"
                defaultValue={r.roomId || ""}
              >
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.roomNumber} · {room.status}
                  </option>
                ))}
              </select>
            </label>
            <label className="stay-label">
              Check-in
              <input
                className="stay-input"
                type="date"
                name="checkIn"
                defaultValue={r.checkIn.toISOString().slice(0, 10)}
                required
              />
            </label>
            <label className="stay-label">
              Check-out
              <input
                className="stay-input"
                type="date"
                name="checkOut"
                defaultValue={r.checkOut.toISOString().slice(0, 10)}
                required
              />
            </label>
            <button className="stay-button">Save amendment</button>
          </form>
        </section>
      </div>
      <section className="stay-card mt-6">
        <h2 className="text-xl font-semibold">Staging email inbox</h2>
        {r.messages.length ? (
          r.messages.map((m) => (
            <details key={m.id} className="mt-4">
              <summary className="cursor-pointer">
                {m.subject} · {m.delivery}
              </summary>
              <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-6">
                {m.body}
              </pre>
            </details>
          ))
        ) : (
          <p className="mt-3 text-sm">No messages yet.</p>
        )}
      </section>
      <section className="stay-card mt-6">
        <h2 className="text-xl font-semibold">Activity</h2>
        {audit.map((a) => (
          <p key={a.id} className="mt-3 text-sm">
            {a.createdAt.toISOString()} · {a.actor} · {a.action}
          </p>
        ))}
      </section>
    </div>
  );
}
