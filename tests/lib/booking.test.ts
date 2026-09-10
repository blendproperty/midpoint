import { describe, expect, it } from "vitest";
import { parseStay, staysOverlap } from "@/lib/booking";

describe("booking dates",()=>{
  it("calculates nights and rejects invalid stays",()=>{
    expect(parseStay("2026-09-12","2026-09-15")?.nights).toBe(3);
    expect(parseStay("2026-09-15","2026-09-15")).toBeNull();
    expect(parseStay("2026-09-16","2026-09-15")).toBeNull();
  });
  it("uses hotel overlap boundaries",()=>{
    const d=(s:string)=>new Date(`${s}T00:00:00Z`);
    expect(staysOverlap(d("2026-09-10"),d("2026-09-12"),d("2026-09-11"),d("2026-09-13"))).toBe(true);
    expect(staysOverlap(d("2026-09-10"),d("2026-09-12"),d("2026-09-12"),d("2026-09-14"))).toBe(false);
  });
});
