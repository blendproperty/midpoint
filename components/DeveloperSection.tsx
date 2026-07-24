import Image from "next/image";
import Link from "next/link";

export default function DeveloperSection() {
  return (
    <section className="relative overflow-hidden text-white">
      <div className="absolute inset-0">
        <Image
          src="https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/67cef042c2c4b15850e63b63_blend-hero-image-p-1600.png"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-midpoint-dark/80" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 py-16">
        <p className="text-sm uppercase tracking-wide text-midpoint-cyan">Property Developer</p>
        <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Developed by industry professionals</h2>
        <p className="mt-4 text-midpoint-grey-100">
          Since 2006, Blend Property Group has specialised in the development of, and investment in, commercial and industrial properties across South Africa.
        </p>
        <p className="mt-4 text-midpoint-grey-100">
          Driven by a commitment to innovation and design excellence, Blend has become distinguished as an industry leader in the creation of work spaces that are functional and tailored to its tenant&rsquo;s evolving needs to enhance work productivity, efficiency, and long-term staff satisfaction.
        </p>
        <Link href="https://www.blendproperty.co.za/" className="mt-4 inline-block underline">
          www.blend.co.za
        </Link>
      </div>
    </section>
  );
}
