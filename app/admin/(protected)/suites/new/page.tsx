import { requireAdmin } from "@/lib/require-admin";
import SuiteForm from "@/components/admin/SuiteForm";
import { createSuite } from "../actions";

export default async function NewSuitePage() {
  await requireAdmin();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">New suite</h1>
      <div className="mt-6">
        <SuiteForm action={createSuite} submitLabel="Create suite" />
      </div>
    </div>
  );
}
