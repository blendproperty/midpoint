"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";

type Props = { name: string; photos: { src: string; alt: string }[] };

/** Native scrolling keeps touch, trackpad and no-JavaScript browsing available. */
export default function AmenityGallery({ name, photos }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const labelId = useId();
  const [expanded, setExpanded] = useState<number | null>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const isExpanded = expanded !== null;
  useEffect(() => {
    const el = dialog.current;
    if (!el || !isExpanded) return;
    const overflow = document.body.style.overflow;
    el.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      el.close();
      document.body.style.overflow = overflow;
    };
  }, [isExpanded]);
  function moveExpanded(direction: number) {
    setExpanded((index) => index === null ? null : (index + direction + photos.length) % photos.length);
  }
  function goTo(index: number) {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  const control = "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 bg-midpoint-dark/85 text-white transition-colors hover:bg-midpoint-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-midpoint-cyan disabled:opacity-35";
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
            <button type="button" onClick={() => setExpanded(index)} tabIndex={index === active ? 0 : -1} aria-label={`Enlarge ${name} photo ${index + 1}`} aria-haspopup="dialog" className="relative block h-full w-full cursor-zoom-in focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-midpoint-cyan">
              <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1280px) 290px, (min-width: 768px) 46vw, 100vw" className="object-cover" />
              <span className="absolute right-3 top-3 flex items-center gap-2 rounded-full bg-midpoint-dark/85 px-3 py-2 text-xs font-medium text-white"><Expand size={14} aria-hidden="true" />Enlarge</span>
            </button>
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
      <dialog
        ref={dialog}
        aria-labelledby={labelId}
        onCancel={() => setExpanded(null)}
        onClose={() => setExpanded(null)}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const rect = event.currentTarget.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) setExpanded(null);
        }}
        onKeyDown={(event) => {
          if (event.key === "Tab") {
            const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not([disabled])");
            const first = buttons[0];
            const last = buttons[buttons.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first?.focus();
            }
          }
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            moveExpanded(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
        className="fixed inset-0 m-auto h-[90dvh] max-h-[90dvh] w-[96vw] max-w-7xl overflow-hidden rounded-2xl bg-midpoint-dark p-4 text-white shadow-2xl backdrop:bg-black/85 open:flex open:flex-col md:p-6"
      >
        <div className="flex shrink-0 items-center justify-between gap-4 pb-4">
          <h2 id={labelId} className="text-lg font-semibold">{name} gallery</h2>
          <button type="button" className={control} aria-label="Close enlarged gallery" onClick={() => setExpanded(null)}><X size={22} aria-hidden="true" /></button>
        </div>
        {expanded !== null && <>
          <div className="relative min-h-0 flex-1"
            onTouchStart={(event) => { touchStart.current = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null; }}
            onTouchMove={(event) => { if (event.touches.length !== 1) touchStart.current = null; }}
            onTouchEnd={(event) => {
              const start = touchStart.current;
              touchStart.current = null;
              if (!start || !event.changedTouches.length) return;
              const dx = start.x - event.changedTouches[0].clientX;
              const dy = start.y - event.changedTouches[0].clientY;
              if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) moveExpanded(dx > 0 ? 1 : -1);
            }}
          >
            <Image src={photos[expanded].src} alt={photos[expanded].alt} fill sizes="(min-width: 1280px) 1232px, 92vw" className="object-contain" />
          </div>
          <div className="flex shrink-0 items-center justify-between gap-3 pt-4">
            <button type="button" className={control} aria-label="Previous enlarged photo" onClick={() => moveExpanded(-1)}><ArrowLeft size={20} aria-hidden="true" /></button>
            <p className="text-center text-xs leading-5 text-white/80" aria-live="polite" aria-atomic="true"><span className="block font-semibold tabular-nums text-white">{expanded + 1} / {photos.length}</span>{photos[expanded].alt}</p>
            <button type="button" className={control} aria-label="Next enlarged photo" onClick={() => moveExpanded(1)}><ArrowRight size={20} aria-hidden="true" /></button>
          </div>
        </>}
      </dialog>
    </div>
  );
}
