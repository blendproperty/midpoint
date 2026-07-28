"use client";

import { useRef, useState } from "react";

type LinkItem = { label: string; href: string };
type Row = LinkItem & { id: number };

function toRows(items?: LinkItem[]): Row[] {
  return (items || []).map((it, i) => ({ ...it, id: i }));
}

export default function LinkRepeater({ name, defaultValue }: { name: string; defaultValue?: LinkItem[] }) {
  const nextId = useRef((defaultValue?.length || 0) + 1);
  const [rows, setRows] = useState<Row[]>(toRows(defaultValue));

  function update(id: number, patch: Partial<LinkItem>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function add() {
    setRows((prev) => [...prev, { id: nextId.current++, label: "", href: "" }]);
  }
  function remove(id: number) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  const json = JSON.stringify(rows.map(({ label, href }) => ({ label, href })));

  return (
    <div>
      <input type="hidden" name={name} value={json} readOnly />
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={row.id} className="flex items-center gap-2">
            <input
              value={row.label}
              onChange={(e) => update(row.id, { label: e.target.value })}
              placeholder="Label, e.g. Warehouses to rent"
              className="w-1/2 rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <input
              value={row.href}
              onChange={(e) => update(row.id, { href: e.target.value })}
              placeholder="/warehouses"
              className="w-1/2 rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
            <button type="button" onClick={() => remove(row.id)} className="shrink-0 text-xs font-medium text-red-600 hover:underline">
              Remove
            </button>
            <span className="sr-only">Link {i + 1}</span>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} className="mt-3 rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
        + Add link
      </button>
    </div>
  );
}
