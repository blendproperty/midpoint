import { requireAdmin } from "@/lib/require-admin";
import { configFor } from "@/lib/stay-service";
import { saveRates } from "./actions";
import RateEditor from "@/components/RateEditor";
import Link from "next/link";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; saved?: string }>;
}) {
  await requireAdmin();
  const [config, q] = await Promise.all([configFor(), searchParams]);
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Rates, extras & booking rules</h1>
      <p>
        Staging test settings only. The best applicable discount wins; discounts
        do not stack. Rates include the configured test VAT.
      </p>
      <Link href="/admin/rooms" className="inline-block underline">
        Edit category base rates and occupancy →
      </Link>
      {q.error && (
        <p role="alert" className="text-red-700">
          {q.error}
        </p>
      )}
      {q.saved && (
        <p role="status" className="text-green-800">
          Settings saved.
        </p>
      )}
      <RateEditor initial={config} action={saveRates} />
    </div>
  );
}
