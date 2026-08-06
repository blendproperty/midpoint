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
