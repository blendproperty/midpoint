import Link from "next/link";

export const metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-midpoint-dark text-white">
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-midpoint-cyan">
          404 error
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-white md:text-6xl">
          We couldn&apos;t find that page.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-white/70">
          The page you're looking for may have moved, been renamed, or no longer exists.
          Here are a few places to pick back up:
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-midpoint-cyan px-5 py-2.5 text-sm font-semibold text-midpoint-dark transition-transform duration-100 ease-out hover:opacity-90 active:scale-[0.97]"
          >
            Back to home
          </Link>
          <Link
            href="/vacancies"
            className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white transition-transform duration-100 ease-out hover:bg-white/10 active:scale-[0.97]"
          >
            View vacancies
          </Link>
          <Link
            href="/contact-us"
            className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-medium text-white transition-transform duration-100 ease-out hover:bg-white/10 active:scale-[0.97]"
          >
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
