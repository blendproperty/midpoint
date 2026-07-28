-- AlterTable BlogPost
ALTER TABLE "BlogPost"
  ADD COLUMN "ogTitle" TEXT,
  ADD COLUMN "ogDescription" TEXT,
  ADD COLUMN "ogImage" TEXT,
  ADD COLUMN "noIndex" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "canonicalUrl" TEXT,
  ADD COLUMN "schemaJson" JSONB,
  ADD COLUMN "headCode" TEXT,
  ADD COLUMN "bodyCode" TEXT;

-- AlterTable Page
ALTER TABLE "Page"
  ADD COLUMN "ogTitle" TEXT,
  ADD COLUMN "ogDescription" TEXT,
  ADD COLUMN "ogImage" TEXT,
  ADD COLUMN "noIndex" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "canonicalUrl" TEXT,
  ADD COLUMN "schemaJson" JSONB,
  ADD COLUMN "headCode" TEXT,
  ADD COLUMN "bodyCode" TEXT;

-- AlterTable PillarPage
ALTER TABLE "PillarPage"
  ADD COLUMN "ogTitle" TEXT,
  ADD COLUMN "ogDescription" TEXT,
  ADD COLUMN "ogImage" TEXT,
  ADD COLUMN "noIndex" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "canonicalUrl" TEXT,
  ADD COLUMN "schemaJson" JSONB,
  ADD COLUMN "headCode" TEXT,
  ADD COLUMN "bodyCode" TEXT;

-- AlterTable PageSeoOverride
ALTER TABLE "PageSeoOverride"
  ADD COLUMN "ogTitle" TEXT,
  ADD COLUMN "ogDescription" TEXT,
  ADD COLUMN "ogImage" TEXT,
  ADD COLUMN "noIndex" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "canonicalUrl" TEXT,
  ADD COLUMN "schemaJson" JSONB,
  ADD COLUMN "headCode" TEXT,
  ADD COLUMN "bodyCode" TEXT;
