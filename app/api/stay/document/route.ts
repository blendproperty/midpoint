import { cookies } from "next/headers";
import { owned } from "@/lib/stay-service";
import { isStagingHost } from "@/lib/staging-host";
export async function GET(req: Request) {
  if (!(await isStagingHost()))
    return new Response("Not found", { status: 404 });
  const u = new URL(req.url),
    r = await owned(
      u.searchParams.get("reference") || "",
      (await cookies()).get("suite_test_access")?.value || "",
    );
  if (!r) return new Response("Not found", { status: 404 });
  const calendar = u.searchParams.get("format") === "ics";
  const date = (d: Date) => d.toISOString().slice(0, 10).replaceAll("-", "");
  const content = calendar
    ? [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Midpoint//Test booking//EN",
        "BEGIN:VEVENT",
        "UID:" + r.id + "@midpoint.onpointoffices.co.za",
        "DTSTAMP:" +
          new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) +
          "Z",
        "DTSTART;VALUE=DATE:" + date(r.checkIn),
        "DTEND;VALUE=DATE:" + date(r.checkOut),
        "SUMMARY:TEST stay - The Suites at Midpoint",
        "DESCRIPTION:Test reservation only. No real stay or charge.",
        "END:VEVENT",
        "END:VCALENDAR",
      ].join("\r\n")
    : r.messages[0]?.body ||
      "TEST booking " + r.bookingReference + "\nStatus: " + r.status;
  return new Response(content, {
    headers: {
      "Content-Type": calendar
        ? "text/calendar; charset=utf-8"
        : "text/plain; charset=utf-8",
      "Content-Disposition":
        'attachment; filename="booking.' + (calendar ? "ics" : "txt") + '"',
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
