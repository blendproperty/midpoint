-- Correct only the known industrial portfolio. Preserve publication, prices,
-- dates, descriptions and every other source field. Future syncs use the same rule.
UPDATE "Vacancy" SET "sector" = 'WAREHOUSE'
WHERE lower(trim("building")) = 'midpoint warehousing' AND "sector" = 'OFFICE';
