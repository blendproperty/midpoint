import ContactForm from "@/components/ContactForm";
import { getSiteSettings } from "@/lib/site-settings";

export default async function ContactSection() {
  const settings = await getSiteSettings();

  return (
    <section id="Contact" className="bg-midpoint-dark px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <h1 className="text-4xl font-bold md:text-5xl">Contact</h1>
          <div>
            <p className="max-w-md text-midpoint-grey-400">
              Contact the Midpoint leasing team about current office, serviced-office and warehouse availability, or to arrange a site visit.
            </p>
            <div className="mt-8 flex flex-wrap justify-between gap-8">
              <div>
                <h3 className="text-sm uppercase tracking-wide text-midpoint-grey-400">Contact Info</h3>
                <p className="mt-1">
                  <a href="tel:+27113809400">+27 11 380 9400</a>
                </p>
                <p>
                  <a href="mailto:boitumelo@blendproperty.co.za">boitumelo@blendproperty.co.za</a>
                </p>
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-wide text-midpoint-grey-400">Address</h3>
                <p className="mt-1">
                  162 Tonetti Street, Halfway House,
                  <br />
                  Midrand, 1685
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="my-12 border-t border-white/10" />

        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <h3 className="text-2xl font-semibold">Send us a message</h3>
          <div className="w-full">
            <ContactForm siteKey={settings.recaptchaSiteKey} successMessage={settings.enquirySuccessMessage} />
          </div>
        </div>

        {/*
          Grayscale/dark-tint look matches the original site, but it's done
          with a pointer-events-none overlay sitting ON TOP of the iframe
          (mix-blend-saturation desaturates, then a dark tint on top) rather
          than a CSS filter applied directly to the iframe itself. A direct
          filter on a Google Maps iframe breaks Chrome's WebGL compositing
          and causes an infinite loading spinner — already hit that bug once.
          The overlay achieves the same visual result and stays fully
          click-through, so the map is still draggable/zoomable underneath.
        */}
        <div className="relative mt-16 h-72 w-full overflow-hidden rounded-card md:h-96">
          <iframe
            title="Google map showcasing office location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3586.0622489060165!2d28.121084777120107!3d-25.998778177203732!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e956e055e9b7cb9%3A0x6612fda1aab019bf!2s162%20Tonetti%20St%2C%20Halfway%20House%2C%20Midrand%2C%201685%2C%20South%20Africa!5e0!3m2!1sen!2suk!4v1741856151377!5m2!1sen!2suk"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="pointer-events-none absolute inset-0 bg-white mix-blend-saturation" />
          <div className="pointer-events-none absolute inset-0 bg-midpoint-dark/35" />
        </div>
      </div>
    </section>
  );
}
