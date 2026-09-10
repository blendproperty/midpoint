import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { day, todayZA } from "@/lib/stay-pricing";
import { addBlock, removeBlock } from "../bookings/actions";
import Link from "next/link";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; error?: string; saved?: string }>;
}) {
  await requireAdmin();
  const q = await searchParams;
  let start: Date;
  try {
    start = day(q.start || todayZA());
  } catch {
    start = day(todayZA());
  }
  const end = new Date(+start + 14 * 86400000),
    days = Array.from(
      { length: 14 },
      (_, i) => new Date(+start + i * 86400000),
    );
  const rooms = await prisma.room.findMany({
    include: {
      category: true,
      blocks: { where: { start: { lt: end }, end: { gt: start } } },
      reservations: {
        where: {
          checkIn: { lt: end },
          checkOut: { gt: start },
          isTest: true,
          status: { in: ["PENDING", "CONFIRMED", "CHECKED_IN"] },
          OR: [
            { status: { not: "PENDING" } },
            { expiresAt: null },
            { expiresAt: { gte: new Date() } },
          ],
        },
      },
    },
    orderBy: { roomNumber: "asc" },
  });
  return (
    <div>
      <h1 className="text-3xl font-semibold">Room calendar</h1>
      <p className="mt-2 text-sm text-stone-500">
        14-day view · Click a reservation to move it, check in, check out or
        cancel.
      </p>
      <form className="my-6 flex gap-3">
        <input
          type="date"
          name="start"
          defaultValue={start.toISOString().slice(0, 10)}
          className="stay-input !w-auto !mt-0"
        />
        <button className="stay-button">Show dates</button>
        <Link href="/admin/bookings" className="stay-secondary">
          All bookings
        </Link>
      </form>
      {q.error && (
        <p role="alert" className="mb-5 text-red-700">
          {q.error}
        </p>
      )}
      {q.saved && <p className="mb-5 text-green-800">Room block saved.</p>}
      <div className="overflow-auto rounded-xl border bg-white">
        <div style={{ minWidth: 1200 }}>
          <div
            className="grid"
            style={{ gridTemplateColumns: "180px repeat(14,minmax(65px,1fr))" }}
          >
            <div className="border-b p-3 font-semibold">Room</div>
            {days.map((d) => (
              <div
                key={+d}
                className="border-b border-l p-2 text-center text-xs"
              >
                {d.toLocaleDateString("en-ZA", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </div>
            ))}
          </div>
          {rooms.map((room) => (
            <div
              className="grid min-h-16 border-b"
              style={{
                gridTemplateColumns: "180px repeat(14,minmax(65px,1fr))",
              }}
              key={room.id}
            >
              <div className="p-3 text-sm">
                <strong>{room.roomNumber}</strong>
                <p className="text-xs text-stone-500">
                  {room.category?.name || "Unassigned"}
                </p>
              </div>
              {days.map((d) => {
                const r = room.reservations.find(
                    (r) => r.checkIn <= d && r.checkOut > d,
                  ),
                  b = room.blocks.find((b) => b.start <= d && b.end > d);
                return (
                  <div
                    key={+d}
                    className={
                      "min-w-0 border-l p-1 text-xs " +
                      (b ? "bg-stone-200" : r ? "bg-green-100" : "")
                    }
                    title={b?.reason || r?.bookingReference || "Available"}
                  >
                    {r ? (
                      <Link
                        href={"/admin/bookings/" + r.id}
                        className="block h-full overflow-hidden rounded bg-[#435247] px-1 py-3 text-white"
                      >
                        {r.checkIn >= d || +d === +start
                          ? r.guestFirstName + " " + r.guestLastName
                          : "—"}
                      </Link>
                    ) : b ? (
                      <span className="block py-3">Blocked</span>
                    ) : (
                      <span className="block py-3 text-center text-stone-300">
                        ·
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <section className="stay-card mt-8">
        <h2 className="text-xl font-semibold">Block a room for maintenance</h2>
        <form
          action={addBlock}
          className="mt-4 grid items-end gap-4 md:grid-cols-5"
        >
          <label className="stay-label">
            Room
            <select name="roomId" className="stay-input">
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.roomNumber}
                </option>
              ))}
            </select>
          </label>
          <label className="stay-label">
            From
            <input name="start" type="date" required className="stay-input" />
          </label>
          <label className="stay-label">
            Until (exclusive)
            <input name="end" type="date" required className="stay-input" />
          </label>
          <label className="stay-label">
            Reason
            <input
              name="reason"
              required
              maxLength={300}
              className="stay-input"
            />
          </label>
          <button className="stay-button">Block room</button>
        </form>
        <div className="mt-6 space-y-3">
          {rooms.flatMap((r) =>
            r.blocks.map((b) => (
              <form
                action={removeBlock.bind(null, b.id)}
                key={b.id}
                className="flex flex-wrap justify-between gap-3 border-t pt-3 text-sm"
              >
                <span>
                  {r.roomNumber} · {b.start.toISOString().slice(0, 10)} →{" "}
                  {b.end.toISOString().slice(0, 10)} · {b.reason}
                </span>
                <button className="underline">Remove block</button>
              </form>
            )),
          )}
        </div>
      </section>
    </div>
  );
}
