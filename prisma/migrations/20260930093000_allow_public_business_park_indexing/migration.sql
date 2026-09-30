-- The public estate guide retained its original review-stage noindex flag.
-- Brett requested this published page compete in search. Allow indexing only
-- for that already-public, unprotected record; do not publish drafts or unlock
-- protected pages. The existing dynamic sitemap will then include the guide.
UPDATE "PillarPage"
SET "noIndex" = false, "updatedAt" = NOW()
WHERE "slug" = 'business-park-midrand'
  AND "status" = 'PUBLISHED'
  AND "passwordProtected" = false;
