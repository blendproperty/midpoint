import { prisma } from "../lib/prisma";
if (!process.env.DATABASE_URL?.includes("localhost:55439/midpoint_booking_test")) throw new Error("Disposable test database required");
async function main() {
  await prisma.vacancy.upsert({ where: { id: "ux-local-vacancy" }, update: {}, create: {
    id: "ux-local-vacancy", building: "Local UX test building", unitName: "Suite & four", sector: "SERVICED_OFFICE",
    sizeSqm: 125.5, ratePerSqm: 105.5, availability: "Confirm with team", description: "Synthetic local layout fixture. ".repeat(8),
    features: Array.from({length:20}, (_,i)=>`Local feature ${i+1}`), image: "/images/hero/quicklink-availability.png", status: "PUBLISHED",
  } });
  console.log("Synthetic UX fixture ready in disposable database only");
}
main().finally(()=>prisma.$disconnect());
