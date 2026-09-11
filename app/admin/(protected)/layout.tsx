import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import AdminWorkspace from "@/components/admin/AdminWorkspace";
import "../operations.css";
export const metadata = { title: "Staff workspace | The Suites at Midpoint", robots: { index: false, follow: false } };

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const navItems = [
    { href: "/admin?workspace=website", label: "Website dashboard" },
    { href: "/admin/contacts", label: "Contacts" },
    { href: "/admin/enquiries", label: "Enquiries" },
    { href: "/admin/pages", label: "Pages" },
    { href: "/admin/vacancies", label: "Vacancies" },
    { href: "/admin/rooms", label: "Suite Inventory" },
    { href: "/admin/bookings", label: "Bookings" },
    { href: "/admin/calendar", label: "Room Calendar" },
    { href: "/admin/rates", label: "Rates & Policies" },
    { href: "/admin/faqs", label: "FAQs" },
    { href: "/admin/seo-audit", label: "SEO Audit" },
    { href: "/admin/schema-tool", label: "Schema Tool" },
    { href: "/admin/redirects", label: "Redirects" },
    { href: "/admin/media", label: "Media" },
    { href: "/admin/settings", label: "Site Settings" },
    ...(session.role === "SUPER_ADMIN"
      ? [{ href: "/admin/users", label: "Users" }]
      : []),
  ];

  return <AdminWorkspace email={session.email} navItems={navItems}>{children}</AdminWorkspace>;
}
