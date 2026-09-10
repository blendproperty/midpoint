import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BookingSearch from "@/components/BookingSearch";
import { formatRand, getAvailability, parseStay } from "@/lib/booking";
import { isStagingHost } from "@/lib/staging-host";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Stay at OnPoint | Corporate Accommodation Midrand", description: "Search The Suites at Midpoint corporate serviced accommodation." };

export default async function StayPage({ searchParams }: { searchParams: Promise<Record<string,string|undefined>> }) {
  if (!(await isStagingHost())) notFound();
  const q = await searchParams;
  const guests = Number(q.guests || 1);
  const result = q.checkIn && q.checkOut ? await getAvailability(q.checkIn, q.checkOut, guests) : null;
  const attempted = Boolean(q.checkIn || q.checkOut);
  return <main className="min-h-screen bg-[#f4efe5] pb-24 pt-32 text-[#27362f]">
    <div className="mx-auto max-w-7xl px-6"><p className="text-sm font-semibold uppercase tracking-[.2em] text-[#8a4f3d]">The Suites at Midpoint</p><h1 className="mt-3 text-4xl font-semibold md:text-6xl">Find your stay</h1><p className="mt-4 max-w-2xl text-slate-600">Corporate serviced accommodation in Midrand, designed around focused work and comfortable extended stays.</p><div className="mt-8"><BookingSearch defaults={{checkIn:q.checkIn,checkOut:q.checkOut,guests:q.guests,code:q.code}} /></div>
    {attempted && !parseStay(q.checkIn,q.checkOut) && <p className="mt-8 rounded-xl bg-red-50 p-4 text-red-800">Choose valid check-in and check-out dates.</p>}
    {result && <section className="mt-12"><div className="flex flex-wrap items-end justify-between gap-4 border-b border-black/10 pb-5"><div><h2 className="text-2xl font-semibold">Your stay</h2><p className="mt-1 text-slate-600">{result.checkIn} – {result.checkOut} · {result.nights} night{result.nights!==1?"s":""} · {result.guests} guest{result.guests!==1?"s":""}</p></div></div>
      <div className="mt-8 space-y-6">{result.categories.length===0?<div className="rounded-2xl border border-black/10 bg-white p-8"><h3 className="text-xl font-semibold">Availability is being configured</h3><p className="mt-2 text-slate-600">The 18-room inventory is loaded but room-category assignments and rates still require approval. Please contact the team for these dates.</p></div>:result.categories.map(c=><article key={c.id} className="grid overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm md:grid-cols-[.8fr_1.2fr]"><div className="relative min-h-64"><Image src={c.images[0]} alt={`${c.name} interior`} fill className="object-cover"/></div><div className="p-7"><div className="flex flex-wrap justify-between gap-4"><div><h3 className="text-2xl font-semibold">{c.name}</h3><p className="mt-2 max-w-xl text-slate-600">{c.description}</p></div><p className="font-semibold">{c.baseRate?`From ${formatRand(c.baseRate)} / night`:"Rate on request"}</p></div><ul className="mt-5 flex flex-wrap gap-2">{c.amenities.slice(0,6).map(a=><li key={a} className="rounded-full bg-[#eef0e8] px-3 py-1 text-sm">{a}</li>)}</ul><p className="mt-5 text-sm font-semibold text-[#8a4f3d]">{c.availableRooms>0?`${c.availableRooms} room${c.availableRooms!==1?"s":""} available`:"Not available for these dates"}</p><div className="mt-6 flex gap-3"><Link href={`/stay/${c.slug}?${new URLSearchParams({checkIn:result.checkIn,checkOut:result.checkOut,guests:String(result.guests),code:q.code||""})}`} className="rounded-full border border-[#27362f] px-5 py-2.5 font-semibold">View room</Link>{c.availableRooms>0&&c.baseRate&&<Link href={`/stay/${c.slug}?checkIn=${result.checkIn}&checkOut=${result.checkOut}&guests=${result.guests}#select`} className="rounded-full bg-[#27362f] px-5 py-2.5 font-semibold text-white">Select</Link>}</div></div></article>)}</div>
    </section>}</div>
  </main>;
}
