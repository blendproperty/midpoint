export type SpaceRange = { min: number; max: number; recommended: number };

export type SpaceCalculatorValues = {
  employees: number;
  privateOffices: number;
  meetingRooms: number;
  collaborationSeats: number;
};

export function calculateSpaceRange(values: SpaceCalculatorValues): SpaceRange {
  const raw = values.employees * 10
    + values.privateOffices * 15
    + values.meetingRooms * 20
    + values.collaborationSeats * 5
    + 90;
  const recommended = Math.max(25, Math.round(raw / 5) * 5);
  return {
    recommended,
    min: Math.round((recommended * 0.85) / 5) * 5,
    max: Math.round((recommended * 1.15) / 5) * 5,
  };
}

export function calculateRentalBudget(area: number, rate: number, charges: (number | null)[]) {
  const knownCharges = charges.filter((value): value is number => value !== null && Number.isFinite(value) && value >= 0);
  const product = area * rate;
  const baseRent = Number.isFinite(area) && area > 0 && Number.isFinite(rate) && rate > 0 && product <= Number.MAX_SAFE_INTEGER / 100
    ? product : null;
  const sum = baseRent === null ? null : baseRent + knownCharges.reduce((total, value) => total + value, 0);
  const subtotal = sum !== null && sum <= Number.MAX_SAFE_INTEGER / 100 ? sum : null;
  return { baseRent, subtotal, unconfirmedCharges: charges.length - knownCharges.length };
}
