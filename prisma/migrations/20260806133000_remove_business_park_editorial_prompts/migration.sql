-- Remove internal review notes that were accidentally published on the public
-- Understand Midpoint page. Unknown estate figures remain unpublished rather
-- than being replaced with unverified values.
UPDATE "PillarPage"
SET
  "trustStrip" = regexp_replace(
    COALESCE("trustStrip", ''),
    E'\n?Tenant count to be verified before publication',
    '',
    'g'
  ),
  "contentHtml" = regexp_replace(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          regexp_replace(
            COALESCE("contentHtml", ''),
            '<aside><strong>Review before publishing:</strong>.*?</aside>',
            '',
            'g'
          ),
          '<h2>The Midpoint Estate at a Glance</h2>.*?(?=<h2>Who Chooses Midpoint\?</h2>)',
          '',
          'g'
        ),
        '<p>This list and the total tenant count must be confirmed before the page is published.*?</p>',
        '',
        'g'
      ),
      '<p>A tenant may be able to change product as its needs evolve, but this should not be presented as a guaranteed pathway.*?</p>',
      '',
      'g'
    ),
    '<p>These facilities support staff experience, informal meetings, wellness and the practical needs of teams spending a full working day at the estate\. Some buildings and amenities may still be under construction\. The Amenities pillar should distinguish clearly between facilities available now, those under construction and those planned for a later phase\. Images of unbuilt or incomplete amenities should be labelled as illustrative\.</p>',
    '<p>These facilities support staff experience, informal meetings, wellness and the practical needs of teams spending a full working day at the estate. Some buildings and amenities may still be under construction; the amenities page identifies current and planned facilities.</p>',
    'g'
  ),
  "faqs" = COALESCE(
    (
      SELECT jsonb_agg(item ORDER BY ordinal)
      FROM jsonb_array_elements(COALESCE("PillarPage"."faqs", '[]'::jsonb))
        WITH ORDINALITY AS faq(item, ordinal)
      WHERE item->>'question' NOT IN (
        'How big is the Midpoint estate?',
        'How many tenants are currently at Midpoint?',
        'What companies are based at Midpoint?'
      )
    ),
    '[]'::jsonb
  ),
  "considerations" = '[]'::jsonb,
  "updatedAt" = NOW()
WHERE "slug" = 'business-park-midrand';
