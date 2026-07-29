"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 w-full transition-[background-color,backdrop-filter,box-shadow] duration-300 ${
        scrolled
          ? "bg-midpoint-dark/95 shadow-md backdrop-blur-md"
          : "bg-gradient-to-b from-midpoint-dark/80 to-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-6 text-white transition-[padding] duration-300 ${
          scrolled ? "pb-3 pt-3" : "pb-4 pt-8"
        }`}
      >
        <Link href="/" aria-label="Midpoint home">
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

        {/* TODO: mobile menu toggle */}
      </div>
    </nav>
  );
}
