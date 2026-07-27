import { prisma } from "@/lib/prisma";
import { fallbackVacancies } from "@/lib/vacancies-fallback";

export type VacancySector = "Warehouse" | "Office" | "Serviced office";

export type VacancyListing = {
  id: string;
  building: string;
  sector: VacancySector;
  sizeSqm: number;
  ratePerSqm: number;
  availability: string;
  description: string;
  features: string[];
  image: string;
};

const SECTOR_LABEL: Record<string, VacancySector> = {
  WAREHOUSE: "Warehouse",
  OFFICE: "Office",
  SERVICED_OFFICE: "Serviced office",
};

// Kept as a manual override for a future live listings.blendproperty.co.za
// API integration; not currently used by the DB-backed queries below, which
// always read the latest rows (Postgres is local/fast so there's no need to
// add a caching layer on top of it yet).
export const VACANCY_REVALIDATE_SECONDS =
  Number(process.env.VACANCY_REVALIDATE_SECONDS) || 60 * 60 * 24 * 7;

function slugFromBuilding(building: string, index: number) {
  return (
    building
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-") + `-${index}`
  );
}

// Falls back to the static snapshot if the database is briefly unreachable,
// so a DB hiccup never takes the public vacancies/availability pages down.
export async function getAllVacancies(): Promise<VacancyListing[]> {
  try {
    const rows = await prisma.vacancy.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    if (rows.length === 0) {
      return fallbackVacancies.map((v, i) => ({ id: slugFromBuilding(v.building, i), ...v }));
    }
    return rows.map((row) => ({
      id: row.id,
      building: row.building,
      sector: SECTOR_LABEL[row.sector] || "Office",
      sizeSqm: row.sizeSqm,
      ratePerSqm: row.ratePerSqm,
      availability: row.availability,
      description: row.description,
      features: row.features,
      image: row.image || "",
    }));
  } catch {
    return fallbackVacancies.map((v, i) => ({ id: slugFromBuilding(v.building, i), ...v }));
  }
}

export async function getVacanciesGroupedBySector() {
  const all = await getAllVacancies();
  return {
    warehouse: all.filter((v) => v.sector === "Warehouse"),
    office: all.filter((v) => v.sector === "Office"),
    servicedOffice: all.filter((v) => v.sector === "Serviced office"),
    all,
  };
}
