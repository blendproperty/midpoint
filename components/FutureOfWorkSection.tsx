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
              One Midrand estate for offices, serviced offices and warehouse space.
            </h2>
            <p className="mt-4">
              Midpoint brings different types of business premises together at one address, allowing companies to compare conventional offices, flexible workspace and industrial accommodation.
            </p>
            <p className="mt-4">
              The estate also includes hospitality, fitness and outdoor facilities. Some areas remain under development, so the leasing team can confirm what is operating when you visit.
            </p>
            <p className="mt-4">
              Use the live vacancy schedule for available units, or contact the leasing team to arrange an inspection.
            </p>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
