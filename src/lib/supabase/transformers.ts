import type {
  DbCompletion,
  DbGoal,
  DbUser,
  DbWeek,
  DbWeeklyScore,
} from "@/types/database";
import type {
  Completion,
  Goal,
  User,
  Week,
  WeeklyScore,
} from "@/types/database-camel-case";

export const transformUser = (dbUser: DbUser): User => ({
  id: dbUser.id,
  name: dbUser.name,
  avatarEmoji: dbUser.avatar_emoji,
  authUserId: dbUser.auth_user_id,
  createdAt: dbUser.created_at,
});

export const transformWeek = (dbWeek: DbWeek): Week => ({
  id: dbWeek.id,
  startDate: dbWeek.start_date,
  endDate: dbWeek.end_date,
  winnerId: dbWeek.winner_id,
  isFinalized: dbWeek.is_finalized,
  createdAt: dbWeek.created_at,
});

export const transformGoal = (dbGoal: DbGoal): Goal => ({
  id: dbGoal.id,
  userId: dbGoal.user_id,
  weekId: dbGoal.week_id,
  title: dbGoal.title,
  description: dbGoal.description,
  targetDays: dbGoal.target_days,
  createdAt: dbGoal.created_at,
});

export const transformCompletion = (
  dbCompletion: DbCompletion
): Completion => ({
  id: dbCompletion.id,
  goalId: dbCompletion.goal_id,
  completionDate: dbCompletion.completion_date,
  createdAt: dbCompletion.created_at,
});

export const transformWeeklyScore = (dbScore: DbWeeklyScore): WeeklyScore => ({
  weekId: dbScore.week_id,
  startDate: dbScore.start_date,
  endDate: dbScore.end_date,
  isFinalized: dbScore.is_finalized,
  userId: dbScore.user_id,
  userName: dbScore.user_name,
  avatarEmoji: dbScore.avatar_emoji,
  points: dbScore.points,
  totalGoals: dbScore.total_goals,
  maxPossiblePoints: dbScore.max_possible_points,
});
