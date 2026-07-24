import Image from "next/image";

export default function FutureOfWorkSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a01fae519701ceb2b901540_AMENITY%20HUB.png"
          alt=""
          fill
          className="object-cover opacity-20"
        />
      </div>
      <div className="relative mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-3xl font-semibold md:text-4xl">
          Midpoint is defining the future of work, blending industrial, commercial, and lifestyle spaces into a dynamic business hub.
        </h2>
        <p className="mt-4 text-midpoint-grey-400">
          The estate is continuing to evolve, with new developments underway. Several spaces are already available, offering businesses and brokers the opportunity to secure industrial and commercial space in one of Midrand&rsquo;s fastest-growing business nodes.
        </p>
        <p className="mt-4 text-midpoint-grey-400">
          Warehousing, offices, and serviced offices sit alongside cafés, a restaurant, gym, padel courts, and walking trails, creating an environment where business operations and everyday convenience work together.
        </p>
        <p className="mt-4 text-midpoint-grey-400">
          While the estate is still taking shape, select spaces are already available, offering a rare opportunity to secure a spot in Midrand&rsquo;s most sought-after development. Be part of the transformation, enquire today and explore how your business can thrive in this exciting, evolving space.
        </p>
      </div>
    </section>
  );
}
