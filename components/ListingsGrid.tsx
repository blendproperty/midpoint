import SiteMap, { type MapAvailability } from "@/components/SiteMap";
import { listings } from "@/lib/listings";
import { getAllVacancies, vacancyDetailHref, vacancyLabel } from "@/lib/vacancies";

function comparableName(value: string) {
  return value
    .toLowerCase()
    .replace(/\((?:gf|ff|ground floor|first floor)\)/g, "")
    .replace(/\b(?:avenue|road|street)\b/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function withoutUnitPrefix(value: string) {
  return comparableName(value.replace(/^unit\s*\d+[,]?\s*/i, ""));
}

function unitNumber(value: string) {
  return value.match(/^unit\s*(\d+)/i)?.[1] || null;
}

function matchScore(vacancy: Awaited<ReturnType<typeof getAllVacancies>>[number], destinationName: string) {
  const destination = comparableName(destinationName);
  const building = comparableName(vacancy.building);
  const unit = vacancy.unitName ? comparableName(vacancy.unitName) : "";
  if (building === destination || unit === destination) return 100;

  const buildingBase = withoutUnitPrefix(vacancy.building);
  const unitBase = vacancy.unitName ? withoutUnitPrefix(vacancy.unitName) : "";
  const destinationBase = withoutUnitPrefix(destinationName);
  const vacancyUnitNumber = unitNumber(vacancy.unitName || vacancy.building);
  const destinationUnitNumber = unitNumber(destinationName);
  const mismatchedExplicitUnits = vacancyUnitNumber && destinationUnitNumber && vacancyUnitNumber !== destinationUnitNumber;
  if (!mismatchedExplicitUnits && (buildingBase === destinationBase || (unitBase && unitBase === destinationBase))) return 90;
  if (!mismatchedExplicitUnits && unitBase && (unitBase.includes(destinationBase) || destinationBase.includes(unitBase))) return 70;
  if (!mismatchedExplicitUnits && buildingBase && (buildingBase.includes(destinationBase) || destinationBase.includes(buildingBase))) return 60;
  return 0;
}

export default async function ListingsGrid() {
  const vacancies = await getAllVacancies();
  const availability: Record<number, MapAvailability> = {};

  for (const listing of listings) {
    availability[listing.pin] = {
      count: 0,
      totalSqm: 0,
      nextAvailable: null,
      spaces: [],
    };
  }

  for (const vacancy of vacancies) {
    const best = listings
      .map((listing) => ({ listing, score: matchScore(vacancy, listing.name) }))
      .sort((a, b) => b.score - a.score)[0];
    if (!best || best.score === 0) continue;
    const target = availability[best.listing.pin];
    target.count += 1;
    target.totalSqm += vacancy.sizeSqm;
    target.nextAvailable ||= vacancy.availability;
    target.spaces.push({ id: vacancy.id, label: vacancyLabel(vacancy), href: vacancyDetailHref(vacancy), sizeSqm: vacancy.sizeSqm });
  }

  const totalAvailable = vacancies.length;
  const totalArea = vacancies.reduce((total, vacancy) => total + vacancy.sizeSqm, 0);
  const availableDestinations = Object.values(availability).filter((item) => item.count > 0).length;

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
            <div className="hidden sm:block"><p className="text-3xl font-semibold text-midpoint-cyan">{availableDestinations}</p><p className="mt-1 text-xs text-white/55">Buildings with availability</p></div>
          </div>
        </div>

        <div className="mt-12">
          <SiteMap availability={availability} />
        </div>
      </div>
    </section>
  );
}
