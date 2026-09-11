import Link from "next/link";
import { ArrowUpRight, CalendarCheck, LogOut, BedDouble, ClipboardCheck, ArrowRight, CreditCard, CalendarDays, AlertCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { todayZA, money } from "@/lib/stay-pricing";
import { roomWhere } from "@/lib/stay-service";
import { PageHeading, Metric, EmptyState, StatusBadge } from "@/components/admin/OperationsUI";
import { shortDate } from "@/lib/suites-operations";
export default async function SuitesOverview() {
  await requireAdmin();
  const now=new Date(),today=new Date(todayZA()+"T00:00:00Z"),tomorrow=new Date(+today+86400000),end=new Date(+today+14*86400000);
  const active={isTest:true,status:{in:["CONFIRMED","CHECKED_IN"] as ("CONFIRMED"|"CHECKED_IN")[]}};
  const [rooms,arrivals,departures,inhouse,available,attention,unpaid,readiness,upcoming,recent,forecast,paid] = await Promise.all([
    prisma.room.count({where:{active:true}}),
    prisma.reservation.count({where:{isTest:true,status:"CONFIRMED",checkIn:{gte:today,lt:tomorrow}}}),
    prisma.reservation.count({where:{isTest:true,status:"CHECKED_IN",checkOut:{gte:today,lt:tomorrow}}}),
    prisma.reservation.count({where:{isTest:true,status:"CHECKED_IN"}}),
    prisma.room.count({where:{...roomWhere("",today,tomorrow),categoryId:undefined,category:{active:true}}}),
    prisma.reservation.count({where:{isTest:true,cancellationRequested:true,status:{in:["PENDING","CONFIRMED"]}}}),
    prisma.reservation.count({where:{isTest:true,paymentStatus:"UNPAID",status:{in:["CONFIRMED","CHECKED_IN","CHECKED_OUT"]}}}),
    prisma.room.count({where:{active:true,housekeeping:{not:"INSPECTED"}}}),
    prisma.reservation.findMany({where:{...active,checkIn:{gte:today}},include:{category:true,room:true},orderBy:{checkIn:"asc"},take:5}),
    prisma.bookingAudit.findMany({orderBy:{createdAt:"desc"},take:5}),
    prisma.reservation.findMany({where:{...active,checkIn:{lt:end},checkOut:{gt:today}},select:{checkIn:true,checkOut:true,roomId:true}}),
    prisma.reservation.aggregate({where:{isTest:true,paymentStatus:"PAID",createdAt:{gte:new Date(+today-29*86400000)}},_sum:{total:true}}),
  ]);
  const days=Array.from({length:14},(_,i)=>{const date=new Date(+today+i*86400000);return {date,count:new Set(forecast.filter(r=>r.checkIn<=date&&r.checkOut>date).map(r=>r.roomId).filter(Boolean)).size};});
  return <div>
    <PageHeading title="Your property, at a glance." description={"A clear view of today's stays, room readiness and the work ahead. "+today.toLocaleDateString("en-ZA",{weekday:"long",day:"numeric",month:"long",year:"numeric",timeZone:"UTC"})}>
      <Link href="/admin/calendar" className="ops-button secondary"><CalendarDays size={15}/>View calendar</Link>
      <Link href="/admin/bookings/new" className="ops-button">＋ New test reservation</Link>
    </PageHeading>
    <div className="ops-metrics">
      <Metric label="Arrivals today" value={arrivals} detail="Confirmed guests due to arrive" icon={<CalendarCheck size={18}/>} href="/admin/bookings?view=arrivals"/>
      <Metric label="Departures today" value={departures} detail="Checked-in guests due to leave" icon={<LogOut size={18}/>} href="/admin/bookings?view=departures"/>
      <Metric label="Guests in house" value={inhouse} detail="Reservations currently checked in" icon={<BedDouble size={18}/>} href="/admin/bookings?view=inhouse"/>
      <Metric label="Available tonight" value={available} detail={rooms+" active rooms · excludes holds & blocks"} icon={<ClipboardCheck size={18}/>} href="/admin/calendar"/>
    </div>
    <div className="ops-grid-main">
      <section className="ops-panel"><div className="ops-panel-head"><div><h2>Upcoming arrivals</h2><p>The next confirmed stays in your diary</p></div><Link href="/admin/bookings">All reservations <ArrowUpRight size={14}/></Link></div>
        {upcoming.length?<div className="ops-table-wrap"><table className="ops-table"><thead><tr><th>Guest</th><th>Room</th><th>Arrival</th><th>Status</th></tr></thead><tbody>{upcoming.map(r=><tr key={r.id}><td><Link href={"/admin/bookings/"+r.id} className="ops-guest"><span className="ops-avatar">{r.guestFirstName[0]}{r.guestLastName[0]}</span><span><strong>{r.guestFirstName} {r.guestLastName}</strong><small>{r.company||r.bookingReference}</small></span></Link></td><td>{r.room?.roomNumber||"Unassigned"}<small>{r.category.name}</small></td><td>{shortDate(r.checkIn)}<small>{Math.round((+r.checkOut-+r.checkIn)/86400000)} nights</small></td><td><StatusBadge status={r.status}/></td></tr>)}</tbody></table></div>:<EmptyState title="A quiet arrival diary" detail="Confirmed test reservations will appear here. Start with a test booking to walk through the staff journey." href="/admin/bookings/new" label="Create a test reservation"/>}
      </section>
      <section className="ops-panel"><div className="ops-panel-head"><div><h2>Needs your attention</h2><p>A focused list for the front desk</p></div><AlertCircle size={17} className="text-stone-400"/></div><div className="ops-panel-body">
        <Link href="/admin/bookings?view=cancellations" className="ops-attention-row"><span><strong>Cancellation requests</strong><p>Review and resolve guest requests</p></span><b>{attention}</b></Link>
        <Link href="/admin/housekeeping" className="ops-attention-row"><span><strong>Rooms awaiting inspection</strong><p>Active inventory not marked inspected</p></span><b>{readiness}</b></Link>
        <Link href="/admin/bookings?view=unpaid" className="ops-attention-row"><span><strong>Unpaid test balances</strong><p>Simulated only · no money collected</p></span><b>{unpaid}</b></Link>
      </div></section>
    </div>
    <div className="ops-grid-main">
      <section className="ops-panel"><div className="ops-panel-head"><div><h2>Occupancy outlook</h2><p>Confirmed room nights · next 14 days · excludes pending holds</p></div><span className="ops-pill neutral">{rooms} active rooms</span></div><div className="ops-panel-body"><div className="ops-bars">{days.map(d=><div className="ops-bar" key={+d.date} title={shortDate(d.date)+": "+d.count+" rooms"}><small>{d.count}</small><span style={{height:Math.max(3,rooms?d.count/rooms*100:0)+"%"}}/><small>{d.date.getUTCDate()}</small></div>)}</div><div className="ops-chart-note"><span>{shortDate(today)} – {shortDate(days[13].date)}</span><span>Based on saved test reservations</span></div></div></section>
      <section className="ops-panel"><div className="ops-panel-head"><div><h2>Recent activity</h2><p>Latest recorded staff and booking events</p></div></div><div className="ops-panel-body">{recent.length?recent.map(a=><div className="ops-activity" key={a.id}><p>{a.action}</p><small>{a.actor} · {a.createdAt.toLocaleString("en-ZA",{timeZone:"Africa/Johannesburg",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}</small></div>):<p className="text-xs text-stone-500">Activity appears as your team works.</p>}</div></section>
    </div>
    <section className="ops-panel"><div className="ops-panel-body flex flex-wrap items-center justify-between gap-6"><div className="flex gap-4 items-start"><span className="ops-metric-icon"><CreditCard size={24}/></span><div><h2 className="font-semibold text-sm">Operations now. Finance when you're ready.</h2><p className="ops-description">Payment provider awaiting confirmation. No real charges, refunds or email delivery are enabled.</p><p className="text-xs mt-2 text-stone-500">Simulated paid booking value, created in the last 30 days: {money(Math.round(Number(paid._sum.total||0)*100))}. Not recognised revenue.</p></div></div><Link href="/admin/suites/setup" className="ops-button secondary">Review launch requirements <ArrowRight size={15}/></Link></div></section>
    <p className="mt-5 text-[10px] text-stone-400">Updated {now.toLocaleTimeString("en-ZA",{timeZone:"Africa/Johannesburg",hour:"2-digit",minute:"2-digit"})} SAST · Refresh the page for the latest activity.</p>
  </div>;
}
