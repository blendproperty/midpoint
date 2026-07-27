import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";
import "./globals.css";
import Nav from "@/components/Nav";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { site } from "@/lib/site";
import { faqs } from "@/lib/faqs";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-primary",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: "Midpoint Midrand | Warehouse & Office Space in Gauteng",
    template: "%s | Midpoint Midrand",
  },
  description:
    "Secure warehouse, office & serviced office space in Midrand. Central location between JHB & PTA with N1 access, gym, padel courts & amenities.",
  openGraph: {
    type: "website",
    siteName: site.name,
    url: site.domain,
  },
  twitter: { card: "summary_large_image" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Place",
      name: site.name,
      telephone: site.phone,
      email: site.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: `${site.address.street}, ${site.address.suburb}`,
        addressLocality: site.address.city,
        postalCode: site.address.postalCode,
        addressCountry: site.address.country,
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: site.geo.lat,
        longitude: site.geo.lng,
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer.join(" ") },
      })),
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={figtree.variable}>
      <GoogleTagManager gtmId={site.gtmId} />
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Nav />
        <main>{children}</main>
        <ContactSection />
        <Footer />
      </body>
    </html>
  );
}
