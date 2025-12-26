-- Add Supabase Auth integration
-- Links users table to auth.users

-- Add auth_user_id column to users table
ALTER TABLE users ADD COLUMN auth_user_id UUID REFERENCES auth.users(id) UNIQUE;

-- Update RLS policies to use proper authentication
DROP POLICY "Allow all on users" ON users;
DROP POLICY "Allow all on weeks" ON weeks;
DROP POLICY "Allow all on goals" ON goals;
DROP POLICY "Allow all on completions" ON completions;

-- Users: Can read all users, but only update their own profile
CREATE POLICY "Anyone can read users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- Weeks: Everyone can read, authenticated users can create
CREATE POLICY "Anyone can read weeks" ON weeks
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create weeks" ON weeks
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update weeks" ON weeks
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Goals: Users can only manage their own goals
CREATE POLICY "Users can read all goals" ON goals
  FOR SELECT USING (true);

CREATE POLICY "Users can create own goals" ON goals
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT auth_user_id FROM users WHERE id = user_id)
  );

CREATE POLICY "Users can update own goals" ON goals
  FOR UPDATE USING (
    auth.uid() = (SELECT auth_user_id FROM users WHERE id = user_id)
  );

CREATE POLICY "Users can delete own goals" ON goals
  FOR DELETE USING (
    auth.uid() = (SELECT auth_user_id FROM users WHERE id = user_id)
  );

-- Completions: Users can only manage completions for their own goals
CREATE POLICY "Users can read all completions" ON completions
  FOR SELECT USING (true);

CREATE POLICY "Users can create completions for own goals" ON completions
  FOR INSERT WITH CHECK (
    auth.uid() = (
      SELECT u.auth_user_id
      FROM goals g
      JOIN users u ON g.user_id = u.id
      WHERE g.id = goal_id
    )
  );

CREATE POLICY "Users can delete completions for own goals" ON completions
  FOR DELETE USING (
    auth.uid() = (
      SELECT u.auth_user_id
      FROM goals g
      JOIN users u ON g.user_id = u.id
      WHERE g.id = goal_id
    )
  );

-- Note: To link existing users to auth, you'll need to:
-- 1. Have each user sign up with their email
-- 2. Run: UPDATE users SET auth_user_id = '<their-auth-uid>' WHERE name = '<their-name>';
