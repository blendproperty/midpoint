import Image from "next/image";
import Reveal from "@/components/Reveal";

export default function LocationSection() {
  return (
    <section className="relative overflow-hidden text-white">
      <div className="absolute inset-0">
        <Image
          src="https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/67ceb9ae163736bdc3dc5fac_map-background-image.avif"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-midpoint-dark/80" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        {/* Real 2-column grid confirmed via DOM inspection: text left,
            two glass cards right (not stacked plain text). */}
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <h2 className="text-3xl font-semibold text-midpoint-cyan md:text-4xl">
              At the centre of business, connected to everything.
            </h2>
            <p className="mt-4">
              Seamless access to major business districts, highways, and international travel hubs.
            </p>
            <p className="mt-4">
              Midpoint sits in Halfway House, Midrand, one of Gauteng&rsquo;s most active commercial and industrial corridors. Easy access to the N1 highway allows businesses to move goods efficiently between Johannesburg, Pretoria, and national distribution networks.
            </p>
          </Reveal>

          {/* Exact styling extracted via Playwright from .glass-text_block:
              bg-white/10, backdrop-blur(10px), 13px radius, 20px padding. */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <Reveal delay={100} className="rounded-[13px] bg-white/10 p-5 backdrop-blur-[10px]">
              <p className="text-lg font-semibold text-midpoint-cyan">Location</p>
              <p className="mt-2">
                162 Tonetti Street,
                <br />
                Halfway House,
                <br />
                Midrand
              </p>
            </Reveal>

            <Reveal delay={220} className="rounded-[13px] bg-white/10 p-5 backdrop-blur-[10px]">
              <ul className="list-disc space-y-1 pl-4">
                <li>31 km to Pretoria</li>
                <li>25 km to Johannesburg</li>
                <li>21 km to OR Tambo International Airport</li>
                <li>1,470 meters of N1 highway frontage</li>
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
