import type { Media, PillarPage } from "@prisma/client";
import type {
  PillarConsideration,
  PillarFaq,
  PillarFeature,
  PillarLink,
  PillarScoreInput,
} from "@/lib/seo-score";

function jsonArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function buildMediaAltByUrl(media: Pick<Media, "url" | "alt">[]): Record<string, string> {
  return Object.fromEntries(media.map((item) => [item.url, item.alt.trim()]));
}

export function pillarScoreInput(
  pillar: PillarPage,
  mediaAltByUrl: Record<string, string> = {}
): PillarScoreInput {
  const features = jsonArray<PillarFeature>(pillar.features).map((feature) => ({
    ...feature,
    alt: feature.alt?.trim() || mediaAltByUrl[feature.image] || "",
  }));

  return {
    ...pillar,
    features,
    considerations: jsonArray<PillarConsideration>(pillar.considerations),
    exploreLinks: jsonArray<PillarLink>(pillar.exploreLinks),
    faqs: jsonArray<PillarFaq>(pillar.faqs),
    mediaAltByUrl,
  };
}

