import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { hasSuitesPreviewAccess, suitesPreviewEnabled } from "@/lib/suites-preview";
import SuitesPreviewGate from "@/components/SuitesPreviewGate";
import SuiteBooking from "@/components/SuiteBooking";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Suites at Midpoint (Private Preview)",
  robots: { index: false, follow: false, nocache: true },
};

export default async function SuitesPreviewPage() {
  if (!suitesPreviewEnabled() || !(await hasSuitesPreviewAccess())) {
    return <SuitesPreviewGate />;
  }

  const suites = await prisma.suite.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <div className="mb-8 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        Private preview — payments are disabled. Reservations made here do
        not charge a card and are not confirmed bookings.
      </div>
      <h1 className="text-3xl font-semibold text-midpoint-dark">
        The Suites at Midpoint
      </h1>
      <p className="mt-2 max-w-2xl text-neutral-600">
        Corporate accommodation at Midpoint Midrand. Pick a suite and dates
        below to see how the booking flow will work.
      </p>

      {suites.length === 0 ? (
        <p className="mt-12 text-neutral-500">
          No suites have been published yet — add one in /admin/suites.
        </p>
      ) : (
        <div className="mt-10 grid gap-8">
          {suites.map((suite) => (
            <SuiteBooking key={suite.id} suite={suite} />
          ))}
        </div>
      )}
    </main>
  );
}
