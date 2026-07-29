import Image from "next/image";

export default function PromoBanner() {
  return (
    <section className="px-6 py-8">
      <div className="mx-auto max-w-7xl">
        {/* The headline text is baked into the graphic itself (confirmed via
            Playwright: no separate HTML text nodes), which means it isn't
            real, selectable, SEO-indexable copy anywhere on the page — only
            the image's alt text conveys it, and only to screen readers.
            This heading carries the same message as real text without
            changing the visual design at all. */}
        <h2 className="sr-only">AM-Work, PM-Padel. It&rsquo;s all here.</h2>

        {/* Single designed graphic — "AM-Work / PM-Padel" text and the
            rounded photo insets are baked into the image itself, not
            separate HTML/CSS (confirmed via Playwright: image has
            border-radius: 0, object-fit: cover, no overlaid text nodes). */}
        <div className="relative aspect-[940.8/393.35] w-full">
          <Image
            src="/images/promo/am-work-pm-padel.avif"
            alt="AM - Work, PM - Padel. It's all here."
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
