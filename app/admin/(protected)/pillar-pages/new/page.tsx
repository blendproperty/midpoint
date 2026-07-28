import PillarPageForm from "@/components/admin/PillarPageForm";
import { createPillarPage } from "../actions";

export default function NewPillarPagePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">New pillar page</h1>
      <PillarPageForm action={createPillarPage} submitLabel="Create pillar page" />
    </div>
  );
}
