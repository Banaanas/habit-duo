import { getUser } from "@/actions/auth";
import { Scoreboard } from "@/features/dashboard/scoreboard/scoreboard";
import {
  getCompletionsForGoals,
  getCurrentWeek,
  getGoalsForUser,
  getUsers,
} from "@/lib/supabase/queries/queries";
import type { Completion, Goal, Week } from "@/types/database-camel-case";

export const ScoreboardWrapper = async () => {
  const data = await getScoreboardData();

  if (!data) {
    return null;
  }

  const { currentUser, friendUser, goals, completions, currentWeek } = data;

  const currentScore = calculateScoreForUser(
    currentUser.id,
    goals,
    completions,
    currentWeek
  );

  const friendScore = calculateScoreForUser(
    friendUser.id,
    goals,
    completions,
    currentWeek
  );

  return (
    <div className="flex flex-col">
      <Scoreboard
        currentUser={currentUser}
        friendUser={friendUser}
        currentScore={currentScore}
        friendScore={friendScore}
        goals={goals}
        completions={completions}
      />
    </div>
  );
};

const getScoreboardData = async () => {
  const [currentUser, users, currentWeek] = await Promise.all([
    getUser(),
    getUsers(),
    getCurrentWeek(),
  ]);

  const friendUser = users.find((u) => u.id !== currentUser?.id);

  if (!currentWeek) return null;
  if (!currentUser || !friendUser) return null;

  const [currentUserGoals, friendUserGoals] = await Promise.all([
    getGoalsForUser(currentUser.id),
    getGoalsForUser(friendUser.id),
  ]);

  // Fetch completions per user separately to reuse the same cache entries
  // as DisplayedGoalsWrapper — ensures the scoreboard always shows consistent data
  const [currentUserCompletions, friendUserCompletions] = await Promise.all([
    currentUserGoals.length > 0
      ? getCompletionsForGoals(currentUserGoals.map((g) => g.id))
      : Promise.resolve([]),
    friendUserGoals.length > 0
      ? getCompletionsForGoals(friendUserGoals.map((g) => g.id))
      : Promise.resolve([]),
  ]);

  return {
    currentUser,
    friendUser,
    goals: [...currentUserGoals, ...friendUserGoals],
    completions: [...currentUserCompletions, ...friendUserCompletions],
    currentWeek,
  };
};

const calculateScoreForUser = (
  userId: string,
  goals: Goal[],
  completions: Completion[],
  week: Week
): Score => {
  const userGoals = goals.filter((g) => g.userId === userId);
  const userGoalIds = new Set(userGoals.map((g) => g.id));

  const total = userGoals.reduce((sum, goal) => sum + goal.targetDays, 0);

  const completed = completions.filter(
    (c) =>
      userGoalIds.has(c.goalId) &&
      c.completionDate >= week.startDate &&
      c.completionDate <= week.endDate
  ).length;

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
};

interface Score {
  completed: number;
  total: number;
  percentage: number;
}
