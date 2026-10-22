-- Match ContactForm's existing interest values; retain all surrounding owner copy.
DO $prefill$ BEGIN
UPDATE "PillarPage"
SET "contentHtml" = replace("contentHtml", 'href="/contact-us?interest=Warehouse#Contact"', 'href="/contact-us?interest=Warehouse%20space#Contact"'),
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "id" = 'warehouse_pillar_draft_20260730' AND "slug" = 'warehouses' AND "status" = 'PUBLISHED'
  AND position('href="/contact-us?interest=Warehouse#Contact"' in "contentHtml") > 0;
UPDATE "PillarPage"
SET "contentHtml" = replace("contentHtml", 'href="/contact-us?interest=Office#Contact"', 'href="/contact-us?interest=Office%20space#Contact"'),
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "id" = 'cms4as2hj0000p43n6fszibac' AND "slug" = 'offices' AND "status" = 'PUBLISHED'
  AND position('href="/contact-us?interest=Office#Contact"' in "contentHtml") > 0;
END $prefill$;
