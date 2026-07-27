import Image from "next/image";
import Link from "next/link";

export default function DeveloperSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[560px] w-full md:h-[640px]">
        <Image
          src="https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/67cef042c2c4b15850e63b63_blend-hero-image-p-1600.png"
          alt="Blend Property Group development"
          fill
          className="object-cover"
        />

        <div className="absolute left-6 top-8 max-w-md rounded-2xl bg-gradient-to-br from-white/95 via-white/80 to-white/40 p-8 shadow-lg backdrop-blur-sm md:left-12 md:top-12">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">
              Property Developer
            </p>
            <span aria-hidden className="text-xl text-midpoint-dark">
              ↗
            </span>
          </div>
          <h2 className="mt-3 text-2xl font-bold text-midpoint-dark md:text-3xl">
            Developed by industry professionals
          </h2>
          <p className="mt-4 text-sm text-neutral-700">
            Since 2006, Blend Property Group has specialised in the development of, and investment in, commercial and industrial properties across South Africa.
          </p>
          <p className="mt-4 text-sm text-neutral-700">
            Driven by a commitment to innovation and design excellence, Blend has become distinguished as an industry leader in the creation of work spaces that are functional and tailored to its tenant&rsquo;s evolving needs to enhance work productivity, efficiency, and long-term staff satisfaction.
          </p>
          <Link
            href="https://www.blendproperty.co.za/"
            className="mt-4 inline-block text-sm font-medium text-orange-500 underline"
          >
            www.blend.co.za
          </Link>
        </div>
      </div>
    </section>
  );
}
