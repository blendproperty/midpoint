import Image from "next/image";
import Link from "next/link";

const spaces = [
  {
    icon: "/images/spaces/icon-premium-offices.svg",
    title: "Premium Offices",
    text: "Professional office space for corporate teams, professional services firms, and growing enterprises.",
    href: "/offices"
  },
  {
    icon: "/images/spaces/icon-serviced-offices.svg",
    title: "Serviced Offices",
    text: "Flexible, fully-serviced workspaces ready for occupation, with the support and amenities teams need.",
    href: "/services-offices"
  },
  {
    icon: "/images/spaces/icon-warehouse.svg",
    title: "Warehouse Facilities",
    text: "Modern warehouse facilities suited to logistics operators and businesses with operational footprints.",
    href: "/warehouses"
  }
];

export default function SpaceGrid() {
  return (
    <section className="bg-white px-6 pb-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-2xl text-3xl font-semibold text-midpoint-dark md:text-4xl">
          Space designed around how modern businesses actually work.
        </h2>
        <p className="mt-4 max-w-2xl text-midpoint-grey-400">
          The estate offers a mix of office space, serviced offices, and warehouse facilities designed to accommodate a wide range of companies, from professional services firms and corporate teams to logistics operators and growing enterprises. At the same time, carefully integrated amenities and outdoor spaces contribute to a working environment that feels more balanced and enjoyable for the people who spend their days here.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {spaces.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              className="rounded-2xl bg-midpoint-dark p-6 text-white transition hover:opacity-90"
            >
              <Image src={s.icon} alt="" width={28} height={28} />
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-midpoint-grey-400">{s.text}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
