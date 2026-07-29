"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Logo from "@/components/Logo";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Spaces", href: "/spaces" },
  { label: "Insights", href: "/insights" },
  { label: "Vacancies", href: "/vacancies" },
  { label: "Explore", href: "/#explore" },
];

export default function Nav() {
  // The header sits over the hero photo, so it starts transparent by
  // design. But once the page scrolls, a transparent/gradient-only nav
  // has nothing behind it and visually smears into whatever section
  // copy happens to be underneath (reported bug: nav links overlapping
  // body text further down the page). Track scroll position and swap to
  // a solid, blurred bar as soon as the hero is behind us.
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on Escape, and lock background scroll while the panel is open —
  // otherwise the page behind it scrolls along with a fixed-position menu.
  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 w-full transition-[background-color,backdrop-filter,box-shadow] duration-300 ${
        scrolled || mobileOpen
          ? "bg-midpoint-dark/95 shadow-md backdrop-blur-md"
          : "bg-gradient-to-b from-midpoint-dark/80 to-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-6 text-white transition-[padding] duration-300 ${
          scrolled ? "pb-3 pt-3" : "pb-4 pt-8"
        }`}
      >
        <Link href="/" aria-label="Midpoint home" onClick={closeMobile}>
          <Logo />
        </Link>

        <div className="hidden items-center gap-4 text-sm md:flex">
          <a
            href="mailto:boitumelo@blendproperty.co.za"
            className="rounded-full bg-midpoint-dark/60 px-4 py-2 backdrop-blur-sm transition-colors hover:bg-midpoint-dark/80"
          >
            boitumelo@blendproperty.co.za
          </a>
          <a
            href="tel:+27113809400"
            className="rounded-full bg-midpoint-dark/60 px-4 py-2 backdrop-blur-sm transition-colors hover:bg-midpoint-dark/80"
          >
            Call us now&nbsp; +27 11 380 9400
          </a>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="group relative text-sm font-medium">
              {link.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-midpoint-cyan transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          <Link
            href="/contact-us"
            className="rounded-full bg-midpoint-cyan px-5 py-2 text-sm font-semibold text-midpoint-dark transition-transform hover:scale-105"
          >
            Enquire
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-panel"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm md:hidden"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile panel: same links/contact/CTA as desktop, just stacked.
          Animated open/closed with a max-height + opacity transition rather
          than mount/unmount, so it stays keyboard/focus reachable and the
          transition is smooth in both directions. */}
      <div
        id="mobile-nav-panel"
        className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out md:hidden ${
          mobileOpen ? "max-h-[28rem] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1 border-t border-white/10 bg-midpoint-dark/95 px-6 py-4 text-white backdrop-blur-md">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobile}
              className="rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-white/10"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/contact-us"
            onClick={closeMobile}
            className="mt-2 rounded-full bg-midpoint-cyan px-5 py-3 text-center text-sm font-semibold text-midpoint-dark"
          >
            Enquire
          </Link>

          <div className="mt-4 flex flex-col gap-2 border-t border-white/10 pt-4 text-sm">
            <a href="mailto:boitumelo@blendproperty.co.za" className="text-white/80">
              boitumelo@blendproperty.co.za
            </a>
            <a href="tel:+27113809400" className="text-white/80">
              Call us now&nbsp; +27 11 380 9400
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
