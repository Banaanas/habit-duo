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

  const isMaxGoalsReached = goalCount >= appLimits.maxGoalsPerWeek;

  const buttonText = isMaxGoalsReached
    ? `Max Goals Reached (${goalCount}/${appLimits.maxGoalsPerWeek})`
    : `Add Goal (${goalCount}/${appLimits.maxGoalsPerWeek})`;

  return (
    <Button
      onClick={() => setShowAddGoal(true)}
      disabled={isMaxGoalsReached}
      className="w-full py-6 text-base flex gap-y-3"
    >
      {!isMaxGoalsReached ? <PlusIcon className="w-5 h-5" /> : null}
      {buttonText}
    </Button>
  );
};

interface AddGoalButtonProps {
  goalCount: number;
}
