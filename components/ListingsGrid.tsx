import SiteMap from "@/components/SiteMap";

export default function ListingsGrid() {
  return (
    <section id="explore" className="overflow-hidden px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-semibold md:text-4xl">Explore Midpoint</h2>
        <p className="mt-4 max-w-2xl text-midpoint-grey-400">
          Explore our interactive map to view available warehouse space, offices, serviced offices, and upcoming developments in Midrand. You can also view our vacancy schedule for current leasing opportunities.
        </p>

        <div className="mt-10">
          <SiteMap />
        </div>
      </div>
    </section>
  );
}
