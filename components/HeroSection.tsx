import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative">
      <div className="relative h-[600px] w-full overflow-hidden">
        <Image
          src="https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a156846faa1903bd227898a_Midpoint-Banner.jpg"
          alt="Midpoint business estate"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midpoint-dark/80 via-midpoint-dark/20 to-transparent" />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-6">
          <h1 className="max-w-3xl text-4xl font-semibold text-white md:text-6xl">
            Warehouse and flexible office space in Midrand, designed for efficient operations.
          </h1>
          <p className="mt-4 max-w-2xl text-white/90">
            Conveniently positioned in Midrand, central to major business hubs in Gauteng. Connect your company to endless opportunities and amenities.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contact-us"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-midpoint-dark"
            >
              Speak to Us
            </Link>
            <Link
              href="/#explore"
              className="rounded-full bg-midpoint-cyan px-6 py-3 text-sm font-semibold text-midpoint-dark"
            >
              Explore Midpoint
            </Link>
            <Link
              href="/availability-report"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-midpoint-dark"
            >
              View availability report
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
