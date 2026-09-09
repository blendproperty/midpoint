-- Keep one canonical WhatsApp destination for the floating button and all
-- vacancy-specific WhatsApp links.
UPDATE "SiteSetting"
SET "whatsapp" = '27600185206'
WHERE "id" = 'global';
