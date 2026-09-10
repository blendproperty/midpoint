import { notFound } from "next/navigation";
import { isStagingHost } from "@/lib/staging-host";
import StayFrame from "@/components/StayFrame";
import StayManage from "@/components/StayManage";
export const metadata = {
  title: "Manage booking | The Suites at Midpoint",
  robots: { index: false, follow: false },
};
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  if (!(await isStagingHost())) notFound();
  const { reference } = await searchParams;
  return (
    <StayFrame title="Manage your stay">
      <StayManage reference={reference || ""} />
    </StayFrame>
  );
}
