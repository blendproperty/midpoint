import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { todayZA } from "@/lib/stay-pricing";
import { PageHeading, Notice } from "@/components/admin/OperationsUI";
import NewSuiteBooking from "@/components/admin/NewSuiteBooking";
import Link from "next/link";
export default async function Page(){
  await requireAdmin();
  const categories=await prisma.roomCategory.findMany({where:{active:true},select:{id:true,name:true},orderBy:{code:"asc"}});
  return <><PageHeading title="New test reservation" description="Create a staff-assisted stay using the same availability and pricing rules as the guest website."><Link href="/admin/bookings" className="ops-button secondary">Back to reservations</Link></PageHeading><Notice>Staging only. This creates a confirmed, unpaid test reservation. It does not collect money or send an email.</Notice><div className="ops-panel max-w-4xl"><div className="ops-panel-head"><h2>Stay & guest details</h2><span className="ops-pill amber">Test mode</span></div><div className="ops-panel-body"><NewSuiteBooking categories={categories} requestKey={randomUUID()} today={todayZA()}/></div></div></>;
}
