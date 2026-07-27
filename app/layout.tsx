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

// Default social-share image, reused site-wide as the OG/Twitter fallback
// whenever a page doesn't set its own. Same pattern listings.blendproperty.co.za
// uses (a single configurable defaultSocialImage).
const DEFAULT_SOCIAL_IMAGE =
  "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a148a5463dac69c69cbc3a8_amenities_banner-p-1600.jpg";

// Indexing + search-console verification are env-driven so they can be
// turned on/off or rotated without a code change — mirrors the
// site-settings.ts pattern on listings.blendproperty.co.za (allowIndexing,
// googleVerification, bingVerification).
const ALLOW_INDEXING = process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "false";

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: "Midpoint Midrand | Warehouse & Office Space in Gauteng",
    template: "%s | Midpoint Midrand",
  },
  description:
    "Secure warehouse, office & serviced office space in Midrand. Central location between JHB & PTA with N1 access, gym, padel courts & amenities.",
  keywords: [
    "office space Midrand",
    "warehouse to rent Midrand",
    "serviced offices Midrand",
    "business park Midrand",
    "commercial property Midrand",
    "Midpoint Business Park"
  ],
  applicationName: site.name,
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    siteName: site.name,
    url: site.domain,
    title: site.name,
    description:
      "Secure warehouse, office & serviced office space in Midrand, between Johannesburg and Pretoria.",
    images: [{ url: DEFAULT_SOCIAL_IMAGE, width: 1600, height: 900 }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description:
      "Secure warehouse, office & serviced office space in Midrand, between Johannesburg and Pretoria.",
    images: [DEFAULT_SOCIAL_IMAGE],
  },
  robots: {
    index: ALLOW_INDEXING,
    follow: ALLOW_INDEXING,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${site.domain}/#website`,
      url: site.domain,
      name: site.name,
      publisher: { "@id": `${site.domain}/#localbusiness` },
    },
    {
      "@type": "LocalBusiness",
      "@id": `${site.domain}/#localbusiness`,
      name: site.name,
      url: site.domain,
      image: DEFAULT_SOCIAL_IMAGE,
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
