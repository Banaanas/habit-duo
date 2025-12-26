import { AddGoalButton } from "@/features/dashboard/add-goal-dialog/add-goal-button";
import { getCurrentWeek, getGoalsForWeek } from "@/lib/supabase/queries";

interface AddGoalButtonWrapperProps {
  currentUserId: string;
  selectedUserId: string;
}

export const AddGoalButtonWrapper = async ({
  currentUserId,
  selectedUserId,
}: AddGoalButtonWrapperProps) => {
  const currentWeek = await getCurrentWeek();
  if (!currentWeek) return null;

  const allGoals = await getGoalsForWeek(currentWeek.id);
  const displayedGoals = allGoals.filter((g) => g.userId === selectedUserId);

  const canAddGoal =
    displayedGoals.length < 2 && selectedUserId === currentUserId;
  const isViewingCurrentUser = selectedUserId === currentUserId;

  if (!isViewingCurrentUser || !canAddGoal) return null;

  return <AddGoalButton goalCount={displayedGoals.length} />;
};
