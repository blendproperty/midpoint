"use client";

export default function DeleteEnquiryButton({ action }: { action: () => void }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Delete this enquiry? This can't be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <button className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100">
        Delete
      </button>
    </form>
  );
}
