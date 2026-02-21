import { getUser } from "@/actions/auth";
import {
  deleteGoalAction,
  toggleCompletionAction,
  updateGoalAction,
} from "@/actions/goals";
import { DisplayedGoals } from "@/features/dashboard/displayed-goals/displayed-goals";
import {
  getCompletionsForGoals,
  getCurrentWeek,
  getGoalsForUser,
  getUsers,
} from "@/lib/supabase/queries/queries";

export const DisplayedGoalsWrapper = async ({
  selectedUserId,
}: DisplayedGoalsWrapperProps) => {
  const currentUser = await getUser();
  const users = await getUsers();
  const currentWeek = await getCurrentWeek();

  const targetUserId = selectedUserId || currentUser?.id;
  const selectedUser = users.find((u) => u.id === targetUserId);

  if (!currentUser || !selectedUser || !currentWeek || !targetUserId) {
    return null;
  }

  const displayedGoals = await getGoalsForUser(targetUserId);

  // Fetch completions for displayed goals
  const goalIds = displayedGoals.map((g) => g.id);
  const completions = await getCompletionsForGoals(goalIds);

  const isViewingCurrentUser = targetUserId === currentUser.id;

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
      onEdit={updateGoalAction}
    />
  );
};

interface DisplayedGoalsWrapperProps {
  selectedUserId?: string;
}
