import { prisma } from "@/lib/prisma";

export const BOOKABLE_ROOM_STATUSES = ["AVAILABLE", "OCCUPIED"] as const;
export const BLOCKING_RESERVATION_STATUSES = ["PENDING", "CONFIRMED", "CHECKED_IN"] as const;

export function parseStay(checkIn?: string, checkOut?: string) {
  if (!checkIn || !checkOut || !/^\d{4}-\d{2}-\d{2}$/.test(checkIn) || !/^\d{4}-\d{2}-\d{2}$/.test(checkOut)) return null;
  const start = new Date(`${checkIn}T00:00:00.000Z`), end = new Date(`${checkOut}T00:00:00.000Z`);
  const nights = Math.round((end.getTime() - start.getTime()) / 86_400_000);
  if (!Number.isFinite(nights) || nights < 1 || nights > 365) return null;
  return { start, end, nights, checkIn, checkOut };
}

export function staysOverlap(existingIn: Date, existingOut: Date, requestedIn: Date, requestedOut: Date) {
  return existingIn < requestedOut && existingOut > requestedIn;
}

export async function getAvailability(checkIn: string, checkOut: string, guests: number) {
  const stay = parseStay(checkIn, checkOut);
  if (!stay || !Number.isInteger(guests) || guests < 1 || guests > 12) return null;
  const categories = await prisma.roomCategory.findMany({
    where: { active: true, OR: [{ maxGuests: null }, { maxGuests: { gte: guests } }] },
    include: {
      rooms: {
        where: {
          active: true,
          status: { in: [...BOOKABLE_ROOM_STATUSES] },
          reservations: { none: { status: { in: [...BLOCKING_RESERVATION_STATUSES] }, checkIn: { lt: stay.end }, checkOut: { gt: stay.start } } },
        },
        select: { id: true },
      },
    },
    orderBy: { name: "asc" },
  });
  return { ...stay, guests, categories: categories.map(({ rooms, ...category }) => ({ ...category, availableRooms: rooms.length })) };
}

export function formatRand(value: { toString(): string } | number | null) {
  if (value === null) return null;
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(Number(value));
}
