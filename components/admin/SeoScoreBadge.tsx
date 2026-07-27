type Props = { score: number };

export default function SeoScoreBadge({ score }: Props) {
  const className =
    score >= 80
      ? "bg-emerald-100 text-emerald-700"
      : score >= 50
        ? "bg-amber-100 text-amber-700"
        : "bg-red-100 text-red-700";

  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${className}`}>{score}</span>;
}
