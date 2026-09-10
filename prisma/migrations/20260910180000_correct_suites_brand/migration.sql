-- Keep stable primary keys and reservation relationships; correct accommodation labels only.
UPDATE "RoomCategory" SET "name" = 'Studio', "slug" = 'studio'
WHERE "id" = 'onpoint-studio';
UPDATE "RoomCategory" SET "name" = 'Executive Suite', "slug" = 'executive-suite'
WHERE "id" = 'onpoint-executive';

-- These are unsent test previews, not delivered correspondence or financial records.
UPDATE "BookingMessage" m
SET "body" = REPLACE(REPLACE(m."body", 'OnPoint Executive Suite', 'Executive Suite'), 'OnPoint Studio', 'Studio')
FROM "Reservation" r
WHERE m."reservationId" = r."id" AND r."isTest" = true AND m."delivery" = 'TEST_PREVIEW';
