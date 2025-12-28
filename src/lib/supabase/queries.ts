// Re-export read queries (cached with "use cache")
export {
  getUsers,
  getWeekById,
  getAllWeeks,
  getGoalsForWeek,
  getCompletionsForGoal,
  getCompletionsForGoals,
  getWeeklyScores,
} from "./queries-read";

// Re-export week queries (not cached - can create data)
export { getCurrentWeek } from "./queries-weeks";

// Re-export mutations (not cached)
export { createGoal, deleteGoal, toggleCompletion } from "./queries-mutations";
