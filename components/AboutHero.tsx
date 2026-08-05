import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="relative flex h-[560px] items-end overflow-hidden md:h-[620px]">
      <Image
        src="/images/about/about-banner.jpg"
        alt="Midpoint warehouse and office park"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-midpoint-dark/90 via-midpoint-dark/40 to-transparent" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 text-white">
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight md:text-6xl">
          About Midpoint
        </h1>
        <p className="mt-4 max-w-lg text-sm text-white/80 md:text-base">
          A commercial and industrial estate in Halfway House, Midrand, owned by Blend Property Group.
        </p>
      </div>
    </section>
  );
}
