-- Add required alt text column to Media, backfilled with empty string for
-- existing rows (enforcement of non-empty alt happens in application code
-- for new uploads; existing rows can be backfilled via the admin UI).
ALTER TABLE "Media" ADD COLUMN "alt" TEXT NOT NULL DEFAULT '';
