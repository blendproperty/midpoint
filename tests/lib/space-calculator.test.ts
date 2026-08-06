import { describe, expect, it } from "vitest";
import { calculateSpaceRange } from "@/lib/space-calculator";

describe("calculateSpaceRange", () => {
  it("calculates the default office requirement", () => {
    expect(calculateSpaceRange({
      employees: 20,
      privateOffices: 2,
      meetingRooms: 2,
      collaborationSeats: 8,
    })).toEqual({ recommended: 400, min: 340, max: 460 });
  });

  it("always provides a usable minimum requirement", () => {
    expect(calculateSpaceRange({ employees: 0, privateOffices: 0, meetingRooms: 0, collaborationSeats: 0 }))
      .toEqual({ recommended: 90, min: 75, max: 105 });
  });
});
