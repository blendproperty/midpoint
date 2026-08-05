-- Replace the duplicated lounge photograph in the first serviced-office
-- feature with the supplied OnPoint workspace photograph.
UPDATE "PillarPage"
SET
  "features" = jsonb_set(
    jsonb_set(
      "features"::jsonb,
      '{0,image}',
      '"/images/pages/onpoint-workspace-desks.jpg"'::jsonb
    ),
    '{0,alt}',
    '"Open-plan serviced office workspace with desks at OnPoint in Midpoint"'::jsonb
  ),
  "updatedAt" = NOW()
WHERE "slug" = 'services-offices'
  AND jsonb_typeof("features"::jsonb) = 'array'
  AND jsonb_array_length("features"::jsonb) > 0;
