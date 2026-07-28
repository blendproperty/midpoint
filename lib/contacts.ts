import { prisma } from "@/lib/prisma";

type UpsertContactInput = {
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  source?: string | null;
};

// Shared by /api/enquiry and /api/leads so both entry points dedupe the same
// way: match on lower-cased email, update name/phone if new info came in,
// otherwise leave existing admin-edited fields alone. Never overwrites
// `status` or `assignedToId` — those are only ever changed from the admin
// Contacts screens.
export async function upsertContact(input: UpsertContactInput) {
  const email = input.email.trim().toLowerCase();

  return prisma.contact.upsert({
    where: { email },
    update: {
      firstName: input.firstName || undefined,
      lastName: input.lastName || undefined,
      phone: input.phone || undefined,
    },
    create: {
      email,
      firstName: input.firstName || null,
      lastName: input.lastName || null,
      phone: input.phone || null,
      source: input.source || null,
    },
  });
}
