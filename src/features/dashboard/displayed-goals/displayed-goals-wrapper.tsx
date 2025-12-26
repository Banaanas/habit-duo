import { DisplayedGoals } from "./displayed-goals";

import { deleteGoalAction, toggleCompletionAction } from "@/actions/goals";
import {
  getCompletionsForGoals,
  getCurrentWeek,
  getGoalsForWeek,
  getUsers,
} from "@/lib/supabase/queries";

interface DisplayedGoalsWrapperProps {
  currentUserId: string;
  selectedUserId?: string;
}

export const DisplayedGoalsWrapper = async ({
  currentUserId,
  selectedUserId,
}: DisplayedGoalsWrapperProps) => {
  const users = await getUsers();
  const currentWeek = await getCurrentWeek();

  const targetUserId = selectedUserId || currentUserId;
  const selectedUser = users.find((u) => u.id === targetUserId);

  if (!currentWeek || !selectedUser) {
    return null;
  }

  // Fetch all goals for the week
  const allGoals = await getGoalsForWeek(currentWeek.id);

  // Filter goals for selected user
  const displayedGoals = allGoals.filter((g) => g.userId === targetUserId);

  // Fetch completions for displayed goals
  const goalIds = displayedGoals.map((g) => g.id);
  const completions = await getCompletionsForGoals(goalIds);

  const isViewingCurrentUser = targetUserId === currentUserId;

  return (
    <DisplayedGoals
      displayedGoals={displayedGoals}
      completions={completions}
      selectedUser={selectedUser}
      isViewingCurrentUser={isViewingCurrentUser}
      weekStartDate={currentWeek.startDate}
      weekEndDate={currentWeek.endDate}
      onToggle={toggleCompletionAction}
      onDelete={deleteGoalAction}
    />
  );
};
