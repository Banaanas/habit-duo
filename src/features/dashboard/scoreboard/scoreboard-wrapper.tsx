import { getUser } from "@/actions/auth";
import { Scoreboard } from "@/features/dashboard/scoreboard/scoreboard";
import {
  getCompletionsForGoals,
  getCurrentWeek,
  getGoalsForUser,
  getUsers,
  getWeeklyScores,
} from "@/lib/supabase/queries/queries";
import type { WeeklyScore } from "@/types/database-camel-case";

export const ScoreboardWrapper = async () => {
  const data = await getScoreboardData();

  if (!data) {
    return null;
  }

  const { currentUser, friendUser, goals, completions, weeklyScores } = data;

  const currentScore = toScore(
    weeklyScores.find((s) => s.userId === currentUser.id)
  );

  const friendScore = toScore(
    weeklyScores.find((s) => s.userId === friendUser.id)
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

  const [currentUserGoals, friendUserGoals, weeklyScores] = await Promise.all([
    getGoalsForUser(currentUser.id),
    getGoalsForUser(friendUser.id),
    getWeeklyScores(currentWeek.id),
  ]);

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
    weeklyScores,
  };
};

// Maps the DB view result to the Score format used by the Scoreboard
const toScore = (weeklyScore: WeeklyScore | undefined): Score => {
  if (!weeklyScore) return { completed: 0, total: 0, percentage: 0 };

  const { points, maxPossiblePoints } = weeklyScore;
  const percentage =
    maxPossiblePoints > 0 ? Math.round((points / maxPossiblePoints) * 100) : 0;

  return { completed: points, total: maxPossiblePoints, percentage };
};

interface Score {
  completed: number;
  total: number;
  percentage: number;
}
