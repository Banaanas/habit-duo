"use client";

import { useRouter } from "next/navigation";
import { parseAsBoolean, useQueryState } from "nuqs";

import { AddGoalDialog } from "@/features/dashboard/add-goal-dialog/add-goal-dialog";
import { QUERY_PARAMS } from "@/lib/query-params";

export const AddGoalDialogWrapper = ({ userId }: AddGoalDialogWrapperProps) => {
  const router = useRouter();
  const [showAddGoal, setShowAddGoal] = useQueryState(
    QUERY_PARAMS.addGoal,
    parseAsBoolean.withDefault(false)
  );

  const handleOpenChange = async (open: boolean) => {
    await setShowAddGoal(open);
    if (!open) {
      router.refresh();
    }
  };

  return (
    <AddGoalDialog
      open={showAddGoal ?? false}
      onOpenChange={handleOpenChange}
      userId={userId}
    />
  );
};

interface AddGoalDialogWrapperProps {
  userId: string;
}
