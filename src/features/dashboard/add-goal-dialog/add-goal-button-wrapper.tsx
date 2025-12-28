import { getUser } from "@/actions/auth";
import { AddGoalButton } from "@/features/dashboard/add-goal-dialog/add-goal-button";
import { getCurrentWeek, getGoalsForWeek } from "@/lib/supabase/queries";

export const AddGoalButtonWrapper = async ({
  selectedUserId,
}: AddGoalButtonWrapperProps) => {
  const currentUser = await getUser();
  const currentWeek = await getCurrentWeek();
  if (!currentUser || !currentWeek) return null;

  const isCurrentUser = selectedUserId === currentUser.id;
  if (!isCurrentUser) return null;

  const allGoals = await getGoalsForWeek(currentWeek.id);
  const userGoalsThisWeek = allGoals.filter((g) => g.userId === selectedUserId);

  return <AddGoalButton goalCount={userGoalsThisWeek.length} />;
};

interface AddGoalButtonWrapperProps {
  selectedUserId: string;
}
