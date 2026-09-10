import { notFound } from "next/navigation";
import { isStagingHost } from "@/lib/staging-host";
import StayFrame from "@/components/StayFrame";
import StayManage from "@/components/StayManage";
export const metadata = {
  title: "Test payment | The Suites at Midpoint",
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
    <StayFrame title="Complete your test booking">
      <StayManage reference={reference || ""} payment />
    </StayFrame>
  );
}
