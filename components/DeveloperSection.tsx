import Image from "next/image";
import Link from "next/link";

type Props = {
  image?: string;
  imageAlt?: string;
  label?: string;
  heading?: string;
  paragraphs?: string[];
  linkHref?: string;
  linkLabel?: string;
};

export default function DeveloperSection({
  image = "https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/67cef042c2c4b15850e63b63_blend-hero-image-p-1600.png",
  imageAlt = "Blend Property Group development",
  label = "Property Developer",
  heading = "Developed by industry professionals",
  paragraphs = [
    "Since 2006, Blend Property Group has specialised in the development of, and investment in, commercial and industrial properties across South Africa.",
    "Driven by a commitment to innovation and design excellence, Blend has become distinguished as an industry leader in the creation of work spaces that are functional and tailored to its tenant’s evolving needs to enhance work productivity, efficiency, and long-term staff satisfaction."
  ],
  linkHref = "https://www.blendproperty.co.za/",
  linkLabel = "www.blend.co.za"
}: Props) {
  return (
    <section className="relative overflow-hidden">
      <div className="relative h-[560px] w-full md:h-[640px]">
        <Image src={image} alt={imageAlt} fill className="object-cover" />

        <div className="absolute left-6 top-8 max-w-md rounded-2xl bg-gradient-to-br from-white/95 via-white/80 to-white/40 p-8 shadow-lg backdrop-blur-sm md:left-12 md:top-12">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-500">
              {label}
            </p>
            <span aria-hidden className="text-xl text-midpoint-dark">
              ↗
            </span>
          </div>
          <h2 className="mt-3 text-2xl font-bold text-midpoint-dark md:text-3xl">{heading}</h2>
          {paragraphs.map((p, i) => (
            <p key={i} className="mt-4 text-sm text-neutral-700">
              {p}
            </p>
          ))}
          <Link href={linkHref} className="mt-4 inline-block text-sm font-medium text-orange-500 underline">
            {linkLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
