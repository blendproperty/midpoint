import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-primary",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Midpoint Midrand | Warehouse & Office Space in Gauteng",
  description:
    "Secure warehouse, office & serviced office space in Midrand. Central location between JHB & PTA with N1 access, gym, padel courts & amenities.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={figtree.variable}>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
