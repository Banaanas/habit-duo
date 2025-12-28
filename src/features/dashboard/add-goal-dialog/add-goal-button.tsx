"use client";

import { parseAsBoolean, useQueryState } from "nuqs";

import { Button } from "@/components/ui/button";
import { appLimits } from "@/data/app-data";
import { QUERY_PARAMS } from "@/lib/query-params";

export const AddGoalButton = ({ goalCount }: AddGoalButtonProps) => {
  const [, setShowAddGoal] = useQueryState(
    QUERY_PARAMS.addGoal,
    parseAsBoolean.withDefault(false)
  );

  const isMaxGoalsReached = goalCount >= appLimits.maxGoalsPerWeek;

  const buttonText = isMaxGoalsReached
    ? `Max Goals Reached (${goalCount}/${appLimits.maxGoalsPerWeek})`
    : `+ Add Goal (${goalCount}/${appLimits.maxGoalsPerWeek})`;

  return (
    <div className="flex justify-center">
      <Button onClick={() => setShowAddGoal(true)} disabled={isMaxGoalsReached}>
        {buttonText}
      </Button>
    </div>
  );
};

interface AddGoalButtonProps {
  goalCount: number;
}
