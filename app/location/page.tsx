import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ConsiderationsList from "@/components/ConsiderationsList";

export const metadata: Metadata = {
  title: "Location",
  description:
    "Midpoint sits on the N1 between Johannesburg and Pretoria in Halfway House, Midrand — verified distances, access and route detail."
};

const details = [
  {
    heading: "On the N1, between Johannesburg and Pretoria",
    text: "Midpoint has 1,470 metres of frontage directly onto the N1 highway, roughly 25 km from Johannesburg and 31 km from Pretoria — positioned squarely between Gauteng's two largest business centres."
  },
  {
    heading: "Halfway House, Midrand",
    text: "The estate is based at 162 Tonetti Street, Halfway House, Midrand, 1685 — one of Gauteng's most established commercial and industrial nodes, with direct N1 access for staff commuting from either side of the corridor."
  },
  {
    heading: "Close to OR Tambo International Airport",
    text: "Midpoint is approximately 21 km from OR Tambo International Airport, keeping the estate well connected for teams and clients travelling in and out of Johannesburg."
  }
];

export default function LocationPage() {
  return (
    <>
      <PageHero
        title="Location"
        subtitle="On the N1 between Johannesburg and Pretoria — verified distances, access and route detail."
        image="https://cdn.prod.website-files.com/67caa7c310ee043ea9e45267/6a148a5463dac69c69cbc3a8_amenities_banner-p-1600.jpg"
        imageAlt="Midpoint estate location"
      />
      <ConsiderationsList eyebrow="Where Midpoint sits" items={details} />
      <section className="bg-white px-6 pb-24">
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-card">
          <iframe
            title="Google map showcasing Midpoint's location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3586.0622489060165!2d28.121084777120107!3d-25.998778177203732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e956e055e9b7cb9%3A0x6612fda1aab019bf!2s162%20Tonetti%20St%2C%20Halfway%20House%2C%20Midrand%2C%201685%2C%20South%20Africa!5e0!3m2!1sen!2suk!4v1741856151377!5m2!1sen!2suk"
            width="100%"
            height="420"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="pointer-events-none absolute inset-0 bg-white mix-blend-saturation" />
          <div className="pointer-events-none absolute inset-0 bg-midpoint-dark/55" />
        </div>
      </section>
    </>
  );
}
