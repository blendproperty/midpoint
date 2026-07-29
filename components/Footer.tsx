import Link from "next/link";
import Logo from "@/components/Logo";
import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="bg-midpoint-dark px-6 py-12 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-10 border-b border-white/10 pb-10 md:flex-row md:items-start">
          <div>
            <Logo className="h-8 w-auto" />
            <p className="mt-4 text-xs text-midpoint-grey-400">
              © {new Date().getFullYear()} Midpoint District. All Rights Reserved.
            </p>
            <div className="mt-4 space-y-1 text-sm text-midpoint-grey-400">
              <p>
                <a href={site.phoneHref} className="hover:text-white">{site.phone}</a>
              </p>
              <p>
                <a href={site.emailHref} className="hover:text-white">{site.email}</a>
              </p>
              <p>
                {site.address.street}, {site.address.suburb}, {site.address.city}, {site.address.postalCode}
              </p>
            </div>
          </div>

          <div className="flex gap-16 text-sm">
            <ul className="space-y-2">
              <li><Link href="/#explore">Explore</Link></li>
              <li><Link href="/amenities">Amenities</Link></li>
              <li><Link href="/vacancies">Vacancies</Link></li>
              <li><Link href="/contact-us">Contact</Link></li>
              <li><Link href="/faqs">FAQ&apos;s</Link></li>
            </ul>
            <ul>
              <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            </ul>
          </div>
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
