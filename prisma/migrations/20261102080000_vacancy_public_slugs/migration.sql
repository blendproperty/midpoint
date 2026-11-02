ALTER TABLE "Vacancy" ADD COLUMN "slug" TEXT;
CREATE UNIQUE INDEX "Vacancy_slug_key" ON "Vacancy"("slug");

-- Generate once at the database boundary so every writer (admin, sync and seed)
-- gets a URL without changing the persistent ID used by analytics and brochures.
CREATE FUNCTION assign_vacancy_slug() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  base TEXT;
BEGIN
  IF NEW."slug" IS NOT NULL AND NEW."slug" <> '' THEN RETURN NEW; END IF;
  PERFORM pg_advisory_xact_lock(2026110208);
  base := trim(both '-' from lower(regexp_replace(
    translate(concat_ws('-', CASE
      WHEN NULLIF(trim(NEW."unitName"), '') IS NOT NULL AND (
        lower(trim(NEW."building")) IN ('midpoint commercial', 'midpoint warehousing')
        OR strpos(lower(NEW."unitName"), lower(trim(NEW."building"))) > 0
      ) THEN NEW."unitName"
      ELSE concat_ws('-', NEW."building", NULLIF(NEW."unitName", ''))
    END, 'midrand'),
      'ÀÁÂÃÄÅàáâãäåÈÉÊËèéêëÌÍÎÏìíîïÒÓÔÕÖòóôõöÙÚÛÜùúûüÇçÑñ',
      'AAAAAAaaaaaaEEEEeeeeIIIIiiiiOOOOOoooooUUUUuuuuCcNn'),
    '[^a-zA-Z0-9]+', '-', 'g')));
  IF base = '' THEN base := 'space-midrand'; END IF;
  NEW."slug" := base;
  IF EXISTS (SELECT 1 FROM "Vacancy" WHERE "slug" = base OR "id" = base) THEN
    NEW."slug" := base || '-' || NEW."id";
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER vacancy_public_slug BEFORE INSERT OR UPDATE OF "slug" ON "Vacancy"
FOR EACH ROW EXECUTE FUNCTION assign_vacancy_slug();

-- Stable ordering chooses the unsuffixed URL deterministically for duplicates.
DO $$
DECLARE row_id TEXT;
BEGIN
  FOR row_id IN SELECT "id" FROM "Vacancy" ORDER BY "createdAt", "id" LOOP
    UPDATE "Vacancy" SET "slug" = NULL WHERE "id" = row_id;
  END LOOP;
END;
$$;
ALTER TABLE "Vacancy" ALTER COLUMN "slug" SET NOT NULL;

-- Preserve editorial metadata, including noindex, without overwriting any
-- existing destination override. Only rewrite self-canonicals on this site.
UPDATE "PageSeoOverride" o SET
  "path" = '/vacancies/' || v."slug",
  "canonicalUrl" = CASE
    WHEN o."canonicalUrl" IN ('/vacancies/' || v."id", 'https://www.mid-point.co.za/vacancies/' || v."id", 'https://mid-point.co.za/vacancies/' || v."id")
    THEN 'https://www.mid-point.co.za/vacancies/' || v."slug"
    ELSE o."canonicalUrl" END
FROM "Vacancy" v
WHERE o."path" = '/vacancies/' || v."id"
AND NOT EXISTS (SELECT 1 FROM "PageSeoOverride" target WHERE target."path" = '/vacancies/' || v."slug");
