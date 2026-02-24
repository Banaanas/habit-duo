-- Re-apply security_invoker after weekly_scores view was recreated in migration 007
-- CREATE OR REPLACE VIEW resets security options to defaults (security_definer)

ALTER VIEW weekly_scores SET (security_invoker = on);
