ALTER TABLE "BlogPost" ADD COLUMN "pillarPageId" TEXT;
CREATE INDEX "BlogPost_pillarPageId_status_publishedAt_idx" ON "BlogPost"("pillarPageId", "status", "publishedAt");
ALTER TABLE "BlogPost" ADD CONSTRAINT "BlogPost_pillarPageId_fkey" FOREIGN KEY ("pillarPageId") REFERENCES "PillarPage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Reviewed existing warehouse articles only; no publication or content changes.
UPDATE "BlogPost" AS post SET "pillarPageId" = pillar.id
FROM "PillarPage" AS pillar
WHERE pillar.slug = 'warehouses' AND pillar.status = 'PUBLISHED'
  AND NOT pillar."passwordProtected" AND post."pillarPageId" IS NULL
  AND post.slug IN ('warehouse-checklist-midrand-eave-height-loading-yard-space', 'getting-the-office-to-warehouse-ratio-right-in-midrand', 'midrand-vs-isando-kempton-park-and-waterfall-comparing-gauteng-warehouse-nodes', 'commercial-storage-vs-warehouse-space-in-midrand-which-do-you-actually-need', 'backup-power-for-midrand-warehouses-what-generator-on-site-actually-covers', 'warehouse-vs-industrial-space-in-midrand-what-the-terms-actually-mean');
