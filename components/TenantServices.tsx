import { ArrowUpRight } from "lucide-react";

const services = [
  { name: "OnPoint serviced offices", description: "Explore flexible serviced-office options for your team at Midpoint.", href: "https://onpointoffices.co.za/", label: "Explore OnPoint" },
  { name: "STOR24 self storage", description: "Need extra room for stock, equipment or archives? Explore STOR24 storage options and confirm the right space for your business.", href: "https://stor24.co.za/", label: "Explore storage options" },
  { name: "Blend property portfolio", description: "Explore commercial and industrial properties across the wider Blend portfolio as your business grows.", href: "https://listings.blendproperty.co.za/", label: "Browse Blend listings" },
];

export default function TenantServices() {
  return (
    <section aria-labelledby="tenant-services-heading" className="bg-[#f4f7f6] px-6 py-16 md:py-20">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-midpoint-grey-400">More for your business</p>
        <h2 id="tenant-services-heading" className="mt-3 text-3xl font-semibold text-midpoint-dark md:text-4xl">Space and services to support your team</h2>
        <p className="mt-4 max-w-2xl leading-7 text-midpoint-grey-400">Discover related offerings from our network. Explore each site for current options, availability and terms.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {services.map((service) => (
            <article key={service.href} className="flex flex-col rounded-card bg-white p-7">
              <h3 className="text-xl font-semibold text-midpoint-dark">{service.name}</h3>
              <p className="mt-3 flex-1 text-sm leading-6 text-midpoint-grey-400">{service.description}</p>
              <a href={service.href} className="mt-5 inline-flex min-h-11 items-center gap-2 font-semibold text-midpoint-dark underline-offset-4 hover:underline">{service.label}<ArrowUpRight size={16} aria-hidden="true" /></a>
            </article>
          ))}
        </div>
        <a href="https://www.blendproperty.co.za/" className="mt-8 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-midpoint-dark underline">Meet Blend Property Group<ArrowUpRight size={16} aria-hidden="true" /></a>
      </div>
    </section>
  );
}
