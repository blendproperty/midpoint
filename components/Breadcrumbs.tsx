import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/seo";

type Props = { items: BreadcrumbItem[] };

// Visible counterpart to BreadcrumbJsonLd — same item list, rendered as an
// actual on-page trail instead of only existing as structured data. Both
// components should always be fed the identical `items` array so the visible
// trail and the JSON-LD never describe different things.
export default function Breadcrumbs({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-6 pt-6 text-sm text-midpoint-grey-400">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {i > 0 && (
                <span aria-hidden="true" className="text-midpoint-grey-100">
                  /
                </span>
              )}
              {isLast ? (
                <span className="font-medium text-midpoint-dark" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="hover:text-midpoint-dark hover:underline">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
