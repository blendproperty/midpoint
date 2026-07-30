import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import Script from "next/script";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import { site } from "@/lib/site";
import { getSiteSettings } from "@/lib/site-settings";
import { getFaqs } from "@/lib/faqs";

export const dynamic = "force-dynamic";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-primary",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    metadataBase: new URL(settings.domain),
    title: {
      default: settings.siteName,
      template: settings.defaultTitleTemplate,
    },
    description: settings.defaultMetaDescription,
    keywords: settings.defaultKeywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean),
    applicationName: settings.siteName,
    verification: {
      google: settings.googleVerification || undefined,
      other: settings.bingVerification
        ? { "msvalidate.01": settings.bingVerification }
        : undefined,
    },
    openGraph: {
      type: "website",
      locale: "en_ZA",
      siteName: settings.siteName,
      url: settings.domain,
      title: settings.siteName,
      description: settings.defaultMetaDescription,
      images: [{ url: settings.defaultSocialImage, width: 1600, height: 900 }],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.siteName,
      description: settings.defaultMetaDescription,
      images: [settings.defaultSocialImage],
    },
    robots: {
      index: settings.allowIndexing,
      follow: settings.allowIndexing,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [settings, faqs] = await Promise.all([getSiteSettings(), getFaqs()]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${settings.domain}/#website`,
        url: settings.domain,
        name: settings.siteName,
        publisher: { "@id": `${settings.domain}/#localbusiness` },
      },
      {
        "@type": "LocalBusiness",
        "@id": `${settings.domain}/#localbusiness`,
        name: settings.siteName,
        url: settings.domain,
        image: settings.defaultSocialImage,
        telephone: settings.phone,
        email: settings.email,
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
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };

  return (
    <html lang="en" className={figtree.variable}>
      <GoogleTagManager gtmId={settings.tagManagerId} />
      {settings.googleAnalyticsId ? <GoogleAnalytics gaId={settings.googleAnalyticsId} /> : null}
      {settings.clarityId ? (
        <Script id="ms-clarity" strategy="afterInteractive">
          {`(function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${settings.clarityId}");`}
        </Script>
      ) : null}
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteChrome whatsapp={settings.whatsapp} whatsappTemplate={settings.whatsappTemplate}>
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
