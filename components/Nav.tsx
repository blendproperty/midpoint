import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Spaces", href: "/offices" }, // TODO: confirm final target once /spaces vs pillar links finalized
  { label: "Insights", href: "/insights" },
  { label: "Vacancies", href: "/vacancies" },
  { label: "Explore", href: "/#explore" },
];

export default function Nav() {
  return (
    <nav className="w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          {/* TODO: replace with actual logo asset */}
          <span>Midpoint</span>
        </Link>

        <div className="hidden items-center gap-4 text-sm md:flex">
          <a
            href="mailto:boitumelo@blendproperty.co.za"
            className="rounded-full bg-midpoint-cyan/20 px-4 py-2"
          >
            boitumelo@blendproperty.co.za
          </a>
          <a href="tel:+27113809400" className="rounded-full bg-midpoint-cyan/20 px-4 py-2">
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
