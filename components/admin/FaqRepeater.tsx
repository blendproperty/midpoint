"use client";

import { useRef, useState } from "react";

type Faq = { question: string; answer: string };
type Row = Faq & { id: number };

function toRows(items?: Faq[]): Row[] {
  return (items || []).map((it, i) => ({ ...it, id: i }));
}

export default function FaqRepeater({ name, defaultValue }: { name: string; defaultValue?: Faq[] }) {
  const nextId = useRef((defaultValue?.length || 0) + 1);
  const [rows, setRows] = useState<Row[]>(toRows(defaultValue));

  function update(id: number, patch: Partial<Faq>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }
  function add() {
    setRows((prev) => [...prev, { id: nextId.current++, question: "", answer: "" }]);
  }
  function remove(id: number) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  const json = JSON.stringify(rows.map(({ question, answer }) => ({ question, answer })));

  return (
    <div>
      <input type="hidden" name={name} value={json} readOnly />
      <div className="space-y-4">
        {rows.map((row, i) => (
          <div key={row.id} className="rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-500">FAQ {i + 1}</p>
              <button type="button" onClick={() => remove(row.id)} className="text-xs font-medium text-red-600 hover:underline">
                Remove
              </button>
            </div>
            <div className="mt-2">
              <label className="block text-xs font-medium text-slate-500">Question</label>
              <input
                value={row.question}
                onChange={(e) => update(row.id, { question: e.target.value })}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="mt-2">
              <label className="block text-xs font-medium text-slate-500">Answer</label>
              <textarea
                value={row.answer}
                onChange={(e) => update(row.id, { answer: e.target.value })}
                rows={3}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} className="mt-3 rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
        + Add FAQ
      </button>
    </div>
  );
}
