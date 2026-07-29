import SiteMap from "@/components/SiteMap";

export default function ListingsGrid() {
  return (
    <section id="explore" className="relative overflow-hidden px-6 py-12 md:py-16">
      {/* Radial cyan gradient orb, top-left — matches the SVG radial
          gradient (#00FFFF fading to transparent) used on the live site. */}
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-[600px] w-[1100px] opacity-60"
        style={{
          background:
            "radial-gradient(ellipse at center, #00FFFF 0%, rgba(0,255,255,0) 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <h2 className="text-3xl font-semibold md:text-4xl">Explore Midpoint</h2>
        <p className="mt-4 max-w-2xl text-midpoint-grey-400">
          Explore our interactive map to view available warehouse space, offices, serviced offices, and upcoming developments in Midrand. You can also view our vacancy schedule for current leasing opportunities.
        </p>

        <div className="mt-6">
          <SiteMap />
        </div>
      </div>
    </section>
  );
}
