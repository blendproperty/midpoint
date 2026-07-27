import { breadcrumbJsonLd, webPageJsonLd, type BreadcrumbItem } from "@/lib/seo";

type Props = {
  items: BreadcrumbItem[];
  description?: string;
};

// Drop this into any page to emit both a BreadcrumbList (for the breadcrumb
// rich result in search) and a WebPage node tied to the same URL, matching
// the structure the original Webflow site emitted per-page.
export default function BreadcrumbJsonLd({ items, description }: Props) {
  const current = items[items.length - 1];
  const graph = [breadcrumbJsonLd(items)];

  if (current && description) {
    graph.push(
      webPageJsonLd({
        name: current.name,
        description,
        path: current.path
      }) as unknown as ReturnType<typeof breadcrumbJsonLd>
    );
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph.length === 1 ? graph[0] : { "@context": "https://schema.org", "@graph": graph }) }}
    />
  );
}
