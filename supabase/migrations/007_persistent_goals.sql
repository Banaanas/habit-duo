-- Make goals persistent (user-scoped, no longer week-scoped)
-- Goals now persist across weeks and can be edited at any time

-- Drop old index
DROP INDEX IF EXISTS idx_goals_user_week;

-- Drop old unique constraint
ALTER TABLE goals DROP CONSTRAINT IF EXISTS goals_user_id_week_id_title_key;

-- Remove week_id column
ALTER TABLE goals DROP COLUMN IF EXISTS week_id;

-- Add new unique constraint: one title per user (globally)
ALTER TABLE goals ADD CONSTRAINT goals_user_id_title_key UNIQUE (user_id, title);

-- Add new index on user_id only
CREATE INDEX idx_goals_user ON goals(user_id);

-- Update weekly_scores view: goals are now user-scoped
-- Completions are still filtered to the week's date range for accurate scoring
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
LEFT JOIN completions c ON c.goal_id = g.id
  AND c.completion_date >= w.start_date
  AND c.completion_date <= w.end_date
GROUP BY w.id, w.start_date, w.end_date, w.is_finalized, u.id, u.name, u.avatar_emoji
ORDER BY w.start_date DESC, points DESC;
