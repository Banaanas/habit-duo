"use client";

import { format } from "date-fns";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Completion, Goal } from "@/types/database-camel-case";
import { parseLocalDate } from "@/utils/date";
import {
  HeatmapDay,
  buildHeatmapData,
  calculateCurrentStreak,
} from "@/utils/streak";

type Props = {
  goals: Goal[];
  completions: Completion[];
  variant: "primary" | "accent";
  defaultOpen?: boolean;
};

// Show M / W / F row labels, leave other rows empty
const DAY_LABELS = ["M", "", "W", "", "F", "", ""];

export const ActivityHeatmap = ({
  goals,
  completions,
  variant,
  defaultOpen = false,
}: Props) => {
  const [open, setOpen] = useState(defaultOpen);

  const heatmapData = buildHeatmapData(goals, completions, 8);

  const uniqueCompletionDates = [
    ...new Set(completions.map((c) => c.completionDate)),
  ];
  const streak = calculateCurrentStreak(uniqueCompletionDates);

  const padded: (HeatmapDay | null)[] = [...heatmapData];
  while (padded.length % 7 !== 0) {
    padded.push(null);
  }

  const getColorClass = (
    completedCount: number,
    totalGoals: number
  ): string => {
    if (completedCount === 0) return "bg-muted";
    if (totalGoals > 0 && completedCount >= totalGoals) {
      return variant === "primary" ? "bg-primary" : "bg-accent";
    }
    return variant === "primary" ? "bg-primary/40" : "bg-accent/40";
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 text-xs font-medium transition-colors">
        {streak > 0 ? (
          <span>🔥 {streak} day streak</span>
        ) : (
          <span>Activity</span>
        )}
        {open ? (
          <ChevronUpIcon className="h-3 w-3" />
        ) : (
          <ChevronDownIcon className="h-3 w-3" />
        )}
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="flex flex-col items-center gap-2 pt-2">
          <div className="flex gap-1">
            {/* Day-of-week axis */}
            <div className="grid grid-rows-7 gap-0.5">
              {DAY_LABELS.map((label, i) => (
                <div key={i} className="flex h-2 items-center md:h-2.5">
                  <span className="text-muted-foreground text-[8px] leading-none">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="grid grid-flow-col grid-rows-7 gap-0.5 overflow-x-auto">
              {padded.map((day, i) => {
                if (day === null) {
                  return (
                    <div
                      key={`empty-${i}`}
                      className="size-2 rounded-sm md:size-2.5"
                      aria-hidden="true"
                    />
                  );
                }

                const colorClass = getColorClass(
                  day.completedGoals.length,
                  day.totalGoals
                );
                const formattedDate = format(
                  parseLocalDate(day.date),
                  "EEE, MMM d"
                );

                return (
                  <Tooltip key={day.date}>
                    <TooltipTrigger asChild>
                      <div
                        className={`size-2 rounded-sm md:size-2.5 ${colorClass}`}
                        aria-label={`${formattedDate}: ${day.completedGoals.length} goal${day.completedGoals.length !== 1 ? "s" : ""} completed`}
                        tabIndex={0}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <div className="font-medium">{formattedDate}</div>
                        {day.completedGoals.length === 0 ? (
                          <div>No completions</div>
                        ) : (
                          <ul className="space-y-0.5">
                            {day.completedGoals.map((g) => (
                              <li key={g.id}>• {g.title}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="text-muted-foreground flex items-center gap-1 text-[10px]">
            <span>Less</span>
            <div className="bg-muted size-2 rounded-sm" />
            <div
              className={`size-2 rounded-sm ${variant === "primary" ? "bg-primary/40" : "bg-accent/40"}`}
            />
            <div
              className={`size-2 rounded-sm ${variant === "primary" ? "bg-primary" : "bg-accent"}`}
            />
            <span>More</span>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
