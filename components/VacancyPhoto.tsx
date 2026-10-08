"use client";

import Image from "next/image";
import { useState } from "react";
import { Building2 } from "lucide-react";

export default function VacancyPhoto({ src, label, sizes, priority = false }: { src: string; label: string; sizes: string; priority?: boolean }) {
  const [failed, setFailed] = useState(false);
  return src && !failed
    ? <Image src={src} alt={label} fill sizes={sizes} priority={priority} onError={() => setFailed(true)} className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105" />
    : <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#eaf0ef] p-5 text-center text-midpoint-grey-400"><Building2 aria-hidden="true" className="h-10 w-10" /><span className="text-sm">Property photograph coming soon</span></span>;
}
