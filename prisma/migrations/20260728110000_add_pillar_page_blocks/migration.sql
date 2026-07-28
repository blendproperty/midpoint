-- Structured layout-block fields so a Pillar Page can carry a feature grid,
-- a considerations section, live listings pulled from Vacancy, CTA copy and
-- explore-more links — not just a single hero + rich-text body. Needed so
-- pillar pages can match the same visual richness as the hand-coded
-- marketing pages (Offices, Warehouses, Amenities, Location) they replace.
ALTER TABLE "PillarPage" ADD COLUMN "features" JSONB;
ALTER TABLE "PillarPage" ADD COLUMN "considerations" JSONB;
ALTER TABLE "PillarPage" ADD COLUMN "relatedSector" "Sector";
ALTER TABLE "PillarPage" ADD COLUMN "listingsHeading" TEXT;
ALTER TABLE "PillarPage" ADD COLUMN "listingsIntro" TEXT;
ALTER TABLE "PillarPage" ADD COLUMN "showReadyToMove" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "PillarPage" ADD COLUMN "ctaHeading" TEXT;
ALTER TABLE "PillarPage" ADD COLUMN "ctaText" TEXT;
ALTER TABLE "PillarPage" ADD COLUMN "exploreLinks" JSONB;
ALTER TABLE "PillarPage" ADD COLUMN "faqsHeading" TEXT;
