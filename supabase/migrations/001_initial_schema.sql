-- Habit Duo Database Schema
-- Simple weekly habit tracking competition for 2 users
-- Weeks run Monday-Sunday (can join mid-week)

-- Users table (2 hardcoded users)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  avatar_emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert the 2 users
INSERT INTO users (name, avatar_emoji) VALUES
  ('Cyril', '🕉️'),
  ('Andrea', '🎨');

-- Weeks table (competition periods - Monday to Sunday)
CREATE TABLE weeks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  start_date DATE NOT NULL, -- Always a Monday
  end_date DATE NOT NULL,   -- Always a Sunday
  winner_id UUID REFERENCES users(id),
  is_finalized BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(start_date)
);

-- Create index for querying current week
CREATE INDEX idx_weeks_dates ON weeks(start_date, end_date);

-- Goals table (max 2 per user per week)
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  week_id UUID NOT NULL REFERENCES weeks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_days INTEGER NOT NULL DEFAULT 7, -- How many days out of 7 they aim for
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, week_id, title)
);

-- Create index for querying user goals per week
CREATE INDEX idx_goals_user_week ON goals(user_id, week_id);

-- Completions table (daily check-ins)
CREATE TABLE completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  completion_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(goal_id, completion_date)
);

-- Create index for querying completions
CREATE INDEX idx_completions_goal_date ON completions(goal_id, completion_date);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE weeks ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE completions ENABLE ROW LEVEL SECURITY;

-- Since we're not using Supabase auth, allow all operations
-- (In production with 2 trusted users, this is fine)
CREATE POLICY "Allow all on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all on weeks" ON weeks FOR ALL USING (true);
CREATE POLICY "Allow all on goals" ON goals FOR ALL USING (true);
CREATE POLICY "Allow all on completions" ON completions FOR ALL USING (true);

-- Function to get the Monday of any given date
CREATE OR REPLACE FUNCTION get_week_start(date_input DATE)
RETURNS DATE AS $$
BEGIN
  RETURN date_input - (EXTRACT(DOW FROM date_input)::INTEGER - 1) * INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to get or create current week (Monday-Sunday)
CREATE OR REPLACE FUNCTION get_or_create_current_week()
RETURNS UUID AS $$
DECLARE
  week_start DATE;
  week_end DATE;
  week_record weeks%ROWTYPE;
BEGIN
  -- Calculate Monday of current week
  week_start := get_week_start(CURRENT_DATE);
  week_end := week_start + 6; -- Sunday

  -- Try to find existing week
  SELECT * INTO week_record FROM weeks WHERE start_date = week_start;

  -- Create if doesn't exist
  IF week_record.id IS NULL THEN
    INSERT INTO weeks (start_date, end_date)
    VALUES (week_start, week_end)
    RETURNING * INTO week_record;
  END IF;

  RETURN week_record.id;
END;
$$ LANGUAGE plpgsql;

-- View for calculating weekly scores
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
LEFT JOIN goals g ON g.week_id = w.id AND g.user_id = u.id
LEFT JOIN completions c ON c.goal_id = g.id
GROUP BY w.id, w.start_date, w.end_date, w.is_finalized, u.id, u.name, u.avatar_emoji
ORDER BY w.start_date DESC, points DESC;
