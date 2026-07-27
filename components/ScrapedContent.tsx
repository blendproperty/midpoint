import { pageContent, type ScrapedPage } from "@/lib/scraped";

export default function ScrapedContent({ page }: { page: ScrapedPage }) {
  const blocks = pageContent(page);
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {blocks.map((b, i) =>
        b.type === "p" ? (
          <p key={i} className="mt-4 leading-relaxed text-midpoint-grey-400">
            {b.text}
          </p>
        ) : b.type === "h1" ? (
          <h1 key={i} className="text-4xl font-bold text-midpoint-dark">
            {b.text}
          </h1>
        ) : (
          <h2 key={i} className="mt-10 text-2xl font-semibold text-midpoint-dark">
            {b.text}
          </h2>
        )
      )}
    </div>
  );
}
