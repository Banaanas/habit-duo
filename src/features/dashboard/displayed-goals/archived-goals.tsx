"use client";

import {
  ArchiveRestoreIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import type { GoalActionResult } from "@/actions/goals";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { Goal } from "@/types/database-camel-case";

export const ArchivedGoals = ({
  archivedGoals,
  canRestore,
  onRestore,
}: ArchivedGoalsProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [restoringId, setRestoringId] = useState<string | null>(null);

  if (archivedGoals.length === 0) return null;

  const ChevronIcon = open ? ChevronUpIcon : ChevronDownIcon;

  const handleRestore = (goalId: string) => {
    setRestoringId(goalId);
    startTransition(async () => {
      const result = await onRestore(goalId);
      setRestoringId(null);

      if (!result.ok) {
        toast.error(result.error);
        return;
      }

      router.refresh();
    });
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="text-muted-foreground hover:text-foreground mx-auto flex cursor-pointer items-center gap-x-1 py-2 text-xs font-medium transition-colors">
        <span>Archived goals ({archivedGoals.length})</span>
        <ChevronIcon className="size-3" />
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="flex flex-col gap-y-2">
          {archivedGoals.map((goal) => (
            <div
              key={goal.id}
              className="bg-card border-border flex items-center justify-between gap-x-2 rounded-xl border p-3"
            >
              <div className="min-w-0">
                <p className="text-foreground truncate text-sm font-medium">
                  {goal.title}
                </p>
                {goal.description ? (
                  <p className="text-muted-foreground truncate text-xs">
                    {goal.description}
                  </p>
                ) : null}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRestore(goal.id)}
                disabled={!canRestore || isPending}
              >
                <ArchiveRestoreIcon className="size-3.5" />
                {restoringId === goal.id ? "Restoring..." : "Restore"}
              </Button>
            </div>
          ))}

          {!canRestore ? (
            <p className="text-muted-foreground text-center text-xs">
              Archive an active goal to free a slot before restoring.
            </p>
          ) : null}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

interface ArchivedGoalsProps {
  archivedGoals: Goal[];
  canRestore: boolean;
  onRestore: (goalId: string) => Promise<GoalActionResult>;
}
