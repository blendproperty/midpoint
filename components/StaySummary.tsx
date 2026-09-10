import { money, type StayQuote } from "@/lib/stay-pricing";
export default function StaySummary({
  quote,
  title,
}: {
  quote: StayQuote;
  title: string;
}) {
  return (
    <aside className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <p className="stay-eyebrow">Your stay</p>
      <h2 className="mt-2 text-2xl font-semibold">{title}</h2>
      <p className="mt-3 text-sm text-stone-600">
        {quote.checkIn} → {quote.checkOut}
      </p>
      <p className="mt-1 text-sm">
        {quote.nights} nights · {quote.guests} guest
        {quote.guests > 1 ? "s" : ""}
      </p>
      <div className="mt-6 space-y-3 text-sm">
        <p className="flex justify-between">
          <span>Room · {quote.nights} nights</span>
          <span>{money(quote.roomCents)}</span>
        </p>
        {quote.discount > 0 && (
          <p className="text-green-800">
            {quote.discount}% discount included · best eligible discount
          </p>
        )}
        <p className="flex justify-between">
          <span>Cleaning</span>
          <span>{money(quote.cleaningCents)}</span>
        </p>
        {quote.extras.map((e) => (
          <p key={e.id} className="flex justify-between gap-4">
            <span>{e.name}</span>
            <span>{money(e.cents)}</span>
          </p>
        ))}
        <p className="flex justify-between border-t pt-4 text-xl font-semibold">
          <span>Total</span>
          <span>{money(quote.totalCents)}</span>
        </p>
        <p className="text-xs text-stone-500">
          Includes {money(quote.vatCents)} test VAT. No hidden mandatory fees.
        </p>
      </div>
      <details className="mt-5 text-sm">
        <summary className="cursor-pointer">Nightly breakdown</summary>
        <div className="mt-3 max-h-48 overflow-auto">
          {quote.nightly.map((n) => (
            <p className="flex justify-between py-1" key={n.date}>
              <span>{n.date}</span>
              <span>{money(n.cents)}</span>
            </p>
          ))}
        </div>
      </details>
      <p className="mt-6 border-t pt-4 text-xs leading-5 text-stone-500">
        Test policy: check-in {quote.checkInTime}, check-out{" "}
        {quote.checkOutTime}. Free cancellation requests until{" "}
        {quote.cancellationHours} hours before arrival. Staff review
        cancellations and test refunds.
      </p>
    </aside>
  );
}
