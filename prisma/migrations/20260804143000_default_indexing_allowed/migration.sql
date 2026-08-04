-- Indexing is controlled per page. Keep the legacy global switch enabled so
-- an older settings value cannot noindex or disallow crawling for the site.
UPDATE "SiteSetting" SET "allowIndexing" = TRUE WHERE "allowIndexing" = FALSE;
