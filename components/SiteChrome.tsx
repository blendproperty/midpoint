"use client";

import { usePathname } from "next/navigation";
import Nav from "@/components/Nav";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import PageViewTracker from "@/components/PageViewTracker";
import WhatsAppButton from "@/components/WhatsAppButton";

type Props = {
  children: React.ReactNode;
  whatsapp: string;
  whatsappTemplate: string;
};

// The admin dashboard has its own sidebar/layout (app/admin/(protected)/layout.tsx
// and app/admin/login/page.tsx) and should never show the public site's
// Nav/ContactSection/Footer. Since the whole app shares one root layout
// (app/layout.tsx, which owns <html>/<body>), this client-side check is the
// simplest way to opt /admin/* out without restructuring into multiple root
// layouts.
export default function SiteChrome({ children, whatsapp, whatsappTemplate }: Props) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin") ?? false;

  if (isAdmin) {
    return <>{children}</>;
  }

  // /contact-us already has its own dedicated contact form (hero + dark
  // intro section) — showing the shared footer ContactSection underneath it
  // as well would just repeat the same form twice on the one page where it's
  // most obviously redundant. Every other page still gets the shared section.
  const isContactPage = pathname === "/contact-us";

  return (
    <>
      <PageViewTracker />
      <Nav />
      <main>{children}</main>
      {!isContactPage && <ContactSection />}
      <Footer />
      <WhatsAppButton phone={whatsapp} message={whatsappTemplate} />
    </>
  );
}
