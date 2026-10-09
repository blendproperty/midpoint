import { fetchAllListings } from "@/lib/listings-sync";

// Use the exact source ID stored by sync, never a title/slug guess or a
// whole-portfolio image search. The authenticated endpoint is Midpoint-scoped.
export async function getListingBrochureImages(externalId: string): Promise<string[] | null> {
  if (!process.env.LISTINGS_API_KEY) throw new Error("Listing photography is not configured");
  const listings = await fetchAllListings();
  const source = listings.find(listing => listing.id === externalId);
  if (!source) return null;
  const images = [...(source.images || [])].sort((a, b) => {
    if (a.isHero !== b.isHero) return a.isHero ? -1 : 1;
    return (a.position || 0) - (b.position || 0);
  });
  return [...new Set(images.map(image => image.url).filter(url => typeof url === "string" && url.trim()))].slice(0, 30);
}
