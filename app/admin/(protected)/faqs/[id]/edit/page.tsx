import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import FaqForm from "@/components/admin/FaqForm";
import { updateFaq } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const faq = await prisma.faq.findUnique({ where: { id } });
  if (!faq) notFound();

  const action = updateFaq.bind(null, id);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Edit FAQ</h1>
      <FaqForm
        action={action}
        submitLabel="Save changes"
        defaultValues={{ question: faq.question, answer: faq.answer, sortOrder: faq.sortOrder }}
      />
    </div>
  );
}
