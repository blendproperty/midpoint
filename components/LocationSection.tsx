import Image from "next/image";

export default function LocationSection() {
  return (
    <section className="relative overflow-hidden text-white">
      <div className="absolute inset-0">
        <Image
          src="https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/67ceb9ae163736bdc3dc5fac_map-background-image.avif"
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-midpoint-dark/80" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-3xl font-semibold md:text-4xl">
          At the centre of business, connected to everything.
        </h2>
        <p className="mt-4">
          Seamless access to major business districts, highways, and international travel hubs. Midpoint sits in Halfway House, Midrand, one of Gauteng&rsquo;s most active commercial and industrial corridors. Easy access to the N1 highway allows businesses to move goods efficiently between Johannesburg, Pretoria, and national distribution networks.
        </p>

        <div className="mt-8">
          <p className="text-sm uppercase tracking-wide text-midpoint-cyan">Location</p>
          <p className="mt-1 font-medium">162 Tonetti Street, Halfway House, Midrand</p>
        </div>

        <ul className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <li>31 km to Pretoria</li>
          <li>25 km to Johannesburg</li>
          <li>21 km to OR Tambo International Airport</li>
          <li>1,470 meters of N1 highway frontage</li>
        </ul>
      </div>
    </section>
  );
}
