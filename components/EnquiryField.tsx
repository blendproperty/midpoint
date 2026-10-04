import type { ReactNode } from "react";

export default function EnquiryField({ id, label, required = false, className = "", children }: {
  id: string; label: string; required?: boolean; className?: string; children: ReactNode;
}) {
  return <div className={`min-w-0 ${className}`}>
    <label htmlFor={id} className="mb-2 block text-sm font-medium text-white">
      {label}{required ? <span className="ml-1 text-white/80">(required)</span> : <span className="ml-1 text-white/80">(optional)</span>}
    </label>
    {children}
  </div>;
}
