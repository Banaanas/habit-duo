import { Scoreboard } from "./scoreboard";

import {
  getCompletionsForGoals,
  getCurrentWeek,
  getGoalsForWeek,
  getUsers,
} from "@/lib/supabase/queries";
import { Completion, Goal } from "@/types/database-camel-case";

export const ScoreboardWrapper = async ({
  currentUserId,
}: ScoreboardWrapperProps) => {
  const data = await getScoreboardData(currentUserId);

  if (!data) {
    return null;
  }

  const { currentUser, friendUser, goals, completions } = data;

  const currentScore = calculateScoreForUser(
    currentUser.id,
    goals,
    completions
  );

  const friendScore = calculateScoreForUser(friendUser.id, goals, completions);

  return (
    <Scoreboard
      currentUser={currentUser}
      friendUser={friendUser}
      currentScore={currentScore}
      friendScore={friendScore}
    />
  );
};

interface ScoreboardWrapperProps {
  currentUserId: string;
}

const getScoreboardData = async (currentUserId: string) => {
  const [users, currentWeek] = await Promise.all([
    getUsers(),
    getCurrentWeek(),
  ]);

  if (!currentWeek) return null;

  const currentUser = users.find((u) => u.id === currentUserId);
  const friendUser = users.find((u) => u.id !== currentUserId);

  if (!currentUser || !friendUser) return null;

  const goals = await getGoalsForWeek(currentWeek.id);

  const goalIds = goals.map((g) => g.id);
  const completions =
    goalIds.length > 0 ? await getCompletionsForGoals(goalIds) : [];

  return {
    currentUser,
    friendUser,
    goals,
    completions,
  };
};

function calculateScoreForUser(
  userId: string,
  goals: Goal[],
  completions: Completion[]
) {
  const userGoals = goals.filter((g) => g.userId === userId);

  const total = userGoals.reduce((sum, goal) => sum + goal.targetDays, 0);

  const completed = completions.filter((c) =>
    userGoals.some((g) => g.id === c.goalId)
  ).length;

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
}
