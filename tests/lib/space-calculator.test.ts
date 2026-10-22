import { describe, expect, it } from "vitest";
import { calculateRentalBudget, calculateSpaceRange } from "@/lib/space-calculator";

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

describe("calculateRentalBudget", () => {
  it("adds known recurring charges to the monthly base rent", () => {
    const result = calculateRentalBudget(500.66, 120, [1250, 500, null, 0]);
    expect(result.baseRent).toBeCloseTo(60079.2, 2);
    expect(result.subtotal).toBeCloseTo(61829.2, 2);
    expect(result.unconfirmedCharges).toBe(1);
  });
  it("keeps blank charges unconfirmed and accepts an explicitly confirmed zero", () => {
    expect(calculateRentalBudget(100, 110, [null, null, null, null])).toEqual({ baseRent: 11000, subtotal: 11000, unconfirmedCharges: 4 });
    expect(calculateRentalBudget(100, 110, [0, 0, 0, 0])).toEqual({ baseRent: 11000, subtotal: 11000, unconfirmedCharges: 0 });
  });
  it("rejects invalid base figures and leaves invalid charges unconfirmed", () => {
    for (const value of [0, -1, NaN, Infinity]) {
      expect(calculateRentalBudget(value, 110, []).subtotal).toBeNull();
      expect(calculateRentalBudget(100, value, []).baseRent).toBeNull();
    }
    expect(calculateRentalBudget(100, 110, [NaN, -1, Infinity])).toEqual({ baseRent: 11000, subtotal: 11000, unconfirmedCharges: 3 });
  });
  it("does not return infinity for overflowing inputs or totals", () => {
    expect(calculateRentalBudget(Number.MAX_VALUE, 2, []).baseRent).toBeNull();
    expect(calculateRentalBudget(100, 110, [Number.MAX_VALUE, Number.MAX_VALUE]).subtotal).toBeNull();
    expect(calculateRentalBudget(1e100, 100, []).baseRent).toBeNull();
  });
  it("retains half cents for the currency formatter instead of rounding them down early", () => {
    expect(calculateRentalBudget(0.03, 33.5, [0, 0, 0, 0])).toEqual({ baseRent: 1.005, subtotal: 1.005, unconfirmedCharges: 0 });
  });
});
