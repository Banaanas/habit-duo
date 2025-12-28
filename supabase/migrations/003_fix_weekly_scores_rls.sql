-- Fix RLS for weekly_scores view
-- Views need explicit RLS policies just like tables

-- Enable RLS on the view
ALTER VIEW weekly_scores SET (security_invoker = on);

-- Note: Views with security_invoker=on inherit RLS from underlying tables
-- Since all underlying tables (weeks, users, goals, completions) already have
-- "Anyone can read" policies, the view will be readable by anyone
