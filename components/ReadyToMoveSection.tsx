import Image from "next/image";
import Link from "next/link";

export default function ReadyToMoveSection() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto flex max-w-7xl justify-center">
        {/* Real dimensions confirmed via Playwright: 940.8 x 600px card,
            20px radius. Text is large and vertically centered-left, not
            small text tucked in the corner. */}
        <Link
          href="/vacancies"
          className="group relative flex aspect-[940/600] w-full max-w-[940px] items-center overflow-hidden rounded-[20px]"
        >
          <Image
            src="https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/67ced064e093893c8e33c09d_2feaa21357c9d95507e11db182fdb64d.avif"
            alt=""
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-midpoint-dark/50 via-midpoint-dark/10 to-transparent" />

          <div className="relative px-8 text-white sm:px-12">
            <p className="text-4xl font-bold sm:text-5xl">Ready to move in?</p>
            <p className="mt-2 text-2xl font-semibold text-midpoint-cyan sm:text-3xl">
              Check availability now.
            </p>
          </div>

          <span className="absolute right-6 top-6 text-3xl text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
            ↗
          </span>
        </Link>
      </div>
    </section>
  );
}
