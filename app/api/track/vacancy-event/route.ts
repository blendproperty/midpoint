import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { vacancyId, building, type } = await req.json();
    if (type === "VIEW" || type === "ENQUIRE") {
      await prisma.vacancyEvent.create({
        data: {
          vacancyId: typeof vacancyId === "string" ? vacancyId : null,
          building: typeof building === "string" ? building.slice(0, 255) : null,
          type,
        },
      });
    }
  } catch {
    // Tracking must never break the page — swallow any error.
  }
  return NextResponse.json({ ok: true });
}
