-- Rewrite only vacancy href targets. Preserve the surrounding owner content,
-- external sites, query/fragment suffixes, brochure resources and review dates.
DO $$
DECLARE
  vacancy RECORD;
  table_name TEXT;
  pattern TEXT;
  replacement TEXT;
BEGIN
  FOR vacancy IN SELECT "id", "slug" FROM "Vacancy" LOOP
    pattern := '(href=["''](?:https://(?:www[.])?mid-point[.]co[.]za)?)/vacancies/' || vacancy."id" || '(["''?#])';
    replacement := E'\\1/vacancies/' || vacancy."slug" || E'\\2';
    FOREACH table_name IN ARRAY ARRAY['PillarPage', 'Page', 'BlogPost'] LOOP
      EXECUTE format('UPDATE %I SET "contentHtml" = regexp_replace("contentHtml", $1, $2, ''g'') WHERE "contentHtml" ~ $1', table_name)
        USING pattern, replacement;
    END LOOP;
  END LOOP;
END;
$$;
