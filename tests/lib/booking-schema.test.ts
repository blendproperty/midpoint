import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("booking inventory schema",()=>{
  it("models categories, physical rooms and reservations",()=>{
    const schema=fs.readFileSync(path.join(process.cwd(),"prisma","schema.prisma"),"utf8");
    const migration=fs.readFileSync(path.join(process.cwd(),"prisma","migrations","20260910150000_add_room_booking_phase1","migration.sql"),"utf8");
    expect(schema).toContain("model RoomCategory");
    expect(schema).toContain("model Room {");
    expect(schema).toContain("model Reservation");
    expect(migration).toContain("generate_series(1,18)");
    expect(migration).toContain("'BLOCKED', false");
  });
});
