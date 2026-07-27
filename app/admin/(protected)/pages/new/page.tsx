import PageForm from "@/components/admin/PageForm";
import { createPage } from "../actions";

export default function NewCmsPagePage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">New page</h1>
      <PageForm action={createPage} submitLabel="Create page" />
    </div>
  );
}
