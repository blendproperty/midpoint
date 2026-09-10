-- Rename only the requested amenity feature-card heading while preserving its
-- description, image, order and the wider amenities pillar copy.
UPDATE "PillarPage"
SET "features" = (
  SELECT jsonb_agg(
    CASE
      WHEN lower(feature->>'heading') = 'corporate accommodation'
      THEN jsonb_set(feature, '{heading}', to_jsonb('The Suites at Midpoint'::text))
      ELSE feature
    END
    ORDER BY ordinal_position
  )
  FROM jsonb_array_elements(COALESCE("features", '[]'::jsonb))
    WITH ORDINALITY AS amenity(feature, ordinal_position)
)
WHERE "slug" = 'amenities';
