import Image from "next/image";
import Link from "next/link";

export default function ReadyToMoveSection() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto flex max-w-7xl justify-center">
        {/* Real dimensions confirmed via Playwright: 940.8 x 600px card,
            20px radius, radial gradient from #082121 over background photo. */}
        <Link
          href="/availability-report"
          className="group relative aspect-[940/600] w-full max-w-[940px] overflow-hidden rounded-[20px]"
        >
          <Image
            src="https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/67ced064e093893c8e33c09d_2feaa21357c9d95507e11db182fdb64d.avif"
            alt=""
            fill
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(8,33,33,0.8) 0%, rgba(8,33,33,0) 70%)",
            }}
          />
          <div className="absolute left-6 top-6 text-white">
            <p className="text-lg font-semibold">Ready to move in?</p>
            <p className="text-midpoint-cyan">Check availability now.</p>
          </div>
          <span className="absolute right-6 top-6 text-xl text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            ↗
          </span>
        </Link>
      </div>
    </section>
  );
}
