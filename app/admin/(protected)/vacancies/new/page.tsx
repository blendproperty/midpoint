import VacancyForm from "@/components/admin/VacancyForm";
import { createVacancy } from "../actions";

export default function NewVacancyPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">New vacancy</h1>
      <VacancyForm action={createVacancy} submitLabel="Create vacancy" />
    </div>
  );
}
