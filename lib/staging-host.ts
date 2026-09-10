import { headers } from "next/headers";

export async function isStagingHost() {
  const values = await headers();
  const host = (values.get("x-forwarded-host") || values.get("host") || "").split(",")[0].split(":")[0].trim().toLowerCase();
  return host === "midpoint.onpointoffices.co.za" || host === "localhost" || host === "127.0.0.1";
}
