-- Repair punctuation and unit symbols that were double-decoded in earlier
-- pillar-content migrations. The helper is dropped after this migration.
CREATE FUNCTION "_repair_pillar_text_encoding_20260806"(value text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT replace(
    replace(
      replace(
        replace(
          replace(
            replace(
              replace(
                replace(
                  replace(
                    replace(value, 'â€”', '—'),
                    'â€“', '–'
                  ),
                  'â€œ', '“'
                ),
                'â€', '”'
              ),
              'â€˜', '‘'
            ),
            'â€™', '’'
          ),
          'â€¦', '…'
        ),
        'Â²', '²'
      ),
      'Â·', '·'
    ),
    'Â ', ' '
  );
$$;

UPDATE "PillarPage"
SET
  "title" = "_repair_pillar_text_encoding_20260806"("title"),
  "primaryEntity" = "_repair_pillar_text_encoding_20260806"("primaryEntity"),
  "primaryAudience" = "_repair_pillar_text_encoding_20260806"("primaryAudience"),
  "decisionStage" = "_repair_pillar_text_encoding_20260806"("decisionStage"),
  "primarySearchIntent" = "_repair_pillar_text_encoding_20260806"("primarySearchIntent"),
  "primaryConversion" = "_repair_pillar_text_encoding_20260806"("primaryConversion"),
  "heroAnswer" = "_repair_pillar_text_encoding_20260806"("heroAnswer"),
  "trustStrip" = "_repair_pillar_text_encoding_20260806"("trustStrip"),
  "contentHtml" = "_repair_pillar_text_encoding_20260806"("contentHtml"),
  "faqs" = CASE WHEN "faqs" IS NULL THEN NULL ELSE "_repair_pillar_text_encoding_20260806"("faqs"::text)::jsonb END,
  "faqsHeading" = "_repair_pillar_text_encoding_20260806"("faqsHeading"),
  "features" = CASE WHEN "features" IS NULL THEN NULL ELSE "_repair_pillar_text_encoding_20260806"("features"::text)::jsonb END,
  "considerations" = CASE WHEN "considerations" IS NULL THEN NULL ELSE "_repair_pillar_text_encoding_20260806"("considerations"::text)::jsonb END,
  "listingsHeading" = "_repair_pillar_text_encoding_20260806"("listingsHeading"),
  "listingsIntro" = "_repair_pillar_text_encoding_20260806"("listingsIntro"),
  "ctaHeading" = "_repair_pillar_text_encoding_20260806"("ctaHeading"),
  "ctaText" = "_repair_pillar_text_encoding_20260806"("ctaText"),
  "exploreLinks" = CASE WHEN "exploreLinks" IS NULL THEN NULL ELSE "_repair_pillar_text_encoding_20260806"("exploreLinks"::text)::jsonb END,
  "expertRole" = "_repair_pillar_text_encoding_20260806"("expertRole"),
  "expertBio" = "_repair_pillar_text_encoding_20260806"("expertBio"),
  "seoTitle" = "_repair_pillar_text_encoding_20260806"("seoTitle"),
  "seoDescription" = "_repair_pillar_text_encoding_20260806"("seoDescription"),
  "ogTitle" = "_repair_pillar_text_encoding_20260806"("ogTitle"),
  "ogDescription" = "_repair_pillar_text_encoding_20260806"("ogDescription"),
  "schemaJson" = CASE WHEN "schemaJson" IS NULL THEN NULL ELSE "_repair_pillar_text_encoding_20260806"("schemaJson"::text)::jsonb END;

DROP FUNCTION "_repair_pillar_text_encoding_20260806"(text);
