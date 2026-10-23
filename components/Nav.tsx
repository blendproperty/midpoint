"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Logo from "@/components/Logo";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Spaces", href: "/spaces" },
  { label: "Insights", href: "/insights" },
  { label: "Blog", href: "/blog" },
  { label: "Vacancies", href: "/vacancies" },
];

export default function Nav({ showStay = false }: { showStay?: boolean }) {
  // Editorial pages need a solid header even before the visitor scrolls.
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const editorial = ["/blog", "/insights"].some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  const isCurrent = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  const booking =
    pathname.startsWith("/stay") || pathname === "/manage-booking";
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

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
      if (e.key === "Escape") {
        setMobileOpen(false);
        menuButton.current?.focus();
      }
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
      aria-label="Main navigation"
      className={`fixed inset-x-0 top-0 z-50 w-full transition-[background-color,backdrop-filter,box-shadow] duration-300 ${
        editorial
          ? "bg-midpoint-dark shadow-md"
          : scrolled || mobileOpen || booking
          ? "bg-midpoint-dark/95 shadow-md backdrop-blur-md"
          : "bg-gradient-to-b from-midpoint-dark/80 to-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-6 text-white transition-[padding] duration-300 ${
          editorial ? "py-4" : scrolled ? "pb-3 pt-3" : "pb-4 pt-8"
        }`}
      >
        <Link
          href="/"
          aria-label="Midpoint home"
          onClick={closeMobile}
          className="shrink-0"
        >
          <Logo />
        </Link>

        <div className="hidden shrink-0 items-center gap-3 text-sm xl:flex">
          <a
            hidden={editorial}
            href="mailto:boitumelo@blendproperty.co.za"
            className="whitespace-nowrap rounded-full bg-midpoint-dark/60 px-4 py-2 backdrop-blur-sm transition-colors hover:bg-midpoint-dark/80"
          >
            boitumelo@blendproperty.co.za
          </a>
          <a
            href="tel:+27113809400"
            className={`whitespace-nowrap px-4 py-2 transition-colors hover:text-midpoint-cyan ${editorial ? "text-white/75" : "rounded-full bg-midpoint-dark/60 backdrop-blur-sm"}`}
          >
            Call us now&nbsp; +27 11 380 9400
          </a>
        </div>

        <div className="hidden shrink-0 items-center gap-5 xl:flex">
          {[
            ...navLinks,
            ...(showStay ? [{ label: "Book a Stay", href: "/the-suites-at-midpoint" }] : []),
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isCurrent(link.href) ? "page" : undefined}
              className="group relative rounded-sm py-2 text-sm font-medium transition-colors hover:text-midpoint-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-midpoint-cyan aria-[current=page]:text-midpoint-cyan"
            >
              {link.label}
              <span className={`absolute bottom-0 left-0 h-0.5 bg-midpoint-cyan transition-all duration-300 group-hover:w-full ${isCurrent(link.href) ? "w-full" : "w-0"}`} />
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
          ref={menuButton}
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav-panel"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm xl:hidden"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Inert keeps collapsed links out of the keyboard and accessibility tree. */}
      <div
        id="mobile-nav-panel"
        inert={!mobileOpen}
        className={`overflow-y-auto overscroll-contain transition-[max-height,opacity] duration-300 ease-out xl:hidden ${
          mobileOpen ? "max-h-[calc(100dvh-6rem)] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1 border-t border-white/10 bg-midpoint-dark/95 px-6 py-4 text-white backdrop-blur-md">
          {[
            ...navLinks,
            ...(showStay ? [{ label: "Book a Stay", href: "/the-suites-at-midpoint" }] : []),
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobile}
              aria-current={isCurrent(link.href) ? "page" : undefined}
              className="rounded-lg px-3 py-3 text-sm font-medium transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-midpoint-cyan aria-[current=page]:bg-white/10 aria-[current=page]:text-midpoint-cyan"
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
            <a
              href="mailto:boitumelo@blendproperty.co.za"
              className="text-white/80"
            >
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
