ALTER TABLE "Reservation" ADD COLUMN "isTest" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "accessHash" TEXT, ADD COLUMN "idempotencyKey" TEXT,
ADD COLUMN "expiresAt" TIMESTAMP(3), ADD COLUMN "snapshot" JSONB,
ADD COLUMN "cancellationRequested" BOOLEAN NOT NULL DEFAULT false;
CREATE UNIQUE INDEX "Reservation_idempotencyKey_key" ON "Reservation"("idempotencyKey");
CREATE TABLE "BookingConfig" ("id" TEXT PRIMARY KEY DEFAULT 'staging', "data" JSONB NOT NULL, "updatedAt" TIMESTAMP(3) NOT NULL);
CREATE TABLE "RoomBlock" ("id" TEXT PRIMARY KEY, "roomId" TEXT NOT NULL REFERENCES "Room"("id") ON DELETE CASCADE, "start" TIMESTAMP(3) NOT NULL, "end" TIMESTAMP(3) NOT NULL, "reason" TEXT NOT NULL);
CREATE INDEX "RoomBlock_roomId_start_end_idx" ON "RoomBlock"("roomId","start","end");
CREATE TABLE "BookingMessage" ("id" TEXT PRIMARY KEY, "reservationId" TEXT NOT NULL REFERENCES "Reservation"("id") ON DELETE CASCADE, "subject" TEXT NOT NULL, "body" TEXT NOT NULL, "delivery" TEXT NOT NULL DEFAULT 'TEST_PREVIEW', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE "BookingAudit" ("id" TEXT PRIMARY KEY, "actor" TEXT NOT NULL, "action" TEXT NOT NULL, "target" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
ALTER TABLE "Reservation" ADD CONSTRAINT "valid_stay" CHECK ("checkOut" > "checkIn");
ALTER TABLE "RoomBlock" ADD CONSTRAINT "valid_block" CHECK ("end" > "start");
CREATE EXTENSION IF NOT EXISTS btree_gist;
ALTER TABLE "Reservation" ADD CONSTRAINT "no_overlapping_room_reservations"
EXCLUDE USING gist ("roomId" WITH =, tsrange("checkIn", "checkOut", '[)') WITH &&)
WHERE ("status" IN ('PENDING','CONFIRMED','CHECKED_IN'));
UPDATE "Room" SET "categoryId" = CASE WHEN RIGHT("id",2)::int <= 12 THEN 'onpoint-studio' ELSE 'onpoint-executive' END,
"active"=true, "status"='AVAILABLE', "notes"='STAGING TEST INVENTORY: illustrative 12 Studio / 6 Executive split; final allocation pending approval.'
WHERE "id" ~ '^onpoint-room-[0-9]{2}$' AND "categoryId" IS NULL AND "active"=false;
UPDATE "RoomCategory" SET "active"=true, "maxGuests"=2,
"baseRate"=CASE WHEN "code"='A' THEN 1150 ELSE 1650 END
WHERE "id" IN ('onpoint-studio','onpoint-executive') AND "baseRate" IS NULL;
