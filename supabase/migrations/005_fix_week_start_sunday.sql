-- Fix week start calculation to handle Sunday correctly
-- The bug: when DOW = 0 (Sunday), the formula returned next Monday instead of current week's Monday

DROP FUNCTION get_week_start(DATE);

CREATE OR REPLACE FUNCTION get_week_start(date_input DATE)
RETURNS DATE AS $$
DECLARE
  day_of_week INTEGER;
BEGIN
  day_of_week := EXTRACT(DOW FROM date_input)::INTEGER;

  -- PostgreSQL DOW: Sunday = 0, Monday = 1, ..., Saturday = 6
  -- We want: Monday = 0 days back, Tuesday = 1 day back, ..., Sunday = 6 days back
  IF day_of_week = 0 THEN
    -- Sunday: go back 6 days to get Monday
    RETURN date_input - INTERVAL '6 days';
  ELSE
    -- Monday-Saturday: go back (day_of_week - 1) days
    RETURN date_input - (day_of_week - 1) * INTERVAL '1 day';
  END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
