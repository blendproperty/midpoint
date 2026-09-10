import { notFound } from "next/navigation";
import { isStagingHost } from "@/lib/staging-host";
import { searchStay } from "@/lib/stay-service";
import StayFrame from "@/components/StayFrame";
import StayCheckout from "@/components/StayCheckout";
import Link from "next/link";
import { canonicalStaySlug } from "@/lib/stay-brand";
export const metadata = {
  title: "Guest details | The Suites at Midpoint",
  robots: { index: false, follow: false },
};
export default async function Checkout({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  if (!(await isStagingHost())) notFound();
  const q = await searchParams;
  let result;
  try {
    result = await searchStay(
      q.checkIn || "",
      q.checkOut || "",
      Number(q.guests || 1),
      q.code || "",
    );
  } catch {}
  const row = result?.rows.find((r) => r.category.slug === canonicalStaySlug(q.room || ""));
  if (!row?.quote || !row.available)
    return (
      <StayFrame title="Choose another room">
        <p>This room is unavailable for your selected dates.</p>
        <Link href="/stay" className="stay-button mt-5 inline-block">
          Search availability
        </Link>
      </StayFrame>
    );
  return (
    <StayFrame title="Let’s make it your stay">
      <div className="mb-7 text-sm text-stone-500">
        1. Guest details & extras → 2. Test payment → 3. Confirmation
      </div>
      <StayCheckout
        categoryId={row.category.id}
        title={row.category.name}
        initial={row.quote}
        extras={result!.config.extras}
      />
    </StayFrame>
  );
}
