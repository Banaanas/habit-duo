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
import type { Completion, Goal } from "@/types/database-camel-case";
import { parseLocalDate } from "@/utils/date";
import {
  HeatmapDay,
  HeatmapGoal,
  buildHeatmapData,
  calculateCurrentStreak,
} from "@/utils/streak";

export const ActivityHeatmap = ({
  goals,
  completions,
  variant,
  defaultOpen = false,
}: ActivityHeatmapProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const [selectedDay, setSelectedDay] = useState<HeatmapDay | null>(null);

  const heatmapData = buildHeatmapData(goals, completions, 8);
  const uniqueCompletionDates = [
    ...new Set(completions.map((c) => c.completionDate)),
  ];
  const streak = calculateCurrentStreak(uniqueCompletionDates);
  const padded = padToGrid(heatmapData);

  // Tap toggles the detail line below the grid (tooltips don't open on touch)
  const handleSelectDay = (day: HeatmapDay) => {
    setSelectedDay((current) => (current?.date === day.date ? null : day));
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <HeatmapTrigger open={open} streak={streak} />

      <CollapsibleContent>
        <div className="flex flex-col items-center gap-y-2 pt-2">
          <div className="flex gap-x-1">
            <DayAxisLabels />
            <HeatmapGrid
              padded={padded}
              variant={variant}
              selectedDate={selectedDay?.date ?? null}
              onSelectDay={handleSelectDay}
            />
          </div>
          <HeatmapLegend variant={variant} />
          {selectedDay ? <SelectedDayDetail day={selectedDay} /> : null}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

interface ActivityHeatmapProps {
  goals: Goal[];
  completions: Completion[];
  variant: "primary" | "accent";
  defaultOpen?: boolean;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const HeatmapTrigger = ({ open, streak }: HeatmapTriggerProps) => {
  const ChevronIcon = open ? ChevronUpIcon : ChevronDownIcon;

  return (
    <CollapsibleTrigger className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-x-1 text-xs font-medium transition-colors">
      <StreakLabel streak={streak} />
      <ChevronIcon className="size-3" />
    </CollapsibleTrigger>
  );
};

interface HeatmapTriggerProps {
  open: boolean;
  streak: number;
}

const StreakLabel = ({ streak }: StreakLabelProps) =>
  streak > 0 ? <span>🔥 {streak} day streak</span> : <span>Activity</span>;

interface StreakLabelProps {
  streak: number;
}

const DayAxisLabels = () => (
  <div className="grid grid-rows-7 gap-0.5">
    {DAY_LABELS.map((label, i) => (
      <div key={i} className="flex h-2.5 items-center md:h-3">
        <span className="text-muted-foreground text-[8px] leading-none">
          {label}
        </span>
      </div>
    ))}
  </div>
);

const HeatmapGrid = ({
  padded,
  variant,
  selectedDate,
  onSelectDay,
}: HeatmapGridProps) => (
  <div className="grid grid-flow-col grid-rows-7 gap-0.5 overflow-x-auto">
    {padded.map((day, i) =>
      day === null ? (
        <div
          key={`empty-${i}`}
          className="size-2.5 rounded-sm md:size-3"
          aria-hidden="true"
        />
      ) : (
        <HeatmapCell
          key={day.date}
          day={day}
          variant={variant}
          isSelected={day.date === selectedDate}
          onSelect={onSelectDay}
        />
      )
    )}
  </div>
);

interface HeatmapGridProps {
  padded: (HeatmapDay | null)[];
  variant: "primary" | "accent";
  selectedDate: string | null;
  onSelectDay: (day: HeatmapDay) => void;
}

const HeatmapCell = ({
  day,
  variant,
  isSelected,
  onSelect,
}: HeatmapCellProps) => {
  const { completedGoals, totalGoals, date } = day;
  const colorClass = getColorClass(completedGoals.length, totalGoals, variant);
  const formattedDate = format(parseLocalDate(date), "EEE, MMM d");

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => onSelect(day)}
          className={`size-2.5 cursor-pointer rounded-sm md:size-3 ${colorClass} ${
            isSelected ? "ring-foreground/60 ring-1" : ""
          }`}
          aria-label={`${formattedDate}: ${completedGoals.length} goal${completedGoals.length !== 1 ? "s" : ""} completed`}
        />
      </TooltipTrigger>
      <TooltipContent>
        <div className="flex flex-col gap-y-1">
          <div className="font-medium">{formattedDate}</div>
          {completedGoals.length === 0 ? (
            <div>No completions</div>
          ) : (
            <CompletedGoalsList goals={completedGoals} />
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

interface HeatmapCellProps {
  day: HeatmapDay;
  variant: "primary" | "accent";
  isSelected: boolean;
  onSelect: (day: HeatmapDay) => void;
}

const SelectedDayDetail = ({ day }: SelectedDayDetailProps) => {
  const formattedDate = format(parseLocalDate(day.date), "EEE, MMM d");
  const detail =
    day.completedGoals.length === 0
      ? "No completions"
      : day.completedGoals.map((g) => g.title).join(", ");

  return (
    <p className="text-muted-foreground text-center text-xs">
      <span className="text-foreground font-medium">{formattedDate}</span>
      {" — "}
      {detail}
    </p>
  );
};

interface SelectedDayDetailProps {
  day: HeatmapDay;
}

const CompletedGoalsList = ({ goals }: CompletedGoalsListProps) => (
  <ul className="flex flex-col gap-y-0.5">
    {goals.map((g) => (
      <li key={g.id}>• {g.title}</li>
    ))}
  </ul>
);

interface CompletedGoalsListProps {
  goals: HeatmapGoal[];
}

const HeatmapLegend = ({ variant }: HeatmapLegendProps) => (
  <div className="text-muted-foreground flex items-center gap-x-1 text-[10px]">
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
);

interface HeatmapLegendProps {
  variant: "primary" | "accent";
}

// ─── Constants & helpers ──────────────────────────────────────────────────────

// Show M / W / F row labels, leave other rows empty
const DAY_LABELS = ["M", "", "W", "", "F", "", ""];

const getColorClass = (
  completedCount: number,
  totalGoals: number,
  variant: "primary" | "accent"
): string => {
  if (completedCount === 0) return "bg-muted";
  if (totalGoals > 0 && completedCount >= totalGoals) {
    return variant === "primary" ? "bg-primary" : "bg-accent";
  }
  return variant === "primary" ? "bg-primary/40" : "bg-accent/40";
};

const padToGrid = (days: HeatmapDay[]): (HeatmapDay | null)[] => {
  const padded: (HeatmapDay | null)[] = [...days];
  while (padded.length % 7 !== 0) {
    padded.push(null);
  }
  return padded;
};
