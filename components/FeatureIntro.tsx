import Image from "next/image";

type Feature = { heading: string; text: string; image: string };

type Props = {
  eyebrow: string;
  features: Feature[];
};

export default function FeatureIntro({ eyebrow, features }: Props) {
  return (
    <section className="bg-midpoint-dark px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-semibold md:text-4xl">{eyebrow}</h2>
        <div className="mt-10 space-y-8">
          {features.map((f) => (
            <div
              key={f.heading}
              className="grid gap-6 rounded-2xl border border-midpoint-cyan/30 p-6 md:grid-cols-2 md:items-center md:p-8"
            >
              <div>
                <h3 className="text-2xl font-semibold">{f.heading}</h3>
                <p className="mt-3 text-sm text-midpoint-grey-400">{f.text}</p>
              </div>
              <div className="relative h-56 w-full overflow-hidden rounded-xl md:h-64">
                <Image src={f.image} alt="" fill className="object-cover" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
