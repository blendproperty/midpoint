"use client";
import { useState, useRef, useEffect } from "react";
import { todayZA } from "@/lib/stay-pricing";
export default function DateRangePicker({
  checkIn,
  checkOut,
  onChange,
}: {
  checkIn: string;
  checkOut: string;
  onChange: (a: string, b: string) => void;
}) {
  const [open, setOpen] = useState(false),
    [month, setMonth] = useState(
      () => new Date((checkIn || todayZA()).slice(0, 7) + "-01T12:00:00Z"),
    ),
    [pickingEnd, setPickingEnd] = useState(false),
    container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  const display = (d: string) =>
    d
      ? new Date(d + "T12:00:00Z").toLocaleDateString("en-ZA", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Select date";
  function select(d: string) {
    if (!pickingEnd || d <= checkIn) {
      onChange(d, "");
      setPickingEnd(true);
    } else {
      onChange(checkIn, d);
      setPickingEnd(false);
      setOpen(false);
    }
  }
  function calendar(offset: number) {
    const first = new Date(
        Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + offset, 1, 12),
      ),
      days = new Date(
        Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0),
      ).getUTCDate(),
      pad = (first.getUTCDay() + 6) % 7;
    return (
      <div className={offset ? "hidden md:block" : ""}>
        <h3 className="mb-4 text-center font-semibold">
          {first.toLocaleDateString("en-ZA", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {["M", "T", "W", "T", "F", "S", "S"].map((v, i) => (
            <span key={i} className="py-2 text-stone-500">
              {v}
            </span>
          ))}
          {Array.from({ length: pad }, (_, i) => (
            <span key={"pad" + i} />
          ))}
          {Array.from({ length: days }, (_, i) => {
            const d = new Date(
                Date.UTC(
                  first.getUTCFullYear(),
                  first.getUTCMonth(),
                  i + 1,
                  12,
                ),
              )
                .toISOString()
                .slice(0, 10),
              selected = d === checkIn || d === checkOut,
              inRange = checkIn && checkOut && d > checkIn && d < checkOut;
            return (
              <button
                type="button"
                key={d}
                aria-label={d}
                aria-pressed={selected}
                disabled={d < todayZA()}
                onClick={() => select(d)}
                className={
                  "rounded-lg py-2.5 text-sm disabled:text-stone-300 focus:outline-2 focus:outline-green-800 " +
                  (selected
                    ? "bg-[#27362f] text-white"
                    : inRange
                      ? "bg-green-100"
                      : "hover:bg-stone-100")
                }
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  return (
    <div ref={container} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="grid w-full grid-cols-2 gap-3 text-left"
      >
        <span className="stay-label">
          Check in
          <span className="stay-input whitespace-nowrap">
            {display(checkIn)}
          </span>
        </span>
        <span className="stay-label">
          Check out
          <span className="stay-input whitespace-nowrap">
            {display(checkOut)}
          </span>
        </span>
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="Select stay dates"
          className="absolute left-0 top-full z-50 mt-3 w-[min(620px,calc(100vw-48px))] rounded-2xl border bg-white p-5 shadow-2xl text-[#27362f]"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <button
              type="button"
              aria-label="Previous month"
              onClick={() =>
                setMonth(
                  new Date(
                    Date.UTC(
                      month.getUTCFullYear(),
                      month.getUTCMonth() - 1,
                      1,
                      12,
                    ),
                  ),
                )
              }
            >
              ←
            </button>
            <span className="text-sm">
              {pickingEnd
                ? "Choose your check-out date"
                : "Choose your check-in date"}
            </span>
            <button
              type="button"
              aria-label="Next month"
              onClick={() =>
                setMonth(
                  new Date(
                    Date.UTC(
                      month.getUTCFullYear(),
                      month.getUTCMonth() + 1,
                      1,
                      12,
                    ),
                  ),
                )
              }
            >
              →
            </button>
            <button
              type="button"
              aria-label="Close calendar"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {calendar(0)}
            {calendar(1)}
          </div>
          <p className="mt-4 text-xs text-stone-500">
            Room availability is checked when you search. Past dates cannot be
            selected.
          </p>
        </div>
      )}
    </div>
  );
}
