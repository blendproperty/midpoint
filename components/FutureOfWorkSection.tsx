import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export default function FutureOfWorkSection() {
  return (
    <section className="relative min-h-[600px] w-full overflow-hidden md:min-h-[840px]">
      <Image
        src="/images/future-of-work/amenity-hub-banner.png"
        alt=""
        fill
        className="object-cover"
      />

      <div className="relative flex min-h-[600px] items-center px-6 py-16 md:min-h-[840px]">
        <Reveal className="max-w-xl">
          <Link
            href="https://www.blendproperty.co.za"
            target="_blank"
            className="block rounded-2xl bg-white/70 p-8 text-midpoint-dark backdrop-blur-md transition-transform hover:-translate-y-1"
          >
            <h2 className="text-3xl font-semibold md:text-4xl">
              Midpoint is defining the future of work, blending industrial, commercial, and lifestyle spaces into a dynamic business hub.
            </h2>
            <p className="mt-4">
              The estate is continuing to evolve, with new developments underway. Several spaces are already available, offering businesses and brokers the opportunity to secure industrial and commercial space in one of Midrand&rsquo;s fastest-growing business nodes.
            </p>
            <p className="mt-4">
              Warehousing, offices, and serviced offices sit alongside cafés, a restaurant, gym, padel courts, and walking trails, creating an environment where business operations and everyday convenience work together.
            </p>
            <p className="mt-4">
              While the estate is still taking shape, select spaces are already available, offering a rare opportunity to secure a spot in Midrand&rsquo;s most sought-after development. Be part of the transformation, enquire today and explore how your business can thrive in this exciting, evolving space.
            </p>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
