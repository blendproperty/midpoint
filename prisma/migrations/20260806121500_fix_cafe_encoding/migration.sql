-- Repair mojibake introduced by the long-form content migration. The seed
-- data already contains the correct UTF-8 spelling; this updates databases
-- where the affected migration has already been applied.
UPDATE "PillarPage"
SET
  "heroAnswer" = replace("heroAnswer", 'cafÃ©', 'café'),
  "trustStrip" = replace("trustStrip", 'cafÃ©', 'café'),
  "contentHtml" = replace("contentHtml", 'cafÃ©', 'café'),
  "features" = CASE
    WHEN "features" IS NULL THEN NULL
    ELSE replace("features"::text, 'cafÃ©', 'café')::jsonb
  END,
  "faqs" = CASE
    WHEN "faqs" IS NULL THEN NULL
    ELSE replace("faqs"::text, 'cafÃ©', 'café')::jsonb
  END
WHERE
  coalesce("heroAnswer", '') LIKE '%cafÃ©%'
  OR coalesce("trustStrip", '') LIKE '%cafÃ©%'
  OR coalesce("contentHtml", '') LIKE '%cafÃ©%'
  OR coalesce("features"::text, '') LIKE '%cafÃ©%'
  OR coalesce("faqs"::text, '') LIKE '%cafÃ©%';
