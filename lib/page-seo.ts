import { prisma } from "@/lib/prisma";

export async function getPageSeoOverride(path: string) {
  try {
    return await prisma.pageSeoOverride.findUnique({ where: { path } });
  } catch {
    return null;
  }
}
