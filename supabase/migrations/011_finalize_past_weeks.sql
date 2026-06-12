-- Record weekly winners
--
-- weeks.winner_id and weeks.is_finalized existed since the initial schema but
-- were never written. This function finalizes every past week: the winner is
-- the user with the highest completion percentage (from weekly_scores).
-- Ties or weeks with no completions get winner_id = NULL.
--
-- SECURITY INVOKER (default): the caller must be authenticated, since the
-- "Authenticated users can update weeks" policy applies.

CREATE OR REPLACE FUNCTION finalize_past_weeks()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  w RECORD;
  win UUID;
BEGIN
  FOR w IN
    SELECT id FROM weeks
    WHERE is_finalized = false AND end_date < CURRENT_DATE
  LOOP
    WITH scores AS (
      SELECT
        user_id,
        CASE WHEN max_possible_points > 0
             THEN points::NUMERIC / max_possible_points
             ELSE 0 END AS pct
      FROM weekly_scores
      WHERE week_id = w.id
    )
    -- Single best percentage > 0 wins; ties and all-zero weeks have no winner
    SELECT CASE WHEN COUNT(*) = 1 THEN MIN(user_id::TEXT)::UUID END
    INTO win
    FROM scores
    WHERE pct > 0 AND pct = (SELECT MAX(pct) FROM scores);

    UPDATE weeks
    SET winner_id = win, is_finalized = true
    WHERE id = w.id;
  END LOOP;
END;
$$;
