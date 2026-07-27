import Image from "next/image";
import { tenants } from "@/lib/tenants";

// Static, non-scrolling grid of every partner/tenant logo on a white
// background — sits below the dark auto-scrolling TenantWall marquee,
// matching the two distinct tenant sections on the original site.
export default function PartnersGrid() {
  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-2 items-center gap-x-10 gap-y-10 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {tenants.map((tenant) => (
          <div key={tenant.name} className="flex h-12 items-center justify-center">
            <Image
              src={tenant.src}
              alt={tenant.name}
              width={140}
              height={48}
              className="h-full w-auto max-w-[140px] object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
