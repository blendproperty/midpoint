import Link from "next/link";

type Props = {
  heading: string;
  text: string;
};

export default function TalkToLeasing({ heading, text }: Props) {
  return (
    <section className="bg-white px-6 pb-20">
      <div className="mx-auto max-w-4xl rounded-2xl bg-midpoint-dark p-8 text-white md:p-12">
        <h2 className="text-2xl font-bold md:text-3xl">{heading}</h2>
        <p className="mt-3 max-w-2xl text-sm text-white/70">{text}</p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link
            href="/contact-us"
            className="rounded-full bg-[#3898EC] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Book a viewing
          </Link>
          <Link
            href="/contact-us"
            className="rounded-full border border-white/30 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Discuss your requirements
          </Link>
        </div>
      </div>
    </section>
  );
}
