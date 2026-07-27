"use client";

import { usePathname } from "next/navigation";
import Nav from "@/components/Nav";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

// The admin dashboard has its own sidebar/layout (app/admin/(protected)/layout.tsx
// and app/admin/login/page.tsx) and should never show the public site's
// Nav/ContactSection/Footer. Since the whole app shares one root layout
// (app/layout.tsx, which owns <html>/<body>), this client-side check is the
// simplest way to opt /admin/* out without restructuring into multiple root
// layouts.
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Nav />
      <main>{children}</main>
      <ContactSection />
      <Footer />
    </>
  );
}
