CREATE TYPE "RoomStatus" AS ENUM ('AVAILABLE', 'OCCUPIED', 'OUT_OF_SERVICE', 'MAINTENANCE', 'BLOCKED');
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'NO_SHOW');
CREATE TYPE "PaymentStatus" AS ENUM ('UNPAID', 'PARTIALLY_PAID', 'PAID', 'REFUNDED');

CREATE TABLE "RoomCategory" (
  "id" TEXT NOT NULL, "code" TEXT NOT NULL, "name" TEXT NOT NULL, "slug" TEXT NOT NULL,
  "description" TEXT NOT NULL, "maxGuests" INTEGER, "bedType" TEXT,
  "baseRate" DECIMAL(10,2), "images" TEXT[], "amenities" TEXT[], "active" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "RoomCategory_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "RoomCategory_code_key" ON "RoomCategory"("code");
CREATE UNIQUE INDEX "RoomCategory_slug_key" ON "RoomCategory"("slug");

CREATE TABLE "Room" (
  "id" TEXT NOT NULL, "roomNumber" TEXT NOT NULL, "categoryId" TEXT, "floor" TEXT,
  "status" "RoomStatus" NOT NULL DEFAULT 'BLOCKED', "active" BOOLEAN NOT NULL DEFAULT false,
  "notes" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Room_roomNumber_key" ON "Room"("roomNumber");

CREATE TABLE "Reservation" (
  "id" TEXT NOT NULL, "bookingReference" TEXT NOT NULL, "categoryId" TEXT NOT NULL, "roomId" TEXT,
  "checkIn" TIMESTAMP(3) NOT NULL, "checkOut" TIMESTAMP(3) NOT NULL, "adults" INTEGER NOT NULL DEFAULT 1,
  "children" INTEGER NOT NULL DEFAULT 0, "guestFirstName" TEXT NOT NULL, "guestLastName" TEXT NOT NULL,
  "guestEmail" TEXT NOT NULL, "guestMobile" TEXT, "company" TEXT, "rate" DECIMAL(10,2),
  "subtotal" DECIMAL(10,2), "taxes" DECIMAL(10,2), "extrasTotal" DECIMAL(10,2), "total" DECIMAL(10,2),
  "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'UNPAID', "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING',
  "source" TEXT, "notes" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Reservation_bookingReference_key" ON "Reservation"("bookingReference");
CREATE INDEX "Reservation_roomId_checkIn_checkOut_idx" ON "Reservation"("roomId", "checkIn", "checkOut");
CREATE INDEX "Reservation_categoryId_checkIn_checkOut_idx" ON "Reservation"("categoryId", "checkIn", "checkOut");
ALTER TABLE "Room" ADD CONSTRAINT "Room_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "RoomCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "RoomCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO "RoomCategory" ("id","code","name","slug","description","maxGuests","bedType","images","amenities","active","updatedAt") VALUES
('onpoint-studio','A','OnPoint Studio','onpoint-studio','Premium studio-style serviced accommodation designed for productive short and extended corporate stays.',2,'Queen bed',ARRAY['/images/suites/suite-bedroom-workspace.png','/images/suites/suite-bedroom-mirror.png','/images/suites/suite-storage.png','/images/suites/suite-bathroom.png'],ARRAY['Queen bed','Dedicated workspace','Built-in storage','Private en-suite bathroom','Bar fridge'],false,CURRENT_TIMESTAMP),
('onpoint-executive','B','OnPoint Executive Suite','onpoint-executive-suite','Larger serviced accommodation with dedicated sleeping, lounge, kitchenette and dining or work zones.',NULL,NULL,ARRAY['/images/suites/suite-bedroom-mirror.png','/images/suites/suite-bedroom-workspace.png','/images/suites/suite-storage.png','/images/suites/suite-bathroom.png'],ARRAY['Lounge / seating area','Kitchenette','Dining / work area','Built-in storage','Private en-suite bathroom'],false,CURRENT_TIMESTAMP);

INSERT INTO "Room" ("id","roomNumber","status","active","notes","updatedAt")
SELECT 'onpoint-room-' || LPAD(i::text,2,'0'), 'Room ' || LPAD(i::text,2,'0'), 'BLOCKED', false,
'Placeholder inventory: assign approved room number, floor and category before activation.', CURRENT_TIMESTAMP
FROM generate_series(1,18) AS i;
