"use client";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import type { StayConfig } from "@/lib/stay-pricing";
function Save() {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="stay-button mt-5">
      {pending ? "Saving…" : "Save test settings"}
    </button>
  );
}
export default function RateEditor({
  initial,
  action,
}: {
  initial: StayConfig;
  action: (data: FormData) => Promise<void>;
}) {
  const [c, set] = useState(initial);
  const fields: Record<string, string> = {
    minStay: "Minimum nights",
    maxStay: "Maximum nights",
    weekendMultiplier: "Friday / Saturday multiplier",
    weeklyDiscount: "7+ night discount %",
    monthlyDiscount: "30+ night discount %",
    vatPercent: "Test VAT included %",
    cleaningFee: "Cleaning fee (R)",
    cancellationHours: "Free cancellation notice (hours)",
    checkInTime: "Check-in from",
    checkOutTime: "Check-out by",
  };
  const lists = (["codes", "extras", "rules"] as const).map((key) => (
    <section key={key} className="stay-card">
      <h2 className="text-xl font-semibold capitalize mb-4">
        {key === "codes"
          ? "Promotional & corporate codes"
          : key === "rules"
            ? "Date overrides & closures"
            : "Optional extras"}
      </h2>
      {key === "rules" && (
        <p className="text-sm mb-4">
          Inclusive dates. Blank category ID applies to all rooms. Blank nightly
          rate uses standard pricing.
        </p>
      )}
      {c[key].map((x, i) => (
        <div key={i} className="mb-5 border-b pb-5 grid gap-4 sm:grid-cols-3">
          {Object.entries(x).map(([field, value]) => (
            <label key={field} className="stay-label">
              {field.replace(/([A-Z])/g, " $1")}
              {typeof value === "boolean" ? (
                <input
                  type="checkbox"
                  className="ml-3"
                  checked={value}
                  onChange={(e) =>
                    set({
                      ...c,
                      [key]: c[key].map((v, j) =>
                        j === i ? { ...v, [field]: e.target.checked } : v,
                      ),
                    })
                  }
                />
              ) : (
                <input
                  className="stay-input"
                  type={
                    ["from", "to"].includes(field)
                      ? "date"
                      : typeof value === "number" || field === "nightlyRate"
                        ? "number"
                        : "text"
                  }
                  step="any"
                  value={value ?? ""}
                  readOnly={field === "id"}
                  onChange={(e) =>
                    set({
                      ...c,
                      [key]: c[key].map((v, j) =>
                        j === i
                          ? {
                              ...v,
                              [field]:
                                field === "nightlyRate" && !e.target.value
                                  ? null
                                  : typeof value === "number" ||
                                      field === "nightlyRate"
                                    ? Number(e.target.value)
                                    : field === "code"
                                      ? e.target.value.toUpperCase()
                                      : e.target.value,
                            }
                          : v,
                      ),
                    })
                  }
                />
              )}
            </label>
          ))}
          <button
            type="button"
            className="stay-secondary self-end"
            onClick={() =>
              set({ ...c, [key]: c[key].filter((_, j) => j !== i) })
            }
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="stay-secondary"
        onClick={() =>
          set({
            ...c,
            [key]: [
              ...c[key],
              key === "codes"
                ? {
                    code: "NEW" + c.codes.length,
                    percent: 10,
                    corporate: false,
                  }
                : key === "extras"
                  ? {
                      id: "extra-" + Date.now(),
                      name: "New test extra",
                      price: 0,
                      perNight: false,
                      enabled: false,
                    }
                  : {
                      from: "",
                      to: "",
                      categoryId: "",
                      nightlyRate: null,
                      closed: false,
                      noArrival: false,
                      noDeparture: false,
                    },
            ],
          })
        }
      >
        Add{" "}
        {key === "codes" ? "code" : key === "extras" ? "extra" : "date rule"}
      </button>
    </section>
  ));
  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="config" value={JSON.stringify(c)} />
      <section className="stay-card">
        <h2 className="text-xl font-semibold mb-5">Pricing & stay policies</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {Object.entries(fields).map(([key, label]) => (
            <label className="stay-label" key={key}>
              {label}
              <input
                required
                className="stay-input"
                type={key.endsWith("Time") ? "time" : "number"}
                min="0"
                step="any"
                value={String(c[key as keyof StayConfig])}
                onChange={(e) =>
                  set({
                    ...c,
                    [key]: key.endsWith("Time")
                      ? e.target.value
                      : Number(e.target.value),
                  })
                }
              />
            </label>
          ))}
        </div>
      </section>
      {lists}
      <Save />
    </form>
  );
}
