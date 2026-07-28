-- Password-protect an individual Page or PillarPage. Only a bcrypt hash of
-- the password is stored, matching the pattern already used for admin user
-- passwords and password-reset tokens.
ALTER TABLE "Page" ADD COLUMN "passwordProtected" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Page" ADD COLUMN "accessPasswordHash" TEXT;

ALTER TABLE "PillarPage" ADD COLUMN "passwordProtected" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "PillarPage" ADD COLUMN "accessPasswordHash" TEXT;
