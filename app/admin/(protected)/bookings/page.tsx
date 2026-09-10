import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import Link from "next/link";
import { roomWhere } from "@/lib/stay-service";
import { todayZA, money } from "@/lib/stay-pricing";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  await requireAdmin();
  const q = await searchParams,
    today = new Date(todayZA() + "T00:00:00Z"),
    tomorrow = new Date(+today + 86400000);
  const [all, rooms, available] = await Promise.all([
    prisma.reservation.findMany({
      where: { isTest: true },
      include: { room: true, category: true },
      orderBy: { createdAt: "desc" },
      take: 1000,
    }),
    prisma.room.count({ where: { active: true } }),
    prisma.room.count({
      where: { ...roomWhere("", today, tomorrow), categoryId: undefined },
    }),
  ]);
  const active = all.filter((r) =>
    ["CONFIRMED", "CHECKED_IN"].includes(r.status),
  );
  const occupied = active.filter(
    (r) => r.checkIn <= today && r.checkOut > today,
  );
  const metrics = [
    [
      "Arrivals today",
      active.filter((r) => r.checkIn >= today && r.checkIn < tomorrow).length,
    ],
    [
      "Departures today",
      active.filter((r) => r.checkOut >= today && r.checkOut < tomorrow).length,
    ],
    ["Occupied tonight", occupied.length],
    ["Available tonight", available],
    [
      "Occupancy",
      rooms ? Math.round((occupied.length / rooms) * 100) + "%" : "0%",
    ],
    [
      "Test paid revenue",
      money(
        all
          .filter((r) => r.paymentStatus === "PAID")
          .reduce((s, r) => s + Math.round(Number(r.total) * 100), 0),
      ),
    ],
  ];
  const filtered = all.filter(
    (r) =>
      (!q.status || r.status === q.status) &&
      (!q.q ||
        (
          r.bookingReference +
          " " +
          r.guestFirstName +
          " " +
          r.guestLastName +
          " " +
          r.company
        )
          .toLowerCase()
          .includes(q.q.toLowerCase())),
  );
  return (
    <div>
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Bookings</h1>
          <p className="mt-2 text-sm text-stone-500">
            Staging operations · Latest 1,000 test bookings; revenue is the paid
            total in this list.
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/admin/calendar" className="underline">
            Room calendar
          </Link>
          <Link href="/admin/rates" className="underline">
            Rates & policies
          </Link>
          <Link href="/stay" className="underline">
            Guest website
          </Link>
        </div>
      </div>
      <div className="my-8 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {metrics.map(([name, value]) => (
          <div className="rounded-xl border bg-white p-4" key={String(name)}>
            <p className="text-xs text-slate-500">{name}</p>
            <strong className="mt-2 block text-2xl">{value}</strong>
          </div>
        ))}
      </div>
      <form className="mb-5 flex flex-wrap gap-3">
        <input
          name="q"
          defaultValue={q.q}
          placeholder="Reference, guest or company"
          className="stay-input !mt-0 !w-auto"
        />
        <select
          name="status"
          defaultValue={q.status || ""}
          className="stay-input !mt-0 !w-auto"
        >
          <option value="">All statuses</option>
          {[
            "PENDING",
            "CONFIRMED",
            "CHECKED_IN",
            "CHECKED_OUT",
            "CANCELLED",
            "NO_SHOW",
          ].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <button className="stay-button">Filter</button>
      </form>
      <div className="overflow-auto rounded-xl border bg-white">
        <table className="w-full whitespace-nowrap text-left text-sm">
          <thead className="bg-slate-100">
            <tr>
              {[
                "Reference / guest",
                "Room",
                "Stay",
                "Status",
                "Payment",
                "Total",
                "",
              ].map((x) => (
                <th key={x} className="p-4">
                  {x}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr className="border-t" key={r.id}>
                <td className="p-4">
                  <Link
                    href={"/admin/bookings/" + r.id}
                    className="font-semibold underline"
                  >
                    {r.bookingReference}
                  </Link>
                  <p className="mt-1">
                    {r.guestFirstName} {r.guestLastName}
                  </p>
                  {r.cancellationRequested && (
                    <p className="mt-1 text-amber-700">
                      Cancellation requested
                    </p>
                  )}
                </td>
                <td className="p-4">
                  {r.room?.roomNumber}
                  <p className="text-xs">{r.category.name}</p>
                </td>
                <td className="p-4">
                  {r.checkIn.toISOString().slice(0, 10)} →{" "}
                  {r.checkOut.toISOString().slice(0, 10)}
                </td>
                <td className="p-4">{r.status}</td>
                <td className="p-4">{r.paymentStatus}</td>
                <td className="p-4">
                  {money(Math.round(Number(r.total) * 100))}
                </td>
                <td>
                  <Link
                    href={"/admin/bookings/" + r.id}
                    className="p-4 underline"
                  >
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!filtered.length && (
          <p className="p-8 text-stone-500">
            No bookings yet. Make a test booking from the guest website.
          </p>
        )}
      </div>
    </div>
  );
}
