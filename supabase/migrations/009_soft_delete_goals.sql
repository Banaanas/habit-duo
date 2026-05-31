-- Soft delete for goals + week-accurate scoring
--
-- Why: deleting a goal used to DELETE the row, cascading to ALL its completions
-- (ON DELETE CASCADE), permanently destroying history. We switch to soft delete
-- (archived_at) so a goal can be retired without losing its past completions.
--
-- The weekly_scores view is updated so a goal only counts toward a given week if
-- it was active during that week (created on/before the week ends, and not yet
-- archived when the week starts). Otherwise an archived goal would still inflate
-- the current/future weeks' total_goals and max_possible_points.

-- 1. Add archived_at (NULL = active)
ALTER TABLE goals ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

-- 2. Recreate weekly_scores: only count goals active during the week
CREATE OR REPLACE VIEW weekly_scores AS
SELECT
  w.id as week_id,
  w.start_date,
  w.end_date,
  w.is_finalized,
  u.id as user_id,
  u.name as user_name,
  u.avatar_emoji,
  COUNT(DISTINCT c.id) as points,
  COUNT(DISTINCT g.id) as total_goals,
  (COUNT(DISTINCT g.id) * 7) as max_possible_points
FROM weeks w
CROSS JOIN users u
LEFT JOIN goals g ON g.user_id = u.id
  AND g.created_at::date <= w.end_date
  AND (g.archived_at IS NULL OR g.archived_at::date >= w.start_date)
LEFT JOIN completions c ON c.goal_id = g.id
  AND c.completion_date >= w.start_date
  AND c.completion_date <= w.end_date
GROUP BY w.id, w.start_date, w.end_date, w.is_finalized, u.id, u.name, u.avatar_emoji
ORDER BY w.start_date DESC, points DESC;

-- 3. Re-apply security invoker (was set in migration 008, recreating the view resets it)
ALTER VIEW weekly_scores SET (security_invoker = on);
