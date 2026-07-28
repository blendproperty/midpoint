-- CreateTable
CREATE TABLE "PillarPage" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "primaryEntity" TEXT,
    "primaryAudience" TEXT,
    "decisionStage" TEXT,
    "primarySearchIntent" TEXT,
    "primaryConversion" TEXT,
    "heroAnswer" TEXT,
    "heroImage" TEXT,
    "trustStrip" TEXT,
    "contentHtml" TEXT NOT NULL,
    "faqs" JSONB,
    "expertName" TEXT,
    "expertRole" TEXT,
    "expertBio" TEXT,
    "expertImage" TEXT,
    "reviewOwner" TEXT,
    "lastReviewedAt" TIMESTAMP(3),
    "nextReviewAt" TIMESTAMP(3),
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "focusKeyword" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PillarPage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PillarPage_slug_key" ON "PillarPage"("slug");
