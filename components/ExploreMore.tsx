import Link from "next/link";

type LinkItem = { label: string; href: string };

type Props = {
  links: LinkItem[];
};

export default function ExploreMore({ links }: Props) {
  return (
    <section className="bg-white px-6 pb-24">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-2xl font-bold text-midpoint-dark md:text-3xl">Explore more of Midpoint</h2>
        <ul className="mt-6 space-y-3">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="font-medium text-midpoint-dark underline underline-offset-4">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
