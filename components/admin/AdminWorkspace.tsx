"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { LayoutDashboard, CalendarDays, BedDouble, BookOpen, Users, Settings2, ArrowUpRight, Menu, X, ClipboardCheck, CreditCard, Globe, PanelLeftClose } from "lucide-react";
import SignOutButton from "./SignOutButton";
import Logo from "@/components/Logo";
const suiteLinks = [
  { href: "/admin/suites", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "Reservations", icon: BookOpen },
  { href: "/admin/calendar", label: "Room calendar", icon: CalendarDays },
  { href: "/admin/housekeeping", label: "Room readiness", icon: ClipboardCheck },
  { href: "/admin/guests", label: "Guest directory", icon: Users },
  { href: "/admin/rooms", label: "Rooms & categories", icon: BedDouble },
  { href: "/admin/rates", label: "Rates & policies", icon: Settings2 },
  { href: "/admin/suites/setup", label: "Finance & launch", icon: CreditCard },
];
export default function AdminWorkspace({ children, email, navItems }: { children: ReactNode; email: string; navItems: {href:string;label:string}[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const sidebar=useRef<HTMLElement>(null);
  useEffect(()=>{
    if(!open) return;
    const previous=document.activeElement as HTMLElement|null;
    const overflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    sidebar.current?.querySelector<HTMLElement>("a")?.focus();
    const keys=(e:KeyboardEvent)=>{
      if(e.key==="Escape") setOpen(false);
      if(e.key==="Tab"){
        const focusable=Array.from(sidebar.current?.querySelectorAll<HTMLElement>('a,button,summary,input,select,textarea')||[]).filter(el=>el.getClientRects().length>0);
        const first=focusable[0],last=focusable[focusable.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
      }
    };
    const resize=()=>{if(window.innerWidth>=1024)setOpen(false);};
    document.addEventListener("keydown",keys);window.addEventListener("resize",resize);
    return ()=>{document.body.style.overflow=overflow;document.removeEventListener("keydown",keys);window.removeEventListener("resize",resize);previous?.focus();};
  },[open]);
  const suites = suiteLinks.some(l => pathname === l.href || pathname.startsWith(l.href + "/"));
  const current = [...suiteLinks].reverse().find(l => pathname === l.href || pathname.startsWith(l.href + "/"))?.label || "Website management";
  return <div className={"admin-shell operations-shell" + (suites ? " suites-workspace" : "")}>
    {open && <button className="ops-backdrop" aria-label="Close navigation" onClick={()=>setOpen(false)}/>}
    <aside ref={sidebar} id="admin-sidebar" className={"ops-sidebar" + (open ? " is-open" : "")}>
      <Link href="/admin/suites" className="ops-brand" aria-label="The Suites at Midpoint overview" onClick={()=>setOpen(false)}><span><Logo className="h-7 w-auto mb-4"/><span className="text-xs tracking-[.17em]">THE SUITES AT MIDPOINT</span></span></Link>
      <button className="ops-close" aria-label="Close navigation" onClick={()=>setOpen(false)}><X size={20}/></button>
      <div className="ops-property"><span className="ops-property-dot"/><div>Midpoint, Midrand<small>Accommodation workspace</small></div><BedDouble size={18}/></div>
      <nav aria-label="Suites administration">
        <p className="ops-nav-label">OPERATIONS</p>
        {suiteLinks.map(({href,label,icon:Icon}) => <Link key={href} href={href} prefetch={false} onClick={()=>setOpen(false)} aria-current={(pathname===href || (href!=="/admin/suites" && pathname.startsWith(href+"/")))?"page":undefined} className="ops-nav-link"><Icon size={18}/>{label}</Link>)}
        <details className="ops-site-nav" open={!suites}><summary><Globe size={17}/>Website management</summary><div>{navItems.filter(l=>!suiteLinks.some(s=>s.href===l.href)).map(l=><Link key={l.href} href={l.href} onClick={()=>setOpen(false)} className="ops-nav-link" aria-current={pathname===l.href?"page":undefined}>{l.label}</Link>)}</div></details>
      </nav>
      <div className="ops-sidebar-foot"><p>PRE-LAUNCH WORKSPACE</p><span>Test reservations only.<br/>Finance is not connected.</span><Link href="/the-suites-at-midpoint" target="_blank" rel="noreferrer">Preview guest experience <ArrowUpRight size={15}/></Link></div>
      <div className="ops-user"><span className="ops-avatar">{email.slice(0,1).toUpperCase()}</span><div><strong>Staff workspace</strong><small title={email}>{email}</small></div><SignOutButton/></div>
    </aside>
    <div className="ops-body" inert={open ? true : undefined}>
      <header className="ops-topbar"><div className="flex items-center gap-3"><button className="ops-menu" aria-label="Open admin navigation" onClick={()=>setOpen(true)}><Menu size={21}/></button><PanelLeftClose className="hidden lg:block text-stone-400" size={18}/><span className="text-stone-400">Workspace</span><span className="text-stone-300">/</span><strong>{current}</strong></div><div className="flex items-center gap-3"><span className="ops-pill amber">Staging · test mode</span><Link className="ops-top-preview" href="/the-suites-at-midpoint" target="_blank" rel="noreferrer">Preview site <ArrowUpRight size={15}/></Link></div></header>
      <main className="ops-main">{children}</main>
      <footer className="ops-footer"><span>The Suites at Midpoint · Staff administration</span><span>Africa/Johannesburg · ZAR</span></footer>
    </div>
  </div>;
}
