"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Props = { name: string; photos: { src: string; alt: string }[] };

/** Native scrolling keeps touch, trackpad and no-JavaScript browsing available. */
export default function AmenityGallery({ name, photos }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  function goTo(index: number) {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  const control = "flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-midpoint-dark/85 text-white transition-colors hover:bg-midpoint-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-midpoint-cyan disabled:opacity-35";
  return (
    <div className="relative">
      <div
        ref={track}
        role="region"
        aria-label={`${name} photo gallery`}
        tabIndex={0}
        onScroll={() => { const el = track.current; if (el) setActive(Math.round(el.scrollLeft / el.clientWidth)); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            goTo(Math.max(0, Math.min(photos.length - 1, active + (event.key === "ArrowRight" ? 1 : -1))));
          }
        }}
        className="flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-t-[1.5rem] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-midpoint-cyan"
      >
        {photos.map((photo, index) => (
          <div key={photo.src} className="relative aspect-[4/3] w-full shrink-0 snap-center" role="group" aria-label={`Photo ${index + 1} of ${photos.length}`}>
            <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1280px) 390px, (min-width: 768px) 31vw, 100vw" className="object-cover" />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/55 to-transparent px-4 pb-4 pt-10">
        <span className="rounded-full bg-midpoint-dark/85 px-3 py-1.5 text-xs font-medium tabular-nums text-white" aria-live="polite" aria-atomic="true">{String(active + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}</span>
        <div className="pointer-events-auto flex gap-2">
          <button type="button" className={control} aria-label={`Previous ${name} photo`} disabled={active === 0} onClick={() => goTo(active - 1)}><ArrowLeft size={18} aria-hidden="true" /></button>
          <button type="button" className={control} aria-label={`Next ${name} photo`} disabled={active === photos.length - 1} onClick={() => goTo(active + 1)}><ArrowRight size={18} aria-hidden="true" /></button>
        </div>
      </div>
    </div>
  );
}
