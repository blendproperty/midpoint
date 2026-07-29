export default function PillarPageLoading() {
  return (
    <div className="animate-pulse bg-white">
      <div className="relative h-[420px] w-full bg-midpoint-dark md:h-[480px]">
        <div className="mx-auto flex h-full max-w-7xl flex-col justify-center px-6">
          <div className="h-4 w-40 rounded bg-white/20" />
          <div className="mt-6 h-10 w-3/4 max-w-xl rounded bg-white/20 md:h-14" />
          <div className="mt-3 h-10 w-2/3 max-w-lg rounded bg-white/20 md:h-14" />
          <div className="mt-6 h-4 w-full max-w-md rounded bg-white/10" />
          <div className="mt-2 h-4 w-3/4 max-w-sm rounded bg-white/10" />
        </div>
      </div>

      <div className="border-b border-midpoint-grey-100 bg-white/95 px-6 py-4">
        <div className="mx-auto flex max-w-7xl gap-8">
          <div className="h-4 w-20 rounded bg-midpoint-grey-100" />
          <div className="h-4 w-28 rounded bg-midpoint-grey-100" />
          <div className="h-4 w-24 rounded bg-midpoint-grey-100" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="h-6 w-56 rounded bg-midpoint-grey-100" />
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <div className="h-32 rounded-card bg-midpoint-grey-100" />
          <div className="h-32 rounded-card bg-midpoint-grey-100" />
          <div className="h-32 rounded-card bg-midpoint-grey-100" />
        </div>
      </div>
    </div>
  );
}
