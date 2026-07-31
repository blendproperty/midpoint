-- Use the requested public URL spelling and preserve the previous URL as a
-- permanent redirect so no saved or previously shared link breaks.
UPDATE "PillarPage"
SET
  "slug" = 'services-offices',
  "canonicalUrl" = 'https://www.mid-point.co.za/services-offices',
  "updatedAt" = NOW()
WHERE "id" = 'serviced_offices_pillar_review_20260731';

-- Update structured explore links on any pillar that already points to the
-- earlier draft URL.
UPDATE "PillarPage"
SET
  "exploreLinks" = REPLACE(
    "exploreLinks"::text,
    '"/serviced-offices"',
    '"/services-offices"'
  )::jsonb,
  "updatedAt" = NOW()
WHERE "exploreLinks"::text LIKE '%"/serviced-offices"%';

INSERT INTO "Redirect" (
  "id", "fromPath", "toPath", "statusCode", "hitCount", "createdAt", "updatedAt"
)
VALUES (
  'redirect_serviced_to_services_offices',
  '/serviced-offices',
  '/services-offices',
  301,
  0,
  NOW(),
  NOW()
)
ON CONFLICT ("fromPath") DO UPDATE
SET
  "toPath" = EXCLUDED."toPath",
  "statusCode" = EXCLUDED."statusCode",
  "updatedAt" = NOW();
