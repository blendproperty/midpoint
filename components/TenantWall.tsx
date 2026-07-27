import Image from "next/image";
import { tenants } from "@/lib/tenants";

function Row({ items }: { items: typeof tenants }) {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden">
      <div className="flex w-max animate-marquee items-center gap-16">
        {row.map((tenant, i) => (
          <div key={`${tenant.name}-${i}`} className="flex h-12 shrink-0 items-center justify-center">
            <Image
              src={tenant.src}
              alt={tenant.name}
              width={140}
              height={48}
              className="h-10 w-auto max-w-[140px] object-contain md:h-12"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TenantWall() {
  const mid = Math.ceil(tenants.length / 2);
  const rowA = tenants.slice(0, mid);
  const rowB = tenants.slice(mid);

  return (
    <section className="bg-white py-16">
      <div className="space-y-8">
        <Row items={rowA} />
        <Row items={rowB} />
      </div>
    </section>
  );
}
