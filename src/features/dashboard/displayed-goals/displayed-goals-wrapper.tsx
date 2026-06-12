import { getUser } from "@/actions/auth";
import {
  deleteGoalAction,
  restoreGoalAction,
  toggleCompletionAction,
  updateGoalAction,
} from "@/actions/goals";
import { appLimits } from "@/data/app-data";
import { DisplayedGoals } from "@/features/dashboard/displayed-goals/displayed-goals";
import {
  getCompletionsForGoals,
  getGoalsForUser,
  getUsers,
} from "@/lib/supabase/queries/queries";
import type { Goal } from "@/types/database-camel-case";

export const DisplayedGoalsWrapper = async ({
  selectedUserId,
  weekStartDate,
  weekEndDate,
  isCurrentWeek,
}: DisplayedGoalsWrapperProps) => {
  const currentUser = await getUser();
  const users = await getUsers();

  const targetUserId = selectedUserId || currentUser?.id;
  const selectedUser = users.find((u) => u.id === targetUserId);

  if (!currentUser || !selectedUser || !targetUserId) {
    return null;
  }

  const allGoals = await getGoalsForUser(targetUserId);
  const activeGoals = allGoals.filter((g) => g.archivedAt === null);

  // Current week shows active goals only. Past weeks show the goals that were
  // active during that week, so archived goals' history stays visible.
  const displayedGoals = isCurrentWeek
    ? activeGoals
    : allGoals.filter((g) =>
        wasActiveDuringWeek(g, weekStartDate, weekEndDate)
      );

  const archivedGoals = isCurrentWeek
    ? allGoals.filter((g) => g.archivedAt !== null)
    : [];

  // Fetch completions for displayed goals
  const goalIds = displayedGoals.map((g) => g.id);
  const completions = await getCompletionsForGoals(goalIds);

  const isViewingCurrentUser = targetUserId === currentUser.id;

  return (
    <DisplayedGoals
      displayedGoals={displayedGoals}
      archivedGoals={archivedGoals}
      canRestore={activeGoals.length < appLimits.maxGoals}
      completions={completions}
      selectedUser={selectedUser}
      isViewingCurrentUser={isViewingCurrentUser}
      weekStartDate={weekStartDate}
      weekEndDate={weekEndDate}
      onToggle={toggleCompletionAction}
      onDelete={deleteGoalAction}
      onEdit={updateGoalAction}
      onRestore={restoreGoalAction}
    />
  );
};

// Active on any day of the week: created on/before the week ends and not
// archived before the week starts
const wasActiveDuringWeek = (
  goal: Goal,
  weekStartDate: string,
  weekEndDate: string
): boolean =>
  goal.createdAt.slice(0, 10) <= weekEndDate &&
  (goal.archivedAt === null || goal.archivedAt.slice(0, 10) >= weekStartDate);

interface DisplayedGoalsWrapperProps {
  selectedUserId?: string;
  weekStartDate: string;
  weekEndDate: string;
  isCurrentWeek: boolean;
}
