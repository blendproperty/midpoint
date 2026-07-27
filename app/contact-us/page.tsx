import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us | Midpoint",
  description:
    "Contact the Midpoint leasing team about warehouse, office and serviced office space in Midrand."
};

export default function ContactUs() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-2">
      <div>
        <h1 className="text-4xl font-bold text-midpoint-dark">Enquire</h1>
        <p className="mt-4 text-midpoint-grey-400">
          Talk to the leasing team about availability, specifications, pricing,
          and lease structures, or to arrange a site visit.
        </p>
        <div className="mt-6 space-y-1 text-sm">
          <a className="block font-medium" href={site.phoneHref}>{site.phone}</a>
          <a className="block font-medium" href={site.emailHref}>{site.email}</a>
        </div>
      </div>
      <ContactForm />
    </section>
  );
}
