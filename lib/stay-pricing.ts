export type StayConfig = {
  minStay: number;
  maxStay: number;
  weekendMultiplier: number;
  weeklyDiscount: number;
  monthlyDiscount: number;
  vatPercent: number;
  cleaningFee: number;
  checkInTime: string;
  checkOutTime: string;
  cancellationHours: number;
  codes: { code: string; percent: number; corporate: boolean }[];
  extras: {
    id: string;
    name: string;
    price: number;
    perNight: boolean;
    enabled: boolean;
  }[];
  rules: {
    from: string;
    to: string;
    categoryId: string;
    nightlyRate: number | null;
    closed: boolean;
    noArrival: boolean;
    noDeparture: boolean;
  }[];
};
export const defaultConfig: StayConfig = {
  minStay: 1,
  maxStay: 365,
  weekendMultiplier: 1,
  weeklyDiscount: 10,
  monthlyDiscount: 20,
  vatPercent: 15,
  cleaningFee: 0,
  checkInTime: "14:00",
  checkOutTime: "10:00",
  cancellationHours: 48,
  codes: [
    { code: "MIDPOINT10", percent: 10, corporate: false },
    { code: "CORP15", percent: 15, corporate: true },
  ],
  extras: [
    {
      id: "late",
      name: "Late checkout (test service)",
      price: 250,
      perNight: false,
      enabled: true,
    },
    {
      id: "laundry",
      name: "Laundry (test service)",
      price: 180,
      perNight: false,
      enabled: true,
    },
  ],
  rules: [],
};
export function day(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
    throw new Error("Choose valid dates.");
  const date = new Date(value + "T00:00:00.000Z");
  if (!Number.isFinite(+date) || date.toISOString().slice(0, 10) !== value)
    throw new Error("Choose valid dates.");
  return date;
}
export function todayZA() {
  return new Date(Date.now() + 7200000).toISOString().slice(0, 10);
}
export function stayDates(
  checkIn: string,
  checkOut: string,
  allowPast = false,
) {
  const start = day(checkIn),
    end = day(checkOut),
    nights = (+end - +start) / 86400000;
  if (nights < 1 || nights > 365 || (!allowPast && checkIn < todayZA()))
    throw new Error("Choose a future stay of 1–365 nights.");
  return { start, end, nights, checkIn, checkOut };
}
export function validateConfig(value: unknown): StayConfig {
  const c = value as StayConfig;
  if (!c || typeof c !== "object") throw new Error("Invalid rate settings.");
  for (const k of [
    "minStay",
    "maxStay",
    "weekendMultiplier",
    "weeklyDiscount",
    "monthlyDiscount",
    "vatPercent",
    "cleaningFee",
    "cancellationHours",
  ] as const)
    if (typeof c[k] !== "number" || !Number.isFinite(c[k]) || c[k] < 0)
      throw new Error("Invalid " + k);
  if (
    !Number.isInteger(c.minStay) ||
    !Number.isInteger(c.maxStay) ||
    c.minStay < 1 ||
    c.maxStay < c.minStay ||
    c.maxStay > 365 ||
    c.weekendMultiplier > 5 ||
    c.weeklyDiscount > 90 ||
    c.monthlyDiscount > 90 ||
    c.vatPercent > 50 ||
    c.cleaningFee > 100000
  )
    throw new Error("Rate settings out of range.");
  if (
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(c.checkInTime) ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(c.checkOutTime)
  )
    throw new Error("Invalid check-in/out time.");
  if (
    !Array.isArray(c.codes) ||
    !Array.isArray(c.extras) ||
    !Array.isArray(c.rules) ||
    c.codes.length > 100 ||
    c.rules.length > 500 ||
    c.extras.length > 30
  )
    throw new Error("Invalid lists.");
  const ids = new Set<string>();
  for (const x of c.extras) {
    if (
      !/^[a-z0-9-]{1,40}$/.test(x.id) ||
      ids.has(x.id) ||
      typeof x.name !== "string" ||
      x.name.length > 100 ||
      !Number.isFinite(x.price) ||
      x.price < 0 ||
      x.price > 100000 ||
      typeof x.enabled !== "boolean" ||
      typeof x.perNight !== "boolean"
    )
      throw new Error("Invalid extra.");
    ids.add(x.id);
  }
  const codes = new Set<string>();
  for (const x of c.codes) {
    if (
      !/^[A-Z0-9-]{1,30}$/.test(x.code) ||
      codes.has(x.code) ||
      !Number.isFinite(x.percent) ||
      x.percent < 0 ||
      x.percent > 90 ||
      typeof x.corporate !== "boolean"
    )
      throw new Error("Invalid promotional code.");
    codes.add(x.code);
  }
  for (const x of c.rules) {
    if (
      day(x.to) < day(x.from) ||
      typeof x.categoryId !== "string" ||
      typeof x.closed !== "boolean" ||
      typeof x.noArrival !== "boolean" ||
      typeof x.noDeparture !== "boolean" ||
      (x.nightlyRate !== null &&
        (!Number.isFinite(x.nightlyRate) || x.nightlyRate <= 0))
    )
      throw new Error("Invalid date restriction.");
  }
  return c;
}
export function quoteStay(
  category: { id: string; baseRate: unknown; maxGuests: number | null },
  checkIn: string,
  checkOut: string,
  guests: number,
  code: string,
  extras: string[],
  config: StayConfig,
  allowPast = false,
) {
  const stay = stayDates(checkIn, checkOut, allowPast);
  if (
    !Number.isInteger(guests) ||
    guests < 1 ||
    !category.maxGuests ||
    guests > category.maxGuests
  )
    throw new Error("This room does not accommodate that number of guests.");
  if (stay.nights < config.minStay || stay.nights > config.maxStay)
    throw new Error(
      "Stay must be " + config.minStay + "–" + config.maxStay + " nights.",
    );
  const base = Number(category.baseRate);
  if (!Number.isFinite(base) || base <= 0) throw new Error("Rate unavailable.");
  const promo = code
    ? config.codes.find((c) => c.code === code.toUpperCase())
    : undefined;
  if (code && !promo)
    throw new Error("That promotional or corporate code is not valid.");
  const discount = Math.max(
    stay.nights >= 30
      ? config.monthlyDiscount
      : stay.nights >= 7
        ? config.weeklyDiscount
        : 0,
    promo?.percent || 0,
  );
  const rules = config.rules.filter(
    (r) => !r.categoryId || r.categoryId === category.id,
  );
  const contains = (r: StayConfig["rules"][number], d: string) =>
    r.from <= d && r.to >= d;
  if (
    rules.some(
      (r) =>
        (r.noArrival && contains(r, checkIn)) ||
        (r.noDeparture && contains(r, checkOut)),
    )
  )
    throw new Error("Arrival or departure is closed on these dates.");
  const nightly = [];
  for (let i = 0; i < stay.nights; i++) {
    const d = new Date(+stay.start + i * 86400000),
      date = d.toISOString().slice(0, 10);
    const matching = rules.filter((r) => contains(r, date));
    if (matching.some((r) => r.closed))
      throw new Error("These dates include a blackout period.");
    const special = matching.filter((r) => r.nightlyRate !== null).at(-1);
    const raw =
      special?.nightlyRate ??
      base * ([5, 6].includes(d.getUTCDay()) ? config.weekendMultiplier : 1);
    nightly.push({ date, cents: Math.round(raw * 100 * (1 - discount / 100)) });
  }
  const roomCents = nightly.reduce((s, n) => s + n.cents, 0);
  const selected = [...new Set(extras)].map((id) => {
    const x = config.extras.find((e) => e.id === id && e.enabled);
    if (!x) throw new Error("Selected extra is unavailable.");
    return {
      id: x.id,
      name: x.name,
      cents: Math.round(x.price * 100) * (x.perNight ? stay.nights : 1),
    };
  });
  const cleaningCents = Math.round(config.cleaningFee * 100);
  const extrasCents = selected.reduce((s, e) => s + e.cents, 0);
  const totalCents = roomCents + extrasCents + cleaningCents;
  const vatCents = Math.round(
    (totalCents * config.vatPercent) / (100 + config.vatPercent),
  );
  return {
    checkIn,
    checkOut,
    nights: stay.nights,
    guests,
    code: code.toUpperCase(),
    discount,
    nightly,
    roomCents,
    cleaningCents,
    extrasCents,
    totalCents,
    vatCents,
    extras: selected,
    currency: "ZAR",
    test: true,
    checkInTime: config.checkInTime,
    checkOutTime: config.checkOutTime,
    cancellationHours: config.cancellationHours,
  };
}
export type StayQuote = ReturnType<typeof quoteStay>;
export function money(cents: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 2,
  }).format(cents / 100);
}
