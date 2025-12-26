"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { DayButton } from "./day-button";

import type { Completion, Goal } from "@/types/database-camel-case";
import {
  formatDateToISO,
  getCurrentWeekDates,
  isPastOrToday,
} from "@/utils/date";

interface GoalCardProps {
  goal: Goal;
  completions: Completion[];
  weekStartDate: string;
  weekEndDate: string;
  onToggle: (goalId: string, date: string) => Promise<void>;
  onDelete: (goalId: string) => Promise<void>;
  isCurrentUser: boolean;
}

export const GoalCard = ({
  goal,
  completions,
  weekStartDate,
  weekEndDate,
  onToggle,
  onDelete,
  isCurrentUser,
}: GoalCardProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const weekDates = getCurrentWeekDates(weekStartDate, weekEndDate);

  const isCompleted = (date: Date): boolean => {
    const dateStr = formatDateToISO(date);
    return completions.some((c) => c.completionDate === dateStr);
  };

  const completedCount = completions.length;
  const totalDays = weekDates.filter(isPastOrToday).length;

  const handleDelete = async () => {
    startTransition(async () => {
      await onDelete(goal.id);
      router.refresh();
    });
  };

  const handleToggle = async (dateStr: string) => {
    await onToggle(goal.id, dateStr);
  };

  return (
    <div className="bg-card border border-border rounded-xl shadow-sm p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{goal.title}</h3>
          <p className="text-sm text-muted-foreground">
            {completedCount}/{totalDays} days completed
          </p>
        </div>
        {isCurrentUser && (
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex gap-1">
        {weekDates.map((date, index) => (
          <DayButton
            key={index}
            date={date}
            isCompleted={isCompleted(date)}
            canToggle={isPastOrToday(date) && isCurrentUser}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  );
};
