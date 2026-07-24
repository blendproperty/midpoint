import Image from "next/image";

export default function PromoBanner() {
  return (
    <section className="px-6 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Single designed graphic — "AM-Work / PM-Padel" text and the
            rounded photo insets are baked into the image itself, not
            separate HTML/CSS (confirmed via Playwright: image has
            border-radius: 0, object-fit: cover, no overlaid text nodes). */}
        <div className="relative aspect-[940.8/393.35] w-full">
          <Image
            src="https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/684937746b99cba861ec240c_am-work-pm-padel.avif"
            alt="AM - Work, PM - Padel. It's all here."
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
