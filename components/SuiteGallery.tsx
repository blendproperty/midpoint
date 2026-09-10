"use client";
import Image from "next/image";
import { useState } from "react";

export default function SuiteGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  if (!images.length) return null;
  return <div><div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100"><Image src={images[active]} alt={`${title} interior ${active + 1}`} fill sizes="(min-width:1024px) 60vw, 100vw" className="object-contain" priority={active===0}/><span className="absolute bottom-3 right-3 rounded-full bg-black/65 px-3 py-1 text-xs text-white">{active+1} / {images.length}</span></div><div className="mt-3 grid grid-cols-4 gap-2">{images.map((src,i)=><button type="button" key={src} onClick={()=>setActive(i)} aria-label={`View image ${i+1}`} className={`relative aspect-[4/3] overflow-hidden rounded-lg border-2 ${i===active?"border-[#74805d]":"border-transparent"}`}><Image src={src} alt="" fill className="object-cover" sizes="160px"/></button>)}</div></div>;
}
