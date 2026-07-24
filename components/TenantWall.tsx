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
        <div className="flex w-max animate-marquee gap-10">
          {row.map((tenant, i) => (
            <div key={`${tenant.name}-${i}`} className="flex h-16 w-32 shrink-0 items-center justify-center">
              <Image
                src={tenant.src}
                alt={tenant.name}
                width={128}
                height={64}
                className="max-h-16 w-auto object-contain opacity-80"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
