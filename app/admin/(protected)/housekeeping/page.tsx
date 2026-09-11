import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { PageHeading, Notice, StatusBadge, EmptyState } from "@/components/admin/OperationsUI";
import { housekeepingStates } from "@/lib/suites-operations";
import { saveReadiness } from "../suites/actions";
export default async function Page({searchParams}:{searchParams:Promise<{state?:string;error?:string;saved?:string}>}){
  await requireAdmin();const q=await searchParams;
  const rooms=await prisma.room.findMany({include:{category:true},orderBy:{roomNumber:"asc"}});
  const filtered=housekeepingStates.includes(q.state as typeof housekeepingStates[number])?rooms.filter(r=>r.housekeeping===q.state):rooms;
  return <><PageHeading title="Ready for the next arrival." description="A shared housekeeping and inspection board. Keep the room status and handover notes current."><Link href="/admin/calendar" className="ops-button secondary">Open room calendar</Link></PageHeading>
    <Notice>Readiness is a staff checklist, separate from availability. Use calendar maintenance blocks to prevent a room being reserved. All rooms start unassessed—nothing is marked inspected automatically.</Notice>
    {q.error&&<div role="alert" className="ops-notice amber">{q.error}</div>}{q.saved&&<div role="status" className="ops-notice">Room readiness saved.</div>}
    <div className="ops-tabs"><Link href="/admin/housekeeping" aria-current={!q.state?"page":undefined}>All rooms · {rooms.length}</Link>{housekeepingStates.map(s=><Link key={s} href={"/admin/housekeeping?state="+s} aria-current={q.state===s?"page":undefined}>{s.toLowerCase()} · {rooms.filter(r=>r.housekeeping===s).length}</Link>)}</div>
    <div className="ops-room-grid">{filtered.map(r=><form key={r.id} action={saveReadiness.bind(null,r.id)} className="ops-room-card"><div className="flex justify-between items-start"><div><h2>{r.roomNumber}</h2><p>{r.category?.name||"Unassigned"}{r.floor?" · "+r.floor:""}</p></div><StatusBadge status={r.status}/></div><StatusBadge status={r.housekeeping}/><label>Readiness<select name="state" defaultValue={r.housekeeping}>{housekeepingStates.map(s=><option key={s} value={s}>{s.toLowerCase()}</option>)}</select></label><label>Handover note<textarea name="note" defaultValue={r.housekeepingNote||""} maxLength={1000} rows={2} placeholder="Inspection or housekeeping notes"/></label><button className="ops-button">Save room readiness</button><p className="mt-3 !text-[9px]">{r.housekeepingAt?"Updated "+r.housekeepingAt.toLocaleString("en-ZA",{timeZone:"Africa/Johannesburg"})+" by "+r.housekeepingBy:"No inspection recorded yet"}</p></form>)}</div>
    {!filtered.length&&<EmptyState title="No rooms in this state" detail="Choose another filter to see the rest of your inventory."/>}
  </>;
}
