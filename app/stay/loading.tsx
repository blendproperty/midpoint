export default function Loading() {
  return (
    <div className="stay-shell min-h-screen px-6 pb-20 pt-32">
      <div
        className="mx-auto max-w-7xl animate-pulse space-y-6"
        role="status"
        aria-label="Loading booking"
      >
        <div className="h-12 w-1/2 rounded bg-stone-200" />
        <div className="h-28 rounded-2xl bg-stone-200" />
        <div className="h-72 rounded-2xl bg-stone-200" />
        <span className="sr-only">Loading accommodation…</span>
      </div>
    </div>
  );
}
