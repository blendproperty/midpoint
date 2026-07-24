import Image from "next/image";
import Link from "next/link";

const quickLinks = [
  {
    title: "Explore Midpoint",
    href: "/#explore",
    image: "https://cdn.prod.website-files.com/67d1edae36bfc44dfe4ad0c8/6821f724301eaaaa0229354c_Screenshot%202025-05-12%20at%2014.26.35-p-1080.png",
  },
  {
    title: "View availability report",
    href: "/availability-report",
    image: "https://cdn.prod.website-files.com/67d1edae36bfc44dfe4ad0c8/6821f7abaef398e5e5da854e_Screenshot%202025-05-12%20at%2014.29.00.png",
  },
  {
    title: "Speak to Us",
    href: "/contact-us",
    image: "https://cdn.prod.website-files.com/67d1edae36bfc44dfe4ad0c8/6851562de19de0861dbdbbea_midpoint-logo.png",
  },
];

export default function HeroSection() {
  // Duplicated so the CSS marquee loop is seamless — same technique as
  // TenantWall. With only 3 tiles there's nothing for manual overflow
  // scroll to actually scroll, so this animates continuously instead.
  const row = [...quickLinks, ...quickLinks];

  return (
    <section className="relative">
      {/* Matches the original scraped hero height (~973px on desktop) —
          the shorter 700px version was cropping/zooming the background
          photo more tightly via object-cover, which read as "too zoomed in"
          and reduced contrast behind the headline. */}
      <div className="relative min-h-[700px] w-full overflow-hidden md:min-h-[850px] lg:min-h-[973px]">
        <Image
          src="https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a156846faa1903bd227898a_Midpoint-Banner.jpg"
          alt="Midpoint business estate"
          fill
          priority
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

          {/* Webflow's original used a 3D Swiper carousel. This is a
              simpler equivalent with the same continuous sliding motion,
              via CSS animation rather than a JS carousel library. */}
          <div className="mt-10 w-full max-w-xl overflow-hidden">
            <div className="flex w-max animate-marquee gap-4">
              {row.map((link, i) => (
                <Link
                  key={`${link.title}-${i}`}
                  href={link.href}
                  className="group w-56 shrink-0 overflow-hidden rounded-xl bg-white/10 backdrop-blur-sm"
                >
                  <div className="relative h-36 w-full">
                    <Image src={link.image} alt="" fill className="object-cover" />
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
