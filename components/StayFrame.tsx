import Link from "next/link";
export default function StayFrame({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="stay-shell min-h-screen pb-24 pt-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <span>
            TEST BOOKING · Sample rates and room allocation · No real charges
          </span>
          <Link className="font-semibold underline" href="/manage-booking">
            Manage booking
          </Link>
        </div>
        <p className="stay-eyebrow">The Suites at Midpoint</p>
        <h1 className="mb-8 mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
}
