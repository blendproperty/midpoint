ALTER TABLE "Room" ADD COLUMN "housekeeping" TEXT NOT NULL DEFAULT 'UNASSESSED',
ADD COLUMN "housekeepingNote" TEXT,
ADD COLUMN "housekeepingBy" TEXT,
ADD COLUMN "housekeepingAt" TIMESTAMP(3);
ALTER TABLE "Room" ADD CONSTRAINT "room_housekeeping_state" CHECK ("housekeeping" IN ('UNASSESSED','DIRTY','CLEAN','INSPECTED'));
CREATE TABLE "BookingNote" (
  "id" TEXT NOT NULL PRIMARY KEY,
  "reservationId" TEXT NOT NULL REFERENCES "Reservation"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "body" TEXT NOT NULL,
  "actor" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "BookingNote_reservationId_createdAt_idx" ON "BookingNote"("reservationId","createdAt");
