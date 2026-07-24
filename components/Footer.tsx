import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-midpoint-dark px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-bold md:text-4xl">Contact</h2>
        <p className="mt-4 max-w-xl text-midpoint-grey-400">
          Positioned in Midrand between Johannesburg and Pretoria, with the
          infrastructure, warehouses, offices, and amenities your team needs
          to thrive.
        </p>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-sm uppercase tracking-wide text-midpoint-grey-400">
              Contact Info
            </h3>
            <p className="mt-2">
              <a href="tel:+27113809400">+27 11 380 9400</a>
            </p>
            <p>
              <a href="mailto:boitumelo@blendproperty.co.za">
                boitumelo@blendproperty.co.za
              </a>
            </p>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-wide text-midpoint-grey-400">
              Address
            </h3>
            <p className="mt-2">
              162 Tonetti Street, Halfway House,
              <br />
              Midrand, 1685
            </p>
          </div>

          <div>
            <h3 className="text-sm uppercase tracking-wide text-midpoint-grey-400">
              Explore
            </h3>
            <ul className="mt-2 space-y-1">
              <li><Link href="/#explore">Explore</Link></li>
              <li><Link href="/amenities">Amenities</Link></li>
              <li><Link href="/availability-report">Availability Report</Link></li>
              <li><Link href="/contact-us">Contact</Link></li>
              <li><Link href="/faqs">FAQ&apos;s</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-white/10 pt-6 text-xs text-midpoint-grey-400 md:flex-row">
          <p>© {new Date().getFullYear()} Midpoint District. All Rights Reserved.</p>
          <Link href="/privacy-policy">Privacy Policy</Link>
        </div>

        <p className="mt-6 text-xs text-midpoint-grey-400">
          *Some images displayed on this website are for illustrative and
          representational purposes only. They are intended to provide a
          general concept of the design, ambiance, and vision for the
          project. As many of the buildings are still under construction,
          the final appearance, features, and amenities may vary.
        </p>
      </div>
    </footer>
  );
}
