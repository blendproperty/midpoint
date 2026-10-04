import EstateMap from "@/components/EstateMap";
import ContactForm from "@/components/ContactForm";
import { getSiteSettings } from "@/lib/site-settings";

export default async function ContactSection() {
  const settings = await getSiteSettings();

  return (
    <section id="Contact" className="bg-midpoint-dark px-6 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
          <h2 className="text-4xl font-bold md:text-5xl">Contact</h2>
          <div>
            <p className="max-w-md text-white/80">
              Positioned in Midrand between Johannesburg and Pretoria, with the infrastructure, warehouses, offices, and amenities your team needs to thrive.
            </p>
            <div className="mt-8 flex flex-wrap justify-between gap-8">
              <div>
                <h3 className="text-sm uppercase tracking-wide text-white/80">Contact Info</h3>
                <p className="mt-1">
                  <a href="tel:+27113809400">+27 11 380 9400</a>
                </p>
                <p>
                  <a href="mailto:boitumelo@blendproperty.co.za">boitumelo@blendproperty.co.za</a>
                </p>
              </div>
              <div>
                <h3 className="text-sm uppercase tracking-wide text-white/80">Address</h3>
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
        <EstateMap />
      </div>
    </section>
  );
}
