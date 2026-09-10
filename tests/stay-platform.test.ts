import { describe, it, expect, afterAll } from "vitest";
import {
  defaultConfig,
  day,
  quoteStay,
  validateConfig,
} from "@/lib/stay-pricing";
import { prisma } from "@/lib/prisma";
import {
  reserve,
  payTest,
  owned,
  searchStay,
  requestCancellation,
  type BookingInput,
} from "@/lib/stay-service";
import { changeReservation, blockRoom } from "@/lib/stay-admin";
import { randomUUID } from "node:crypto";
const category = { id: "test", baseRate: 1150, maxGuests: 2 };
describe("stay pricing", () => {
  it("rejects invalid dates and capacities", () => {
    expect(() => day("2028-02-30")).toThrow();
    expect(() =>
      quoteStay(category, "2028-01-01", "2028-01-01", 1, "", [], defaultConfig),
    ).toThrow();
    expect(() =>
      quoteStay(category, "2028-01-01", "2028-01-02", 3, "", [], defaultConfig),
    ).toThrow();
  });
  it("calculates inclusive VAT, extras and best nonstacking discount", () => {
    const q = quoteStay(
      category,
      "2028-01-01",
      "2028-01-08",
      2,
      "CORP15",
      ["late", "late"],
      defaultConfig,
    );
    expect(q.totalCents).toBe(709250);
    expect(q.discount).toBe(15);
    expect(q.extras).toHaveLength(1);
    expect(q.vatCents).toBe(Math.round((709250 * 15) / 115));
  });
  it("applies 30-night discounts and blocks invalid codes", () => {
    expect(
      quoteStay(
        category,
        "2028-01-01",
        "2028-01-31",
        1,
        "MIDPOINT10",
        [],
        defaultConfig,
      ).discount,
    ).toBe(20);
    expect(() =>
      quoteStay(
        category,
        "2028-01-01",
        "2028-01-02",
        1,
        "UNKNOWN",
        [],
        defaultConfig,
      ),
    ).toThrow();
  });
  it("respects closures, arrival rules and configuration validation", () => {
    const c = structuredClone(defaultConfig);
    c.rules = [
      {
        from: "2028-01-01",
        to: "2028-01-03",
        categoryId: "",
        nightlyRate: null,
        closed: true,
        noArrival: false,
        noDeparture: false,
      },
    ];
    expect(() =>
      quoteStay(category, "2028-01-01", "2028-01-02", 1, "", [], c),
    ).toThrow();
    expect(() => validateConfig({ ...c, weeklyDiscount: 101 })).toThrow();
  });
});
describe.skipIf(process.env.BOOKING_INTEGRATION !== "1")(
  "real PostgreSQL booking transactions",
  () => {
    const tag = "integration-" + randomUUID(),
      token = randomUUID();
    let cat: string, room: string;
    const input = (): BookingInput => ({
      categoryId: cat,
      checkIn: "2028-05-01",
      checkOut: "2028-05-04",
      guests: 1,
      code: "",
      extras: [],
      firstName: "Synthetic",
      lastName: "Tester",
      guestFirstName: "Synthetic",
      guestLastName: "Tester",
      email: "qa@example.test",
      mobile: "+27000000000",
      country: "South Africa",
      company: "",
      vatNumber: "",
      poNumber: "",
      costCentre: "",
      requests: "Automated test",
      consent: true,
      idempotencyKey: randomUUID(),
    });
    afterAll(async () => {
      if (cat) {
        await prisma.reservation.deleteMany({ where: { categoryId: cat } });
        await prisma.room.deleteMany({ where: { categoryId: cat } });
        await prisma.roomCategory.delete({ where: { id: cat } });
      }
      await prisma.$disconnect();
    });
    it("runs last-room concurrency, idempotency, payment and operations end to end", async () => {
      if (
        !process.env.DATABASE_URL?.includes(
          "localhost:55439/midpoint_booking_test",
        )
      )
        throw new Error("Dedicated local test database required");
      const c = await prisma.roomCategory.create({
        data: {
          name: tag,
          code: tag,
          slug: tag,
          description: "Synthetic test category",
          baseRate: 1150,
          maxGuests: 2,
          active: true,
          images: [],
          amenities: [],
        },
      });
      cat = c.id;
      room = (
        await prisma.room.create({
          data: {
            roomNumber: tag,
            categoryId: cat,
            active: true,
            status: "AVAILABLE",
          },
        })
      ).id;
      const first = input(),
        second = input();
      const result = await Promise.allSettled([
        reserve(first, token),
        reserve(second, token),
      ]);
      expect(result.filter((r) => r.status === "fulfilled")).toHaveLength(1);
      const win = result.find(
        (r) => r.status === "fulfilled",
      ) as PromiseFulfilledResult<Awaited<ReturnType<typeof reserve>>>;
      const r = win.value;
      expect(
        (
          await reserve(
            r.idempotencyKey === first.idempotencyKey ? first : second,
            token,
          )
        ).id,
      ).toBe(r.id);
      expect(await owned(r.bookingReference, "wrong")).toBeNull();
      expect(
        (await payTest(r.bookingReference, token, "declined")).status,
      ).toBe("PENDING");
      await payTest(r.bookingReference, token, "success");
      await payTest(r.bookingReference, token, "success");
      expect(
        await prisma.bookingMessage.count({ where: { reservationId: r.id } }),
      ).toBe(1);
      await expect(
        prisma.reservation.create({
          data: {
            bookingReference: randomUUID(),
            roomId: room,
            categoryId: cat,
            checkIn: new Date("2028-05-02"),
            checkOut: new Date("2028-05-03"),
            guestFirstName: "Other",
            guestLastName: "Test",
            guestEmail: "other@example.test",
            status: "CONFIRMED",
          },
        }),
      ).rejects.toThrow();
      await expect(
        blockRoom(room, "2028-05-02", "2028-05-03", "Maintenance", "test"),
      ).rejects.toThrow();
      await requestCancellation(r.bookingReference, token);
      await changeReservation(r.id, "cancel", "test");
      expect(
        (await prisma.reservation.findUniqueOrThrow({ where: { id: r.id } }))
          .paymentStatus,
      ).toBe("REFUNDED");
      const fresh = await reserve(input(), token);
      await prisma.reservation.update({
        where: { id: fresh.id },
        data: { expiresAt: new Date(0) },
      });
      const corp = await reserve(
        { ...input(), company: "Test Company", code: "CORP15" },
        token,
      );
      await payTest(corp.bookingReference, token, "corporate");
      const adjacent = await reserve(
        { ...input(), checkIn: "2028-05-04", checkOut: "2028-05-05" },
        token,
      );
      await expect(
        changeReservation(corp.id, "move", "test", {
          roomId: room,
          checkIn: "2028-05-02",
          checkOut: "2028-05-05",
        }),
      ).rejects.toThrow();
      await changeReservation(adjacent.id, "cancel", "test");
      await changeReservation(corp.id, "move", "test", {
        roomId: room,
        checkIn: "2028-05-01",
        checkOut: "2028-05-05",
      });
      await changeReservation(corp.id, "settle", "test");
      expect(
        (await prisma.reservation.findUniqueOrThrow({ where: { id: corp.id } }))
          .paymentStatus,
      ).toBe("PAID");
      await changeReservation(corp.id, "checkin", "test");
      await changeReservation(corp.id, "checkout", "test");
      await blockRoom(
        room,
        "2028-05-01",
        "2028-05-04",
        "Test maintenance",
        "test",
      );
      expect(
        (await searchStay("2028-05-01", "2028-05-04", 1)).rows.find(
          (r) => r.category.id === cat,
        )?.available,
      ).toBe(0);
    }, 30000);
  },
);
