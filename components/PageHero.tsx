import Image from "next/image";

type Props = {
  title: string;
  subtitle?: string;
  image: string;
  imageAlt?: string;
};

export default function PageHero({ title, subtitle, image, imageAlt = "" }: Props) {
  return (
    <section className="relative flex h-[500px] items-end overflow-hidden md:h-[560px]">
      <Image src={image} alt={imageAlt} fill priority className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-midpoint-dark/90 via-midpoint-dark/40 to-transparent" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-16 text-white">
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight md:text-6xl">{title}</h1>
        {subtitle && <p className="mt-4 max-w-lg text-sm text-white/80 md:text-base">{subtitle}</p>}
      </div>
    </section>
  );
}
