import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

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
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-midpoint-dark/50 via-midpoint-dark/10 to-transparent" />

          <Reveal className="relative px-8 text-white sm:px-12">
            <p className="text-4xl font-bold sm:text-5xl">Ready to move in?</p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-midpoint-cyan px-5 py-2.5 text-sm font-semibold text-midpoint-dark transition-transform duration-150 ease-out group-hover:translate-x-1 sm:text-base">
              Check availability now
              <span aria-hidden="true">↗</span>
            </span>
          </Reveal>
        </Link>
      </div>
    </section>
  );
}
