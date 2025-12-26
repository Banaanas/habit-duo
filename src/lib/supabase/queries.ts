// Re-export read queries (cached with "use cache")
export {
  getUsers,
  getCurrentWeek,
  getWeekById,
  getAllWeeks,
  getGoalsForWeek,
  getCompletionsForGoal,
  getCompletionsForGoals,
  getWeeklyScores,
} from "./queries-read";

// Re-export mutations (not cached)
export { createGoal, deleteGoal, toggleCompletion } from "./queries-mutations";
