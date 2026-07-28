type TocItem = { id: string; label: string };

// Sticky anchor nav so long-form pillar content is skimmable and users can
// jump straight to the section they want, rather than scrolling blind — the
// single most repeated pattern across well-designed pillar pages. Plain
// anchor links, no JS needed, so it costs nothing to render server-side.
export default function PillarTableOfContents({ items }: { items: TocItem[] }) {
  if (items.length < 2) return null;

  return (
    <nav className="sticky top-0 z-30 border-b border-midpoint-grey-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-6 py-3 text-sm">
        <div className="flex shrink-0 gap-6">
          {items.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="font-medium text-midpoint-grey-400 hover:text-midpoint-dark">
              {item.label}
            </a>
          ))}
        </div>
        <a
          href="/contact-us"
          className="ml-auto shrink-0 rounded-full bg-midpoint-dark px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90"
        >
          Enquire now
        </a>
      </div>
    </nav>
  );
}
