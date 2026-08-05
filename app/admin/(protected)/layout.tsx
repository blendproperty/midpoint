import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import SignOutButton from "@/components/admin/SignOutButton";

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/contacts", label: "Contacts" },
    { href: "/admin/enquiries", label: "Enquiries" },
    { href: "/admin/pages", label: "Pages" },
    { href: "/admin/vacancies", label: "Vacancies" },
    { href: "/admin/faqs", label: "FAQs" },
    { href: "/admin/seo-audit", label: "SEO Audit" },
    { href: "/admin/schema-tool", label: "Schema Tool" },
    { href: "/admin/redirects", label: "Redirects" },
    { href: "/admin/media", label: "Media" },
    { href: "/admin/settings", label: "Site Settings" },
    ...(session.role === "SUPER_ADMIN" ? [{ href: "/admin/users", label: "Users" }] : []),
  ];

  return (
    <div className="admin-shell flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="w-64 shrink-0 overflow-y-auto bg-midpoint-dark text-white">
        <div className="p-6">
          <p className="text-lg font-semibold">Midpoint Admin</p>
          <p className="mt-1 text-xs text-white/60">{session.email}</p>
        </div>
        <nav className="space-y-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={false}
              className="block rounded-lg px-3 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 px-3">
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
