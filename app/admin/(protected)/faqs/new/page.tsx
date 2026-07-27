import FaqForm from "@/components/admin/FaqForm";
import { createFaq } from "../actions";

export default function NewFaqPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">New FAQ</h1>
      <FaqForm action={createFaq} submitLabel="Create FAQ" />
    </div>
  );
}
