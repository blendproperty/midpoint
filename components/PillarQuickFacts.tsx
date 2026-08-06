type Fact = { label: string; value: string };

// A skimmable strip of key facts, placed right under the hero — lets a
// visitor get the headline numbers (live listings, size range, rate) in
// under two seconds, before committing to reading the full page.
export default function PillarQuickFacts({ facts, title }: { facts: Fact[]; title?: string }) {
  if (facts.length === 0) return null;

  return (
    <div className="mx-auto max-w-7xl px-6 pt-10">
      <div className="rounded-2xl border border-midpoint-grey-100 bg-white p-8 shadow-sm">
        {title ? <h2 className="mb-6 text-xl font-semibold text-midpoint-dark">{title}</h2> : null}
        <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-midpoint-grey-400">{fact.label}</dt>
              <dd className="mt-2 text-lg font-bold text-midpoint-dark">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
