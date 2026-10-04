import Image from "next/image";
import Link from "next/link";

const quickLinks = [
  {
    title: "Explore Midpoint",
    href: "/#explore",
    image: "/images/hero/quicklink-explore.png",
  },
  {
    title: "Current vacancies",
    href: "/vacancies",
    image: "/images/hero/quicklink-availability.png",
  },
  {
    title: "Speak to Us",
    href: "/contact-us",
    image: "/images/hero/quicklink-speak.png",
  },
];

export default function HeroSection() {
  return (
    <section className="relative">
      {/* Matches the original scraped hero height (~973px on desktop) —
          the shorter 700px version was cropping/zooming the background
          photo more tightly via object-cover, which read as "too zoomed in"
          and reduced contrast behind the headline. */}
      <div className="relative min-h-[700px] w-full overflow-hidden md:min-h-[850px] lg:min-h-[973px]">
        <Image
          src="/images/hero/banner.jpg"
          alt="Midpoint business estate"
          fill
          priority
          sizes="100vw"
          quality={78}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midpoint-dark/90 via-midpoint-dark/30 to-transparent" />

        <div className="relative mx-auto flex min-h-[700px] max-w-7xl flex-col justify-center px-6 pb-24 pt-32 md:min-h-[850px] lg:min-h-[973px]">
          <h1 className="max-w-3xl text-4xl font-semibold text-white md:text-6xl">
            Warehouse and flexible office space in Midrand, designed for efficient operations.
          </h1>
          <p className="mt-4 max-w-2xl text-white/90">
            Conveniently positioned in Midrand, central to major business hubs in Gauteng. Connect your company to endless opportunities and amenities.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/vacancies" className="inline-flex rounded-full bg-midpoint-cyan px-7 py-3 font-semibold text-midpoint-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-midpoint-cyan">View available space</Link>
            <Link href="/contact-us#Contact" className="inline-flex rounded-full border border-white/60 bg-midpoint-dark/60 px-7 py-3 font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-midpoint-cyan">Arrange a viewing</Link>
          </div>
          <div className="mt-8 w-full max-w-3xl">
            <div className="grid gap-4 sm:grid-cols-3">
              {quickLinks.map((link, i) => (
                <Link
                  key={`${link.title}-${i}`}
                  href={link.href}
                  className="group min-w-0 overflow-hidden rounded-xl bg-midpoint-dark/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-midpoint-cyan"
                >
                  <div className="relative h-24 w-full">
                    <Image src={link.image} alt="" fill sizes="224px" className="object-cover" />
                  </div>
                  <div className="flex items-center justify-between px-4 py-3 text-sm font-medium text-white">
                    <span>{link.title}</span>
                    <span className="ml-2 shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      ↗
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <Link
          href="#introduction"
          className="absolute bottom-6 right-6 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm"
        >
          Scroll Down
          <span aria-hidden>↓</span>
        </Link>
      </div>
    </section>
  );
}
