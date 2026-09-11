import Link from "next/link";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { PageHeading, EmptyState } from "@/components/admin/OperationsUI";
import { pageNumber, shortDate } from "@/lib/suites-operations";
export default async function Page({searchParams}:{searchParams:Promise<{q?:string;page?:string}>}){
  await requireAdmin();const q=await searchParams,term=(q.q||"").trim().slice(0,120);
  const filter=term?Prisma.sql`AND ("guestEmail" ILIKE ${"%"+term+"%"} OR "guestFirstName" ILIKE ${"%"+term+"%"} OR "guestLastName" ILIKE ${"%"+term+"%"} OR "company" ILIKE ${"%"+term+"%"})`:Prisma.empty;
  const counts=await prisma.$queryRaw<{total:bigint}[]>(Prisma.sql`SELECT COUNT(DISTINCT "guestEmail") AS total FROM "Reservation" WHERE "isTest"=true ${filter}`);
  const total=Number(counts[0].total),pages=Math.max(1,Math.ceil(total/20)),page=Math.min(pageNumber(q.page),pages);
  const rows=await prisma.$queryRaw<{guestEmail:string;guestFirstName:string;guestLastName:string;company:string|null;stays:bigint;lastStay:Date}[]>(Prisma.sql`
    WITH matches AS (SELECT * FROM "Reservation" WHERE "isTest"=true ${filter}),
    latest AS (SELECT DISTINCT ON ("guestEmail") "guestEmail","guestFirstName","guestLastName","company" FROM matches ORDER BY "guestEmail","createdAt" DESC,"id" DESC),
    totals AS (SELECT "guestEmail",COUNT(*) AS stays,MAX("checkIn") AS "lastStay" FROM matches GROUP BY "guestEmail")
    SELECT latest.*,totals.stays,totals."lastStay" FROM latest JOIN totals USING ("guestEmail")
    ORDER BY totals."lastStay" DESC,latest."guestEmail" LIMIT 20 OFFSET ${(page-1)*20}`);
  const url=(n:number)=>"/admin/guests?"+new URLSearchParams({q:term,page:String(n)});
  return <><PageHeading title="Know who's staying." description="Guest records grouped by email from test reservations. Open a record to review the matching booking history."/><section className="ops-panel"><form className="ops-toolbar"><label className="ops-search">Find a guest<input name="q" defaultValue={term} maxLength={120} placeholder="Name, email or company"/></label><button className="ops-button">Search guests</button><Link href="/admin/guests" className="text-xs underline p-3">Reset</Link></form>{rows.length?<div className="ops-table-wrap"><table className="ops-table"><thead><tr><th>Guest</th><th>Email</th><th>Company</th><th>Matching bookings</th><th>Latest arrival</th><th/></tr></thead><tbody>{rows.map(g=><tr key={g.guestEmail}><td><div className="ops-guest"><span className="ops-avatar">{g.guestFirstName[0]}{g.guestLastName[0]}</span><strong>{g.guestFirstName} {g.guestLastName}</strong></div></td><td>{g.guestEmail}</td><td>{g.company||"—"}</td><td>{String(g.stays)}</td><td>{shortDate(g.lastStay)} {g.lastStay.getUTCFullYear()}</td><td><Link href={"/admin/bookings?q="+encodeURIComponent(g.guestEmail)} className="text-xs underline">View bookings →</Link></td></tr>)}</tbody></table></div>:<EmptyState title="No matching guests" detail="Guest records appear when reservations are created. Try another search or create a test reservation."/>}<div className="ops-pagination"><span>{total} matching guest records</span><div className="flex items-center gap-3">{page>1&&<Link className="ops-button secondary" href={url(page-1)}>Previous</Link>}Page {page} of {pages}{page<pages&&<Link className="ops-button secondary" href={url(page+1)}>Next</Link>}</div></div></section></>;
}
