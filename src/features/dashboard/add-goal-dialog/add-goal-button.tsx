"use client";

import { parseAsBoolean, useQueryState } from "nuqs";

import { Button } from "@/components/ui/button";
import { QUERY_PARAMS } from "@/lib/query-params";

export const AddGoalButton = ({ goalCount }: AddGoalButtonProps) => {
  const [, setShowAddGoal] = useQueryState(
    QUERY_PARAMS.addGoal,
    parseAsBoolean.withDefault(false)
  );

  return (
    <div className="flex justify-center">
      <Button onClick={() => setShowAddGoal(true)}>
        + Add Goal ({goalCount}/2)
      </Button>
    </div>
  );
};
