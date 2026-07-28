-- AlterTable
ALTER TABLE "Vacancy" ADD COLUMN "externalId" TEXT,
ADD COLUMN "lastSyncedAt" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Vacancy_externalId_key" ON "Vacancy"("externalId");
