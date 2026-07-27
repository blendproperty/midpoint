import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import VacancyForm from "@/components/admin/VacancyForm";
import { updateVacancy } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditVacancyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const vacancy = await prisma.vacancy.findUnique({ where: { id } });
  if (!vacancy) notFound();

  const action = updateVacancy.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Edit vacancy</h1>
      <VacancyForm
        action={action}
        submitLabel="Save changes"
        defaultValues={{
          building: vacancy.building,
          sector: vacancy.sector,
          sizeSqm: vacancy.sizeSqm,
          ratePerSqm: vacancy.ratePerSqm,
          availability: vacancy.availability,
          description: vacancy.description,
          features: vacancy.features,
          image: vacancy.image || "",
          status: vacancy.status,
          sortOrder: vacancy.sortOrder,
        }}
      />
    </div>
  );
}
