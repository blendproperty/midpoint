import { notFound, redirect } from "next/navigation";
import { canonicalStaySlug } from "@/lib/stay-brand";
import { isStagingHost } from "@/lib/staging-host";
import { prisma } from "@/lib/prisma";
import { configFor, searchStay } from "@/lib/stay-service";
import StayFrame from "@/components/StayFrame";
import SuiteGallery from "@/components/SuiteGallery";
import StaySummary from "@/components/StaySummary";
import BookingSearch from "@/components/BookingSearch";
import Link from "next/link";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!(await isStagingHost())) return {};
  const category = await prisma.roomCategory.findUnique({
    where: { slug: canonicalStaySlug(slug) },
  });
  return {
    title: category ? category.name + " | The Suites at Midpoint" : "The Suites at Midpoint",
  };
}
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  if (!(await isStagingHost())) notFound();
  const [{ slug }, q] = await Promise.all([params, searchParams]);
  const canonical = canonicalStaySlug(slug);
  if (canonical !== slug) {
    const preserved = new URLSearchParams();
    for (const [key, value] of Object.entries(q)) {
      if (typeof value === "string") preserved.set(key, value);
    }
    redirect("/stay/" + canonical + (preserved.size ? "?" + preserved.toString() : ""));
  }
  const c = await prisma.roomCategory.findUnique({ where: { slug } });
  if (!c || !c.active) notFound();
  const config = await configFor();
  let row,
    error = "";
  if (q.checkIn && q.checkOut)
    try {
      row = (
        await searchStay(
          q.checkIn,
          q.checkOut,
          Number(q.guests || 1),
          q.code || "",
        )
      ).rows.find((r) => r.category.id === c.id);
    } catch (e) {
      error = (e as Error).message;
    }
  const query = new URLSearchParams({
    room: slug,
    checkIn: q.checkIn || "",
    checkOut: q.checkOut || "",
    guests: q.guests || "1",
    code: q.code || "",
  }).toString();
  return (
    <StayFrame title={c.name}>
      <Link
        href={"/stay?" + query}
        className="mb-6 inline-block text-sm underline"
      >
        ← Back to room choices
      </Link>
      <p className="mb-8 max-w-3xl text-lg text-stone-600">{c.description}</p>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <SuiteGallery images={c.images} title={c.name} />
          <p className="mt-3 text-xs text-stone-500">
            Supplied suite imagery; category allocation is illustrative during
            testing.
          </p>
          <h2 className="mt-10 text-2xl font-semibold">
            Everything in your room
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {c.amenities.map((a) => (
              <li key={a} className="rounded-xl border bg-white p-4 text-sm">
                ✓ {a}
              </li>
            ))}
          </ul>
          <h2 className="mt-10 text-2xl font-semibold">
            Your stay, at a glance
          </h2>
          <p className="mt-4 text-sm leading-7 text-stone-600">
            Designed for up to {c.maxGuests} guests in the test inventory.
            Check-in from {config.checkInTime}; check-out by{" "}
            {config.checkOutTime}. Test cancellation requests are free until{" "}
            {config.cancellationHours} hours before arrival. Final operating
            terms will be confirmed before live bookings open.
          </p>
        </div>
        <div className="space-y-5 lg:sticky lg:top-28 lg:self-start">
          {row?.quote && <StaySummary quote={row.quote} title={c.name} />}
          <div className="stay-card">
            {row?.available && row.quote ? (
              <>
                <p className="mb-4 text-sm">
                  {row.available} test rooms available for your dates.
                </p>
                <Link
                  data-analytics-event="select_room"
                  href={"/stay/checkout?" + query}
                  className="stay-button w-full"
                >
                  Select room
                </Link>
              </>
            ) : (
              <p className="mb-4 text-sm">
                {error ||
                  row?.reason ||
                  "Choose dates to see availability and your total."}
              </p>
            )}
            <details className="mt-5" open={!row?.quote}>
              <summary className="cursor-pointer text-sm font-semibold">
                Choose or modify dates
              </summary>
              <div className="mt-4">
                <BookingSearch compact defaults={q} />
              </div>
            </details>
          </div>
        </div>
      </div>
      {row?.quote && !!row.available && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between border-t bg-white px-6 py-3 lg:hidden">
          <strong>
            {new Intl.NumberFormat("en-ZA", {
              style: "currency",
              currency: "ZAR",
              maximumFractionDigits: 0,
            }).format(row.quote.totalCents / 100)}
          </strong>
          <Link className="stay-button" href={"/stay/checkout?" + query}>
            Select room
          </Link>
        </div>
      )}
    </StayFrame>
  );
}
