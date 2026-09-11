import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, Inbox } from "lucide-react";
export function PageHeading({eyebrow="THE SUITES AT MIDPOINT",title,description,children}:{eyebrow?:string;title:string;description:string;children?:ReactNode}) {
  return <div className="ops-page-heading"><div><p className="ops-eyebrow">{eyebrow}</p><h1>{title}</h1><p className="ops-description">{description}</p></div><div className="flex flex-wrap gap-2">{children}</div></div>;
}
export function StatusBadge({status}:{status:string}) {
  const tone = ["CONFIRMED","INSPECTED","PAID","CHECKED_IN"].includes(status)?"green":["PENDING","DIRTY","CLEAN","UNPAID","UNASSESSED"].includes(status)?"amber":["CANCELLED","OUT_OF_SERVICE","MAINTENANCE"].includes(status)?"red":"neutral";
  return <span className={"ops-pill "+tone}>{status.toLowerCase().replaceAll("_"," ")}</span>;
}
export function EmptyState({title,detail,href,label}:{title:string;detail:string;href?:string;label?:string}) {
  return <div className="ops-empty"><span><Inbox size={25}/></span><h3>{title}</h3><p>{detail}</p>{href&&<Link href={href} className="ops-button secondary">{label}<ArrowUpRight size={15}/></Link>}</div>;
}
export function Metric({label,value,detail,icon,href}:{label:string;value:string|number;detail:string;icon:ReactNode;href?:string}) {
  const body=<><div className="ops-metric-top"><span>{label}</span><span className="ops-metric-icon">{icon}</span></div><strong>{value}</strong><p>{detail}</p></>;
  return href?<Link href={href} className="ops-metric">{body}</Link>:<div className="ops-metric">{body}</div>;
}
export function Notice({children,tone="info"}:{children:ReactNode;tone?:string}){return <div className={"ops-notice "+tone}>{children}</div>;}
