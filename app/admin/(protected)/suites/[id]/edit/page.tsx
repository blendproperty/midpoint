import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import SuiteForm from "@/components/admin/SuiteForm";
import { updateSuite } from "../../actions";

export default async function EditSuitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const suite = await prisma.suite.findUnique({ where: { id } });
  if (!suite) notFound();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Edit suite</h1>
      <div className="mt-6">
        <SuiteForm
          action={updateSuite.bind(null, id)}
          submitLabel="Save changes"
          defaultValues={{
            name: suite.name,
            slug: suite.slug,
            description: suite.description,
            maxGuests: suite.maxGuests,
            nightlyRate: suite.nightlyRate,
            image: suite.image ?? "",
            features: suite.features,
            status: suite.status,
          }}
        />
      </div>
    </div>
  );
}
