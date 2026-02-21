import { getUser } from "@/actions/auth";
import { AddGoalButton } from "@/features/dashboard/add-goal-dialog/add-goal-button";
import { getGoalsForUser } from "@/lib/supabase/queries/queries";

export const AddGoalButtonWrapper = async ({
  selectedUserId,
}: AddGoalButtonWrapperProps) => {
  const currentUser = await getUser();
  if (!currentUser) return null;

  const isCurrentUser = selectedUserId === currentUser.id;
  if (!isCurrentUser) return null;

  const userGoals = await getGoalsForUser(selectedUserId);

  return <AddGoalButton goalCount={userGoals.length} />;
};

interface AddGoalButtonWrapperProps {
  selectedUserId: string;
}
