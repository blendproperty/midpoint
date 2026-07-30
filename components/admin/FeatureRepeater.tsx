"use client";

import { useRef, useState } from "react";
import MediaPicker from "@/components/admin/MediaPicker";

type Feature = { heading: string; text: string; image: string; alt?: string };
type Row = Feature & { id: number };

function toRows(items?: Feature[]): Row[] {
  return (items || []).map((it, i) => ({ ...it, id: i }));
}

export default function FeatureRepeater({ name, defaultValue }: { name: string; defaultValue?: Feature[] }) {
  const nextId = useRef((defaultValue?.length || 0) + 1);
  const [rows, setRows] = useState<Row[]>(toRows(defaultValue));

  function update(id: number, patch: Partial<Feature>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function add() {
    setRows((prev) => [...prev, { id: nextId.current++, heading: "", text: "", image: "", alt: "" }]);
  }
  function remove(id: number) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  const json = JSON.stringify(rows.map(({ heading, text, image, alt }) => ({ heading, text, image, alt: alt || "" })));

  return (
    <div>
      <input type="hidden" name={name} value={json} readOnly />
      <div className="space-y-4">
        {rows.map((row, i) => (
          <div key={row.id} className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500">Feature {i + 1}</p>
              <button type="button" onClick={() => remove(row.id)} className="text-xs font-medium text-red-600 hover:underline">
                Remove
              </button>
            </div>
            <div className="mt-2">
              <label className="block text-xs font-medium text-slate-500">Heading</label>
              <input
                value={row.heading}
                onChange={(e) => update(row.id, { heading: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="mt-2">
              <label className="block text-xs font-medium text-slate-500">Text</label>
              <textarea
                value={row.text}
                onChange={(e) => update(row.id, { text: e.target.value })}
                rows={3}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="mt-2">
              <MediaPicker
                name={`__feature_image_${row.id}`}
                label="Image"
                defaultValue={row.image}
                onChange={(url, alt) => update(row.id, { image: url, ...(alt !== undefined ? { alt } : {}) })}
              />
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} className="mt-3 rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
        + Add feature
      </button>
    </div>
  );
}
