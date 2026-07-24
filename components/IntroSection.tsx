import Link from "next/link";
import Logo from "@/components/Logo";

export default function IntroSection() {
  return (
    <section id="introduction" className="bg-midpoint-dark px-6 py-16 text-white">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <div className="flex justify-center lg:justify-start">
          <Logo className="h-auto w-full max-w-md" />
        </div>

        <div>
          <p className="font-semibold">
            Midpoint offers businesses a secure, well-connected location. It delivers a mix of warehouse space, offices, and serviced offices in Midrand, supported by lifestyle amenities that make the workday easier. Midpoint is the prime estate for companies looking for industrial space, logistics facilities, or office space. Enjoy flexible leasing options and strong connectivity across Gauteng.
          </p>
          <p className="mt-4 text-midpoint-grey-100">
            Positioned between Johannesburg and Pretoria, with N1 visibility, Midpoint connects companies to suppliers, clients, and logistics routes across the province. Businesses benefit from secure premises, generator-backed power, backup water with N+1 redundancy, and an on-site restaurant, cafés, gym, padel courts, and running, walking, and cycling trails.
          </p>
          <p className="mt-4 text-sm text-midpoint-grey-100">
            *Some images on this site are conceptual, showcasing the bold vision we&rsquo;re bringing to life.
          </p>
          <Link
            href="/availability-report"
            className="mt-6 inline-flex rounded-full bg-midpoint-cyan px-6 py-3 text-sm font-semibold text-midpoint-dark"
          >
            View available space at Midpoint
          </Link>
        </div>
      </div>
    </section>
  );
}
