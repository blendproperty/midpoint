-- Repair only the legacy placeholder; preserve other configured destinations.
UPDATE "SiteSetting"
SET "whatsapp" = '27600185206'
WHERE "id" = 'global' AND regexp_replace("whatsapp", '[^0-9]', '', 'g') ~ '^0+$';
