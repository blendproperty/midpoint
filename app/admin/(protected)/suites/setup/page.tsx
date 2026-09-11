import Link from "next/link";
import { requireAdmin } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { PageHeading, Notice } from "@/components/admin/OperationsUI";
import { ShieldCheck, CreditCard } from "lucide-react";
export default async function Page(){
  await requireAdmin();
  const [rooms,categories]=await Promise.all([prisma.room.count(),prisma.roomCategory.count()]);
  const steps=[
    ["01","Payment provider","Awaiting decision","Confirm Netcash or another provider with finance. Merchant entity, fees, settlement, refund process and reconciliation requirements must be approved before integration."],
    ["02","Rooms & opening date","Approval required",rooms+" physical room records and "+categories+" categories are configured for testing. Confirm final numbering, category split, capacity, inclusions and first bookable date."],
    ["03","Rates & booking policies","Provisional","Approve tariffs, discounts, tax treatment, deposits, cancellation terms and corporate account eligibility. Current settings are sample test values."],
    ["04","Guest communication","Preview only","Confirm sender identity and email templates, connect delivery, then test confirmations, amendments and cancellations. Current messages are captured previews and are not emailed."],
    ["05","Operational sign-off","UAT required","Run staff acceptance tests for arrivals, departures, room moves, maintenance, cancellations, reconciliation and failure recovery. Confirm access, training and support ownership."],
    ["06","Production activation","Not enabled","A separate approved launch will enable real bookings. Staging noindex and production booking exclusion remain in place. Completing a checklist does not activate payments."],
  ];
  return <><PageHeading title="Ready when the business is." description="A transparent view of what is built, what is simulated and what needs a decision before launch."/><Notice tone="amber">Finance is not connected. This workspace cannot collect real money, issue a real refund or confirm an operational stay.</Notice><div className="ops-grid-main"><section className="ops-panel"><div className="ops-panel-head"><h2>Launch requirements</h2><ShieldCheck size={18}/></div><div className="ops-panel-body">{steps.map(([n,title,status,desc])=><div className="ops-setup-step" key={n}><span>{n}</span><div><h3>{title}</h3><p>{desc}</p></div><span className="ops-pill amber !w-auto !h-auto">{status}</span></div>)}</div></section><div className="space-y-5"><section className="ops-panel"><div className="ops-panel-body"><CreditCard size={30} className="text-stone-400 mb-5"/><h2 className="text-lg font-semibold">Payment integration</h2><p className="ops-description">Provider decision pending. No credentials or card details are collected here.</p><div className="mt-5"><span className="ops-pill amber">Not connected</span></div><p className="ops-description mt-5">Required: hosted checkout, signed payment notifications, amount verification, idempotent settlement, refund handling and finance reconciliation.</p></div></section><section className="ops-panel"><div className="ops-panel-head"><h2>Configure the experience</h2></div><div className="ops-panel-body space-y-3"><Link href="/admin/rooms" className="ops-button secondary w-full">Rooms & categories →</Link><Link href="/admin/rates" className="ops-button secondary w-full">Rates & policies →</Link><Link href="/admin/bookings/new" className="ops-button secondary w-full">Try a staff reservation →</Link></div></section></div></div></>;
}
