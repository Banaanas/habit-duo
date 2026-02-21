// Re-export read queries (cached with "use cache")
export {
  getUsers,
  getWeekById,
  getAllWeeks,
  getGoalsForUser,
  getCompletionsForGoal,
  getCompletionsForGoals,
  getWeeklyScores,
} from "@/lib/supabase/queries/queries-read";

// Re-export week queries (not cached - can create data)
export { getCurrentWeek } from "@/lib/supabase/queries/queries-weeks";

// Re-export mutations (not cached)
export {
  createGoal,
  updateGoal,
  deleteGoal,
  toggleCompletion,
} from "@/lib/supabase/queries/queries-mutations";
