import Image from "next/image";
import Link from "next/link";
import { Users, BriefcaseBusiness, Bath, Check } from "lucide-react";
import { money, type StayQuote } from "@/lib/stay-pricing";
export default function StayRoomCard({
  category,
  available,
  quote,
  params,
  reason,
}: {
  category: {
    slug: string;
    name: string;
    description: string;
    images: string[];
    amenities: string[];
    maxGuests: number | null;
  };
  available?: number;
  quote?: StayQuote | null;
  params: string;
  reason?: string;
}) {
  return (
    <article className="grid overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm md:grid-cols-[40%_1fr]">
      <Link
        href={"/stay/" + category.slug + (params ? "?" + params : "")}
        className="relative block min-h-64 bg-stone-100"
      >
        <Image
          src={category.images[0]}
          alt={category.name + " — supplied room imagery"}
          fill
          className="object-cover"
          sizes="(min-width:768px) 40vw, 100vw"
        />
      </Link>
      <div className="p-6 lg:p-8">
        <p className="stay-eyebrow">Corporate serviced accommodation</p>
        <h2 className="mt-2 text-2xl font-semibold">
          <Link href={"/stay/" + category.slug + (params ? "?" + params : "")}>
            {category.name}
          </Link>
        </h2>
        <p className="mt-3 text-sm leading-6 text-stone-600">
          {category.description}
        </p>
        <div className="mt-4 flex gap-5 text-sm">
          <span className="flex gap-2">
            <Users size={16} />
            {category.maxGuests} guests
          </span>
          <span className="flex gap-2">
            <Bath size={16} />
            En-suite
          </span>
          <span className="flex gap-2">
            <BriefcaseBusiness size={16} />
            Workspace
          </span>
        </div>
        <ul className="mt-5 grid gap-2 text-xs text-stone-600 sm:grid-cols-2">
          {category.amenities.map((a) => (
            <li className="flex gap-2" key={a}>
              <Check size={14} />
              {a}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-5 border-t pt-5">
          <div>
            {quote ? (
              <>
                <p className="text-xs text-stone-500">
                  {quote.nights} nights · {quote.guests} guests · includes test
                  VAT
                </p>
                <p className="mt-1 text-2xl font-semibold">
                  {money(quote.totalCents)}
                </p>
                <p className="text-xs text-stone-500">
                  {money(Math.round(quote.roomCents / quote.nights))} average /
                  night
                </p>
                {quote.discount > 0 && (
                  <p className="mt-2 text-sm text-green-800">
                    {quote.discount}% stay discount included
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm">Choose dates for your full stay price</p>
            )}
            {available !== undefined && (
              <p className="mt-3 text-xs text-stone-600">
                {available > 0
                  ? available + " test rooms available"
                  : reason || "Sold out for these dates"}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              className="stay-secondary"
              href={"/stay/" + category.slug + (params ? "?" + params : "")}
            >
              View room
            </Link>
            {quote && !!available && (
              <Link
                data-analytics-event="select_room"
                className="stay-button"
                href={"/stay/checkout?room=" + category.slug + "&" + params}
              >
                Select room
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
