// This is the range of published asking base rates, not a quotation or an
// estimate of total occupancy cost. Empty/invalid inventory makes no claim.
export function publishedRentalRange(listings: { ratePerSqm: number }[]): string | undefined {
  const rates = listings.map(v => v.ratePerSqm).filter(n => Number.isFinite(n) && n > 0);
  if (!rates.length) return undefined;
  const min = Math.min(...rates);
  const max = Math.max(...rates);
  const format = (n: number) => `R${n.toLocaleString("en-ZA", { maximumFractionDigits: 2 })}`;
  return `${format(min)}${min === max ? "" : `–${format(max)}`} per m² per month`;
}
