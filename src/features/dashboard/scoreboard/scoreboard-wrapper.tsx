import { getUser } from "@/actions/auth";
import { Scoreboard } from "@/features/dashboard/scoreboard/scoreboard";
import {
  getCompletionsForGoals,
  getCurrentWeek,
  getGoalsForUser,
  getUsers,
} from "@/lib/supabase/queries/queries";
import { Completion, Goal, Week } from "@/types/database-camel-case";

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
  const goals = [...currentUserGoals, ...friendUserGoals];
  const goalIds = goals.map((g) => g.id);
  const completions =
    goalIds.length > 0 ? await getCompletionsForGoals(goalIds) : [];

  return {
    currentUser,
    friendUser,
    goals,
    completions,
    currentWeek,
  };
};

function calculateScoreForUser(
  userId: string,
  goals: Goal[],
  completions: Completion[],
  week: Week
) {
  const userGoals = goals.filter((g) => g.userId === userId);

  const total = userGoals.reduce((sum, goal) => sum + goal.targetDays, 0);

  // Filter completions to only those within the week's date range
  // This ensures the scoreboard matches the visual display in goal cards
  const validCompletions = completions.filter((c) => {
    const isUserGoal = userGoals.some((g) => g.id === c.goalId);
    const isWithinWeek =
      c.completionDate >= week.startDate && c.completionDate <= week.endDate;
    return isUserGoal && isWithinWeek;
  });

  const completed = validCompletions.length;

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
}
