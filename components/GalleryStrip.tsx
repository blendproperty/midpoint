"use client";

import { useEffect, useRef } from "react";

const BASE = "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267";

const rowA = [
  `${BASE}/67ceee83d32ff958be63ad9c_MidrandOfficePark-1482-p-1600.avif`,
  `${BASE}/67ceed18608b0ddf4d1d3e33_2011__K7C7044_Gpnt_Business_Park_off_Midrand_HR_2-p-1600.avif`,
  `${BASE}/67ceed66cd08224bfbbeedea_MidrandOfficePark-17-p-1600.avif`,
  `${BASE}/67ceeda7b6bd0e19228fab92_MidrandOfficePark-55-p-1600.avif`,
  `${BASE}/67ceed18608b0ddf4d1d3e33_2011__K7C7044_Gpnt_Business_Park_off_Midrand_HR_2-p-1600.avif`,
];

const rowB = [
  `${BASE}/67cece632c43c1a5ddf96ec5_pexels-sbam-27223663-p-1600.avif`,
  `${BASE}/6a05a0d539c8a4a1a9edebe7_paddle.jpg`,
  `${BASE}/67ced064e093893c8e33c09d_2feaa21357c9d95507e11db182fdb64d-p-1600.avif`,
  `${BASE}/6a147df47eba794ae380d2fa_running-man.jpg`,
  `${BASE}/6a05a07aa923faece8ab37e1_gym.jpg`,
  `${BASE}/6a05bb3ff467c957c728ea01_restaurant.jpg`,
  `${BASE}/67ced064e093893c8e33c09d_2feaa21357c9d95507e11db182fdb64d-p-1600.avif`,
];

function Row({ images, refEl }: { images: string[]; refEl: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div className="overflow-hidden">
      <div ref={refEl} className="flex w-max gap-4 will-change-transform">
        {images.map((src, i) => (
          <div
            key={i}
            className="relative h-[220px] w-[300px] shrink-0 overflow-hidden rounded-2xl sm:h-[260px] sm:w-[360px] md:h-[320px] md:w-[440px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GalleryStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const rowARef = useRef<HTMLDivElement>(null);
  const rowBRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / total));
      if (rowARef.current) rowARef.current.style.transform = `translate3d(${progress * 260}px,0,0)`;
      if (rowBRef.current) rowBRef.current.style.transform = `translate3d(${progress * 480}px,0,0)`;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-midpoint-dark px-6 py-16">
      <div className="mx-auto max-w-7xl space-y-4">
        <Row images={rowA} refEl={rowARef} />
        <Row images={rowB} refEl={rowBRef} />
      </div>
    </section>
  );
}
