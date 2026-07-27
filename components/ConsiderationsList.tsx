type Item = { heading: string; text: string };

type Props = {
  eyebrow: string;
  items: Item[];
};

export default function ConsiderationsList({ eyebrow, items }: Props) {
  return (
    <section className="bg-white px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-bold text-midpoint-dark md:text-3xl">{eyebrow}</h2>
        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <div key={item.heading} className="rounded-2xl bg-midpoint-dark p-6 text-white md:p-8">
              <h3 className="text-xl font-semibold md:text-2xl">{item.heading}</h3>
              <p className="mt-3 text-sm text-white/70">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
