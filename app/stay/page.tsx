import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isStagingHost } from "@/lib/staging-host";
import { prisma } from "@/lib/prisma";
import { searchStay } from "@/lib/stay-service";
import StayFrame from "@/components/StayFrame";
import BookingSearch from "@/components/BookingSearch";
import StayRoomCard from "@/components/StayRoomCard";
export const metadata: Metadata = {
  title: "The Suites at Midpoint | Corporate Accommodation Midrand",
  description: "Explore Studios and Executive Suites at Midpoint.",
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  if (!(await isStagingHost())) notFound();
  const q = await searchParams;
  const params = new URLSearchParams({
    checkIn: q.checkIn || "",
    checkOut: q.checkOut || "",
    guests: q.guests || "1",
    code: q.code || "",
  }).toString();
  let result,
    error = "";
  if (q.checkIn || q.checkOut)
    try {
      result = await searchStay(
        q.checkIn || "",
        q.checkOut || "",
        Number(q.guests || 1),
        q.code || "",
      );
    } catch (e) {
      error = (e as Error).message;
    }
  const categories = await prisma.roomCategory.findMany({
    where: { active: true },
    orderBy: { code: "asc" },
  });
  const available = result?.rows.filter((r) => r.available > 0 && r.quote);
  return (
    <StayFrame title="Find your stay">
      <p className="-mt-4 mb-8 max-w-2xl text-stone-600">
        Two considered ways to stay in Midrand. Choose your dates, compare your
        full stay price, and book in a few simple steps.
      </p>
      <BookingSearch defaults={q} />
      {error && (
        <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-red-800">
          {error}
        </p>
      )}
      <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">
            {result ? "Available for your stay" : "Explore the rooms"}
          </h2>
          {result && (
            <p className="mt-2 text-sm text-stone-600">
              {q.checkIn} → {q.checkOut} · {q.guests || 1} guests ·{" "}
              {available?.length} room categories
            </p>
          )}
        </div>
        <p className="text-xs text-stone-500">
          Flexible test cancellation · Transparent total · Secure booking access
        </p>
      </div>
      <div className="mt-6 space-y-6">
        {result ? (
          available?.length ? (
            available.map((r) => (
              <StayRoomCard
                key={r.category.id}
                category={r.category}
                available={r.available}
                quote={r.quote}
                params={params}
              />
            ))
          ) : (
            <div className="stay-card">
              <h3 className="text-xl font-semibold">
                No rooms match this search
              </h3>
              <p className="mt-3 text-stone-600">
                {result.rows.find((r) => r.reason)?.reason ||
                  "Try different dates or fewer guests."}
              </p>
              <p className="mt-2 text-sm">
                Change your dates or guest count above to search again.
              </p>
            </div>
          )
        ) : (
          categories.map((c) => (
            <StayRoomCard key={c.id} category={c} params="" />
          ))
        )}
      </div>
    </StayFrame>
  );
}
