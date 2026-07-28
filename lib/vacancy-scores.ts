// A listing-readiness score for Vacancies, in the same shape/spirit as
// listings.blendproperty.co.za's listingReadinessScore — checks the fields
// that actually make a listing usable and marketable, weighted 0-100.
export type VacancyScoreInput = {
  building: string;
  sector: string;
  sizeSqm: number;
  ratePerSqm: number;
  availability: string;
  description: string;
  features: string[];
  image: string | null;
  status: string;
};

export type VacancyScoreResult = {
  score: number;
  issues: string[];
};

function present(value: unknown) {
  return value !== null && value !== undefined && String(value).trim().length > 0;
}

export function vacancyReadinessScore(v: VacancyScoreInput): VacancyScoreResult {
  const checks: Array<{ passes: boolean; weight: number; issue: string }> = [
    { passes: present(v.building), weight: 15, issue: "Add a building name" },
    { passes: present(v.sector), weight: 10, issue: "Set the sector" },
    { passes: v.sizeSqm > 0 && v.ratePerSqm > 0, weight: 20, issue: "Set size and rate per m²" },
    { passes: present(v.availability), weight: 10, issue: "Confirm availability" },
    { passes: (v.description || "").length >= 100, weight: 20, issue: "Write a fuller description (100+ characters)" },
    { passes: v.features.length >= 2, weight: 15, issue: "List at least two features" },
    { passes: Boolean(v.image), weight: 10, issue: "Add a photo" },
  ];

  return {
    score: checks.reduce((sum, c) => sum + (c.passes ? c.weight : 0), 0),
    issues: checks.filter((c) => !c.passes).map((c) => c.issue),
  };
}
