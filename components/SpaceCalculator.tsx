"use client";

import { useEffect, useMemo, useState } from "react";
import { Calculator, X } from "lucide-react";

export type SpaceRange = { min: number; max: number; recommended: number };

type Props = {
  open: boolean;
  onClose: () => void;
  onApply: (range: SpaceRange) => void;
};

function NumberField({ label, help, value, onChange }: { label: string; help: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-4"><span className="font-semibold text-midpoint-dark">{label}</span><span className="text-xs text-midpoint-grey-400">{help}</span></span>
      <input type="number" min={0} max={500} value={value} onChange={(event) => onChange(Math.max(0, Number(event.target.value) || 0))} className="mt-2 w-full rounded-xl border border-midpoint-dark/15 px-4 py-3 text-midpoint-dark" />
    </label>
  );
}

export default function SpaceCalculator({ open, onClose, onApply }: Props) {
  const [employees, setEmployees] = useState(20);
  const [privateOffices, setPrivateOffices] = useState(2);
  const [meetingRooms, setMeetingRooms] = useState(2);
  const [collaborationSeats, setCollaborationSeats] = useState(8);
  const [reception, setReception] = useState(true);
  const [kitchen, setKitchen] = useState(true);
  const [storage, setStorage] = useState(true);

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, open]);

  const range = useMemo<SpaceRange>(() => {
    const raw = employees * 10 + privateOffices * 15 + meetingRooms * 20 + collaborationSeats * 5 + (reception ? 25 : 0) + (kitchen ? 40 : 0) + (storage ? 25 : 0);
    const recommended = Math.max(25, Math.round(raw / 5) * 5);
    return { recommended, min: Math.round((recommended * 0.85) / 5) * 5, max: Math.round((recommended * 1.15) / 5) * 5 };
  }, [collaborationSeats, employees, kitchen, meetingRooms, privateOffices, reception, storage]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-midpoint-dark/70 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" aria-labelledby="space-calculator-title" className="max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-card bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-5 border-b border-midpoint-grey-100 p-6 md:p-8">
          <div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-midpoint-cyan">Office planning tool</p><h2 id="space-calculator-title" className="mt-2 text-3xl font-bold text-midpoint-dark">Space calculator</h2><p className="mt-2 max-w-xl text-sm leading-6 text-midpoint-grey-400">Build an indicative requirement for your team. The result is a planning guide and should be confirmed with the Midpoint leasing team.</p></div>
          <button type="button" onClick={onClose} aria-label="Close calculator" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-midpoint-dark text-white"><X className="h-5 w-5" /></button>
        </div>

        <div className="grid gap-8 p-6 md:grid-cols-[1fr_0.8fr] md:p-8">
          <div className="grid gap-5">
            <NumberField label="Employees" help="Workstations and shared circulation" value={employees} onChange={setEmployees} />
            <NumberField label="Private offices" help="Enclosed individual offices" value={privateOffices} onChange={setPrivateOffices} />
            <NumberField label="Meeting rooms" help="Approximately 6–8 seats each" value={meetingRooms} onChange={setMeetingRooms} />
            <NumberField label="Collaboration seats" help="Informal project and touchdown space" value={collaborationSeats} onChange={setCollaborationSeats} />
          </div>
          <div>
            <p className="font-semibold text-midpoint-dark">Support spaces</p>
            <div className="mt-3 space-y-3">{[["Reception", reception, setReception], ["Kitchen / breakout", kitchen, setKitchen], ["Storage / support", storage, setStorage]].map(([label, checked, setter]) => <label key={String(label)} className="flex items-center gap-3 rounded-xl bg-[#f3f7f6] p-3 text-sm font-medium text-midpoint-dark"><input type="checkbox" checked={Boolean(checked)} onChange={(event) => (setter as (value: boolean) => void)(event.target.checked)} className="h-4 w-4 accent-[#32d8dc]" />{String(label)}</label>)}</div>
            <div className="mt-6 rounded-2xl bg-midpoint-dark p-6 text-white"><div className="flex items-center gap-2 text-midpoint-cyan"><Calculator className="h-5 w-5" /><p className="text-xs font-semibold uppercase tracking-[0.16em]">Recommended requirement</p></div><p className="mt-3 text-4xl font-bold">{range.recommended.toLocaleString("en-ZA")} m²</p><p className="mt-2 text-sm text-white/65">Suggested search range: {range.min.toLocaleString("en-ZA")}–{range.max.toLocaleString("en-ZA")} m²</p><button type="button" onClick={() => onApply(range)} className="mt-5 w-full rounded-full bg-midpoint-cyan px-5 py-3 text-sm font-bold text-midpoint-dark">Use this size</button></div>
          </div>
        </div>
      </div>
    </div>
  );
}
