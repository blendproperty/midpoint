import SiteMap, { type MapAvailability } from "@/components/SiteMap";
import { listings } from "@/lib/listings";
import { getAllVacancies } from "@/lib/vacancies";

function comparableName(value: string) {
  return value
    .toLowerCase()
    .replace(/^unit\s*\d+[,]?\s*/, "")
    .replace(/[^a-z0-9]/g, "");
}

export default async function ListingsGrid() {
  const vacancies = await getAllVacancies();
  const availability: Record<number, MapAvailability> = {};

  for (const listing of listings) {
    const listingName = comparableName(listing.name);
    const matches = vacancies.filter((vacancy) => {
      const buildingName = comparableName(vacancy.building);
      return buildingName === listingName || buildingName.includes(listingName) || listingName.includes(buildingName);
    });
    availability[listing.pin] = {
      count: matches.length,
      totalSqm: matches.reduce((total, vacancy) => total + vacancy.sizeSqm, 0),
      nextAvailable: matches[0]?.availability || null,
    };
  }

  const totalAvailable = vacancies.length;
  const totalArea = vacancies.reduce((total, vacancy) => total + vacancy.sizeSqm, 0);

  return (
    <section id="explore" className="relative overflow-hidden bg-[#f3f7f6] px-6 py-24">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[620px] w-[900px] rounded-full bg-midpoint-cyan/20 blur-3xl" />
      <div className="relative mx-auto max-w-[1800px]">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-midpoint-grey-400">Interactive estate map</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-midpoint-dark md:text-6xl">Find your place at Midpoint.</h2>
            <p className="mt-5 max-w-2xl leading-7 text-midpoint-grey-400">
              Explore the estate by space type, select a building and see current availability before arranging an inspection.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 rounded-card bg-midpoint-dark p-6 text-white sm:grid-cols-3">
            <div><p className="text-3xl font-semibold text-midpoint-cyan">{totalAvailable}</p><p className="mt-1 text-xs text-white/55">Spaces available</p></div>
            <div><p className="text-3xl font-semibold text-midpoint-cyan">{Math.round(totalArea).toLocaleString("en-ZA")}</p><p className="mt-1 text-xs text-white/55">Total available m²</p></div>
            <div className="hidden sm:block"><p className="text-3xl font-semibold text-midpoint-cyan">12</p><p className="mt-1 text-xs text-white/55">Map destinations</p></div>
          </div>
        </div>

        <div className="mt-12">
          <SiteMap availability={availability} />
        </div>
      </div>
    </section>
  );
}
