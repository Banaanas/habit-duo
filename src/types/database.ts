// Database types (snake_case) - what Supabase returns
// These match the database schema exactly

export type DbUser = {
  id: string;
  name: string;
  email: string;
  avatar_emoji: string;
  auth_user_id: string | null;
  created_at: string;
};

export type DbWeek = {
  id: string;
  start_date: string;
  end_date: string;
  winner_id: string | null;
  is_finalized: boolean;
  created_at: string;
};

export type DbGoal = {
  id: string;
  user_id: string;
  week_id: string;
  title: string;
  description: string | null;
  target_days: number;
  created_at: string;
};

export type DbCompletion = {
  id: string;
  goal_id: string;
  completion_date: string;
  created_at: string;
};

export type DbWeeklyScore = {
  week_id: string;
  start_date: string;
  end_date: string;
  is_finalized: boolean;
  user_id: string;
  user_name: string;
  avatar_emoji: string;
  points: number;
  total_goals: number;
  max_possible_points: number;
};
