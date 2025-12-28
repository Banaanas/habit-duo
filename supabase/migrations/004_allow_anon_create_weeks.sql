-- Allow anonymous users to create weeks
-- This is needed because "use cache" functions run with anon role
-- Since the app has only 2 trusted users and weeks are public data, this is safe

DROP POLICY "Authenticated users can create weeks" ON weeks;

CREATE POLICY "Anyone can create weeks" ON weeks
  FOR INSERT WITH CHECK (true);

-- Also update the update policy to allow anon
DROP POLICY "Authenticated users can update weeks" ON weeks;

CREATE POLICY "Anyone can update weeks" ON weeks
  FOR UPDATE USING (true);
