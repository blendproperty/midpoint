import Image from "next/image";
import { tenants } from "@/lib/tenants";

export default function TenantWall() {
  // Duplicate the list so the CSS marquee loops seamlessly.
  const row = [...tenants, ...tenants];

  return (
    <section className="bg-midpoint-dark px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-semibold md:text-4xl">Current Tenants</h2>
      </div>

      <div className="mt-10 overflow-hidden">
        <div className="flex w-max animate-marquee items-center gap-10">
          {row.map((tenant, i) => (
            <div key={`${tenant.name}-${i}`} className="flex h-[70px] shrink-0 items-center justify-center">
              <Image
                src={tenant.src}
                alt={tenant.name}
                width={120}
                height={70}
                className="h-[70px] w-auto object-contain opacity-80"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
