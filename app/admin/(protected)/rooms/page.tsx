import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { updateCategory, updateRoom } from "./actions";
import SaveOperationForm from "@/components/admin/SaveOperationForm";
import { PageHeading } from "@/components/admin/OperationsUI";

const statuses = [
  "AVAILABLE",
  "OCCUPIED",
  "OUT_OF_SERVICE",
  "MAINTENANCE",
  "BLOCKED",
];
const input = "rounded border border-slate-300 px-2 py-1.5 text-sm";
export default async function RoomsAdmin() {
  await requireAdmin();
  const [categories, rooms] = await Promise.all([
    prisma.roomCategory.findMany({ orderBy: { name: "asc" } }),
    prisma.room.findMany({
      include: { category: true },
      orderBy: { roomNumber: "asc" },
    }),
  ]);
  return (
    <div>
      <PageHeading title="A place for every stay." description="Manage physical rooms, category assignments and sample base rates. Changes apply to test inventory."/>
      <p className="mt-2 text-sm text-slate-600">
        Configure the approved category split, room identifiers and rates before
        activating public availability.
      </p>
      <section className="mt-8">
        <h2 className="text-lg font-semibold">Room categories</h2>
        <div className="mt-3 grid gap-4 lg:grid-cols-2">
          {categories.map((c) => (
            <SaveOperationForm
              key={c.id}
              action={updateCategory.bind(null, c.id)}
              className="rounded-xl border bg-white p-4"
            >
              <h3 className="font-semibold">
                {c.name}{" "}
                <span className="text-xs text-slate-500">({c.code})</span>
              </h3>
              <div className="mt-3 flex flex-wrap items-end gap-3">
                <label className="text-xs">
                  Max guests
                  <input
                    name="maxGuests"
                    type="number"
                    min="1"
                    defaultValue={c.maxGuests || ""}
                    className={`${input} mt-1 block w-24`}
                  />
                </label>
                <label className="text-xs">
                  Base rate (ZAR)
                  <input
                    name="baseRate"
                    type="number"
                    min="0"
                    step="0.01"
                    defaultValue={c.baseRate?.toString() || ""}
                    className={`${input} mt-1 block w-32`}
                  />
                </label>
                <label className="flex gap-2 text-sm">
                  <input
                    name="active"
                    type="checkbox"
                    defaultChecked={c.active}
                  />
                  Available in test search
                </label>
                <button className="rounded bg-slate-900 px-4 py-2 text-sm text-white">
                  Save
                </button>
              </div>
            </SaveOperationForm>
          ))}
        </div>
      </section>
      <section className="mt-10">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold">Physical rooms</h2>
          <strong>{rooms.length} total</strong>
        </div>
        <div className="mt-3 space-y-3">
          {rooms.map((r) => (
            <SaveOperationForm
              key={r.id}
              action={updateRoom.bind(null, r.id)}
              className="grid gap-3 rounded-xl border bg-white p-5 sm:grid-cols-2 xl:grid-cols-4 items-end"
            >
              <input
                aria-label="Room number"
                name="roomNumber"
                required
                defaultValue={r.roomNumber}
                className={input}
              />
              <input
                aria-label="Floor"
                name="floor"
                placeholder="Floor"
                defaultValue={r.floor || ""}
                className={input}
              />
              <select
                aria-label="Room category"
                name="categoryId"
                defaultValue={r.categoryId || ""}
                className={input}
              >
                <option value="">Unassigned</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <select aria-label="Operational status"
                name="status" defaultValue={r.status} className={input}>
                {statuses.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <input
                aria-label="Inventory notes"
                name="notes"
                placeholder="Notes"
                defaultValue={r.notes || ""}
                className={input}
              />
              <label className="flex gap-2 text-sm">
                <input
                  name="active"
                  type="checkbox"
                  defaultChecked={r.active}
                />
                Active
              </label>
              <button className="rounded bg-slate-900 px-3 py-2 text-sm text-white">
                Save
              </button>
            </SaveOperationForm>
          ))}
        </div>
      </section>
    </div>
  );
}
