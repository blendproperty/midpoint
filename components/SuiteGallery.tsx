"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
export default function SuiteGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [active, setActive] = useState(0),
    [open, setOpen] = useState(false),
    dialog = useRef<HTMLDialogElement>(null),
    touch = useRef(0);
  const move = (d: number) =>
    setActive((i) => (i + d + images.length) % images.length);
  useEffect(() => {
    if (open) dialog.current?.showModal();
    else dialog.current?.close();
  }, [open]);
  if (!images.length) return null;
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open full screen room gallery"
        className="relative block aspect-[4/3] w-full overflow-hidden rounded-2xl bg-stone-100"
      >
        <Image
          src={images[active]}
          alt={title + " supplied interior " + (active + 1)}
          fill
          sizes="(min-width:1024px) 65vw, 100vw"
          className="object-contain"
          priority
        />
        <span className="absolute bottom-4 right-4 rounded-full bg-black/60 px-4 py-2 text-xs text-white">
          View photos · {active + 1}/{images.length}
        </span>
      </button>
      <div className="mt-3 flex gap-2 overflow-auto">
        {images.map((src, i) => (
          <button
            type="button"
            key={src}
            onClick={() => setActive(i)}
            aria-label={"View image " + (i + 1)}
            aria-pressed={active === i}
            className={
              "relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 " +
              (active === i ? "border-[#74805d]" : "border-transparent")
            }
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="112px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
      <dialog
        ref={dialog}
        onCancel={() => setOpen(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") move(1);
          if (e.key === "ArrowLeft") move(-1);
        }}
        className="h-[90vh] w-[95vw] max-w-6xl rounded-2xl bg-[#151d18] p-5 text-white backdrop:bg-black/80"
      >
        <div className="flex items-center justify-between">
          <p>
            {title} · {active + 1}/{images.length}
          </p>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close gallery"
            className="p-3"
          >
            ✕
          </button>
        </div>
        <div
          className="relative h-[70vh]"
          onTouchStart={(e) => {
            touch.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            const diff = touch.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 40) move(diff > 0 ? 1 : -1);
          }}
        >
          <Image
            src={images[active]}
            alt={title + " interior " + (active + 1)}
            fill
            className="object-contain"
            sizes="90vw"
          />
        </div>
        <div className="flex justify-between">
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => move(-1)}
            className="p-3"
          >
            ← Previous
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => move(1)}
            className="p-3"
          >
            Next →
          </button>
        </div>
      </dialog>
    </div>
  );
}
