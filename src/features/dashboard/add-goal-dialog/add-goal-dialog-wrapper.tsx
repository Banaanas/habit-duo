"use client";

import { useRouter } from "next/navigation";
import { parseAsBoolean, useQueryState } from "nuqs";

import { AddGoalDialog } from "./add-goal-dialog";

import { QUERY_PARAMS } from "@/lib/query-params";

export const AddGoalDialogWrapper = ({
  userId,
  weekId,
}: AddGoalDialogWrapperProps) => {
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
      weekId={weekId}
    />
  );
};

interface AddGoalDialogWrapperProps {
  userId: string;
  weekId: string;
}
