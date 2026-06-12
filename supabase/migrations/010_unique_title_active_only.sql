-- Allow re-creating a goal whose title matches an ARCHIVED goal
--
-- Why: since soft delete (migration 009), archived goals keep their row.
-- The UNIQUE (user_id, title) constraint therefore blocked creating a new
-- goal with the same title as an archived one (e.g. bringing "Yoga" back).
-- Replace it with a partial unique index that only applies to active goals.

ALTER TABLE goals DROP CONSTRAINT IF EXISTS goals_user_id_title_key;

CREATE UNIQUE INDEX goals_user_id_title_active_key
  ON goals (user_id, title)
  WHERE archived_at IS NULL;
