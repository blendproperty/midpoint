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
  return (
    <nav className="fixed inset-x-0 top-0 z-50 w-full bg-gradient-to-b from-midpoint-dark/80 to-transparent">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 pb-4 pt-8 text-white">
        <Link href="/" aria-label="Midpoint home">
          <Logo />
        </Link>

        <div className="hidden items-center gap-4 text-sm md:flex">
          <a
            href="mailto:boitumelo@blendproperty.co.za"
            className="rounded-full bg-midpoint-dark/60 px-4 py-2 backdrop-blur-sm"
          >
            boitumelo@blendproperty.co.za
          </a>
          <a href="tel:+27113809400" className="rounded-full bg-midpoint-dark/60 px-4 py-2 backdrop-blur-sm">
            Call us now&nbsp; +27 11 380 9400
          </a>
        </div>

        <div className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium">
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact-us"
            className="rounded-full bg-midpoint-cyan px-5 py-2 text-sm font-semibold text-midpoint-dark"
          >
            Enquire
          </Link>
        </div>

        {/* TODO: mobile menu toggle */}
      </div>
    </nav>
  );
}
