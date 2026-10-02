-- Private editorial planning only. No published records or existing contracts change.
CREATE TABLE "ContentIdea" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "keyword" TEXT,
  "audience" TEXT,
  "brief" TEXT,
  "research" TEXT,
  "publishedUrl" TEXT,
  "status" TEXT NOT NULL DEFAULT 'idea',
  "format" TEXT NOT NULL DEFAULT 'guide',
  "priority" TEXT NOT NULL DEFAULT 'normal',
  "targetDate" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ContentIdea_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ContentIdea_status_check" CHECK ("status" IN ('idea','researching','ready','writing','published','parked')),
  CONSTRAINT "ContentIdea_format_check" CHECK ("format" IN ('article','guide','faq','page')),
  CONSTRAINT "ContentIdea_priority_check" CHECK ("priority" IN ('high','normal','low'))
);
