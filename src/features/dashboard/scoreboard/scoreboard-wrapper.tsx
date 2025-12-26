import { Scoreboard } from "./scoreboard";

import {
  getCompletionsForGoals,
  getCurrentWeek,
  getGoalsForWeek,
  getUsers,
} from "@/lib/supabase/queries";

interface ScoreboardWrapperProps {
  currentUserId: string;
}

export const ScoreboardWrapper = async ({
  currentUserId,
}: ScoreboardWrapperProps) => {
  const users = await getUsers();
  const currentWeek = await getCurrentWeek();

  const currentUser = users.find((u) => u.id === currentUserId);
  const friendUser = users.find((u) => u.id !== currentUserId);

  if (!currentWeek || !currentUser || !friendUser) {
    return null;
  }

  // Fetch all goals for the week
  const goals = await getGoalsForWeek(currentWeek.id);

  // Fetch all completions for those goals
  const goalIds = goals.map((g) => g.id);
  const completions = await getCompletionsForGoals(goalIds);

  // Calculate scores
  const calculateScore = (userId: string) => {
    const userGoals = goals.filter((g) => g.userId === userId);
    const total = userGoals.reduce((sum, goal) => sum + goal.targetDays, 0);
    const completed = completions.filter((c) =>
      userGoals.some((g) => g.id === c.goalId)
    ).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  const currentScore = calculateScore(currentUser.id);
  const friendScore = calculateScore(friendUser.id);

  return (
    <Scoreboard
      currentUser={currentUser}
      friendUser={friendUser}
      currentScore={currentScore}
      friendScore={friendScore}
    />
  );
};
