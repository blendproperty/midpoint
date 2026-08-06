-- The first repair covered lowercase occurrences. Repair the capitalized
-- form used in long-form table cells as well.
UPDATE "PillarPage"
SET "contentHtml" = replace("contentHtml", 'CafÃ©', 'Café')
WHERE coalesce("contentHtml", '') LIKE '%CafÃ©%';
