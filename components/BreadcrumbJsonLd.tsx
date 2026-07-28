import { breadcrumbJsonLd, webPageJsonLd, type BreadcrumbItem } from "@/lib/seo";

type Props = {
  items: BreadcrumbItem[];
  description?: string;
  // Pre-built second node to include alongside the breadcrumb — e.g. a
  // saved custom schemaJson override from PageSeoOverride, or a richer
  // auto-generated node from lib/seo.ts's richPageJsonLd(). Takes priority
  // over `description` (which just builds a flat default WebPage node).
  node?: Record<string, unknown> | null;
};

// Drop this into any page to emit both a BreadcrumbList (for the breadcrumb
// rich result in search) and a second node tied to the same URL, matching
// the structure the original Webflow site emitted per-page.
export default function BreadcrumbJsonLd({ items, description, node }: Props) {
  const current = items[items.length - 1];
  const graph = [breadcrumbJsonLd(items)];

  const extra =
    node ?? (current && description ? webPageJsonLd({ name: current.name, description, path: current.path }) : null);
  if (extra) {
    graph.push(extra as unknown as ReturnType<typeof breadcrumbJsonLd>);
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph.length === 1 ? graph[0] : { "@context": "https://schema.org", "@graph": graph })
      }}
    />
  );
}
