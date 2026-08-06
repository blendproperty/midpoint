-- Keep Boitumelo's role and profile consistent across the public pillar pages.
UPDATE "PillarPage"
SET
  "expertRole" = 'Property Manager, Midpoint',
  "expertBio" = 'Boitumelo supports tenants throughout their Midpoint journey, from property requirements and site visits through occupation, day-to-day property matters and ongoing estate support.',
  "faqs" = CASE
    WHEN "faqs" IS NULL THEN NULL
    ELSE replace("faqs"::text, 'Leasing Manager', 'Property Manager')::jsonb
  END
WHERE "expertName" = 'Boitumelo';
