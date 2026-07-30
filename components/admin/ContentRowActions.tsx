"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";

type ContentAction = () => Promise<void>;

type Props = {
  editHref: string;
  title: string;
  status: string;
  draftAction?: ContentAction;
  reviewAction?: ContentAction;
  deleteAction?: ContentAction;
};

function ActionButton({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`${className} disabled:cursor-wait disabled:opacity-50`}>
      {pending ? "Working…" : label}
    </button>
  );
}

export default function ContentRowActions({
  editHref,
  title,
  status,
  draftAction,
  reviewAction,
  deleteAction,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-x-3 gap-y-2">
      <Link href={editHref} className="font-medium text-midpoint-dark underline">
        Edit
      </Link>
      {draftAction && status !== "DRAFT" && (
        <form action={draftAction}>
          <ActionButton label="Draft" className="text-slate-600 underline" />
        </form>
      )}
      {reviewAction && status !== "REVIEW" && (
        <form action={reviewAction}>
          <ActionButton label="Review" className="text-amber-700 underline" />
        </form>
      )}
      {deleteAction && (
        <form
          action={deleteAction}
          onSubmit={(event) => {
            if (!window.confirm(`Permanently delete "${title}"? This cannot be undone.`)) event.preventDefault();
          }}
        >
          <ActionButton label="Delete" className="text-red-600 underline" />
        </form>
      )}
    </div>
  );
}
