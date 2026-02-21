"use client";

import { PlusIcon } from "lucide-react";
import { parseAsBoolean, useQueryState } from "nuqs";

import { Button } from "@/components/ui/button";
import { appLimits } from "@/data/app-data";
import { QUERY_PARAMS } from "@/lib/query-params";

export const AddGoalButton = ({ goalCount }: AddGoalButtonProps) => {
  const [, setShowAddGoal] = useQueryState(
    QUERY_PARAMS.addGoal,
    parseAsBoolean.withDefault(false)
  );

  const isMaxGoalsReached = goalCount >= appLimits.maxGoals;

  const buttonText = isMaxGoalsReached
    ? `Max Goals Reached (${goalCount}/${appLimits.maxGoals})`
    : `Add Goal (${goalCount}/${appLimits.maxGoals})`;

  return (
    <Button
      onClick={() => setShowAddGoal(true)}
      disabled={isMaxGoalsReached}
      className="flex w-full gap-y-3 py-6 text-base"
    >
      {!isMaxGoalsReached ? <PlusIcon className="h-5 w-5" /> : null}
      {buttonText}
    </Button>
  );
};

interface AddGoalButtonProps {
  goalCount: number;
}
