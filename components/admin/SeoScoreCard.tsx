import { scoreContent, type SeoScoreResult } from "@/lib/seo-score";

type ContentProps = {
  title: string;
  slug: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  contentHtml: string;
  focusKeyword?: string | null;
};

type Props = ContentProps | { result: SeoScoreResult };

const STATUS_STYLES: Record<string, string> = {
  good: "bg-emerald-100 text-emerald-700",
  ok: "bg-amber-100 text-amber-700",
  bad: "bg-red-100 text-red-700",
};

const STATUS_ICON: Record<string, string> = {
  good: "✓",
  ok: "!",
  bad: "✕",
};

export default function SeoScoreCard(props: Props) {
  const result = "result" in props ? props.result : scoreContent(props);
  const overallStatus = result.score >= 80 ? "good" : result.score >= 50 ? "ok" : "bad";

  return (
    <div className="mt-6 max-w-2xl rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">SEO score</h2>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${STATUS_STYLES[overallStatus]}`}>
          {result.score}/100 — {result.grade}
        </span>
      </div>
      <ul className="mt-4 space-y-2">
        {result.checks.map((check) => (
          <li key={check.id} className="flex items-start gap-3 text-sm">
            <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${STATUS_STYLES[check.status]}`}>
              {STATUS_ICON[check.status]}
            </span>
            <span>
              <span className="font-medium">{check.label}:</span> {check.message}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
