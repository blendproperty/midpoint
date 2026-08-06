-- The amenities long-form overview already covers current/planned status,
-- security, resilience and connectivity in greater detail. Remove the
-- duplicate summary-card block from the live page.
UPDATE "PillarPage"
SET "considerations" = '[]'::jsonb
WHERE "slug" = 'amenities';
