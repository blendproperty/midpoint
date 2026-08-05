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
  image = "/images/developer/blend-hero.png",
  imageAlt = "Blend Property Group development",
  label = "Property Developer",
  heading = "Developed by industry professionals",
  paragraphs = [
    "Blend Property Group was established in 2006 and invests in, develops and redevelops commercial, industrial and retail property in South Africa.",
    "Its Johannesburg office is located at Midpoint, 162 Tonetti Street, Halfway House, Midrand."
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
