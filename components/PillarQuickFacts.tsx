type Fact = { label: string; value: string };

// A skimmable strip of key facts, placed right under the hero — lets a
// visitor get the headline numbers (live listings, size range, rate) in
// under two seconds, before committing to reading the full page.
export default function PillarQuickFacts({ facts }: { facts: Fact[] }) {
  if (facts.length === 0) return null;

  return (
    <div className="mx-auto max-w-7xl px-6 pt-8">
      <dl className="grid grid-cols-2 gap-4 rounded-2xl border border-midpoint-grey-100 bg-white p-6 shadow-sm sm:grid-cols-4">
        {facts.map((fact) => (
          <div key={fact.label}>
            <dt className="text-xs font-semibold uppercase tracking-wide text-midpoint-grey-400">{fact.label}</dt>
            <dd className="mt-1 text-lg font-bold text-midpoint-dark">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
