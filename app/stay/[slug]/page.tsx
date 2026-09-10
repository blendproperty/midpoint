import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BookingSearch from "@/components/BookingSearch";
import SuiteGallery from "@/components/SuiteGallery";
import { prisma } from "@/lib/prisma";
import { formatRand, getAvailability, parseStay } from "@/lib/booking";
import { isStagingHost } from "@/lib/staging-host";

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const c=await prisma.roomCategory.findUnique({where:{slug}});return c?{title:`${c.name} | Serviced Accommodation Midrand`,description:c.description}:{};}

export default async function RoomPage({params,searchParams}:{params:Promise<{slug:string}>;searchParams:Promise<Record<string,string|undefined>>}){
  if (!(await isStagingHost())) notFound();
  const [{slug},q]=await Promise.all([params,searchParams]);
  const category=await prisma.roomCategory.findUnique({where:{slug}}); if(!category) notFound();
  const stay=parseStay(q.checkIn,q.checkOut); const availability=stay?await getAvailability(stay.checkIn,stay.checkOut,Number(q.guests||1)):null;
  const row=availability?.categories.find(c=>c.id===category.id); const total=stay&&category.baseRate?Number(category.baseRate)*stay.nights:null;
  return <main className="min-h-screen bg-[#f4efe5] pb-24 pt-32 text-[#27362f]"><div className="mx-auto max-w-7xl px-6"><p className="text-sm font-semibold uppercase tracking-[.2em] text-[#8a4f3d]">The Suites at Midpoint</p><h1 className="mt-3 text-4xl font-semibold md:text-6xl">{category.name}</h1><p className="mt-4 max-w-3xl text-lg text-slate-600">{category.description}</p><div className="mt-10 grid gap-10 lg:grid-cols-[1.35fr_.65fr]"><SuiteGallery images={category.images} title={category.name}/><aside id="select" className="lg:sticky lg:top-28 lg:self-start"><div className="rounded-2xl border border-black/10 bg-white p-6 shadow-lg"><h2 className="text-xl font-semibold">{category.baseRate?`${formatRand(category.baseRate)} / night`:"Rate on request"}</h2>{stay?<><p className="mt-2 text-sm text-slate-600">{stay.checkIn} – {stay.checkOut} · {stay.nights} nights</p>{total!==null&&<div className="mt-5 border-t pt-5"><div className="flex justify-between"><span>Room total</span><strong>{formatRand(total)}</strong></div><p className="mt-2 text-xs text-slate-500">Taxes and mandatory fees must be approved before online confirmation is enabled.</p></div>}<p className="mt-5 rounded-xl bg-[#eef0e8] p-3 text-sm font-semibold">{row?.availableRooms?`${row.availableRooms} available for these dates`:"No approved inventory available for these dates"}</p></>:<p className="mt-2 text-sm text-slate-600">Choose dates to check the configured physical-room inventory.</p>}<div className="mt-6"><BookingSearch compact defaults={{checkIn:q.checkIn,checkOut:q.checkOut,guests:q.guests,code:q.code}}/></div></div></aside></div><section className="mt-16"><h2 className="text-3xl font-semibold">Room amenities</h2><ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{category.amenities.map(a=><li key={a} className="rounded-xl border border-black/10 bg-white p-4">{a}</li>)}</ul><p className="mt-6 text-sm text-slate-500">Only confirmed category features are shown. Check-in times, cancellation terms, dimensions and additional services are pending operational approval.</p></section></div></main>;
}
