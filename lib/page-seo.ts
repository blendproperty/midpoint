import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/site-settings";
import { buildPageMetadata } from "@/lib/seo-metadata";

export async function getPageSeoOverride(path: string) {
  try {
    return await prisma.pageSeoOverride.findUnique({ where: { path } });
  } catch {
    return null;
  }
}

export async function staticPageMetadata(path: string, title: string, description?: string) {
  const [fields, settings] = await Promise.all([getPageSeoOverride(path), getSiteSettings()]);
  return buildPageMetadata({ path, title, description, fields, settings });
}
