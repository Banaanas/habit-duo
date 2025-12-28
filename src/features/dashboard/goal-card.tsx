"use client";

import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { MouseEventHandler, useTransition } from "react";

import { DayButton } from "./day-button";

import type { Completion, Goal } from "@/types/database-camel-case";
import { formatDateToISO, getCurrentWeekDates, isPastOrToday } from "@/utils/date";

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
    <div className="bg-card border border-border rounded-xl flex flex-col gap-y-4 shadow-sm p-4">
      <div className="flex items-start justify-between">
        <GoalHeader goal={goal} />
        <RemoveGoalButton
          handleDelete={handleDelete}
          isCurrentUser={isCurrentUser}
          isPending={isPending}
        />
      </div>

      <div className="flex flex-col gap-y-4">
        <DayButtons
          weekDates={weekDates}
          isCompleted={isCompleted}
          isCurrentUser={isCurrentUser}
          onToggle={handleToggle}
        />

        <hr />
        <p className="text-sm text-muted-foreground text-left">
          <span className="font-bold">{completedCount}</span>/{totalDays} days
          completed
        </p>
      </div>
    </div>
  );
};

interface GoalCardProps {
  goal: Goal;
  completions: Completion[];
  weekStartDate: string;
  weekEndDate: string;
  onToggle: (goalId: string, date: string) => Promise<void>;
  onDelete: (goalId: string) => Promise<void>;
  isCurrentUser: boolean;
}

const RemoveGoalButton = ({
  handleDelete,
  isPending,
  isCurrentUser,
}: RemoveGoalButtonProps) => {
  if (!isCurrentUser) return null;

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50"
    >
      <Trash2Icon className="w-4 h-4" />
    </button>
  );
};

interface RemoveGoalButtonProps {
  handleDelete: MouseEventHandler<HTMLButtonElement>;
  isPending: boolean;
  isCurrentUser: boolean;
}

const GoalHeader = ({ goal }: { goal: Goal }) => {
  const { title, description } = goal;

  return (
    <div className="flex-1">
      <h3 className="font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

interface DayButtonsProps {
  weekDates: Date[];
  isCompleted: (date: Date) => boolean;
  isCurrentUser: boolean;
  onToggle: (date: string) => Promise<void>;
}

const DayButtons = ({
  weekDates,
  isCompleted,
  isCurrentUser,
  onToggle,
}: DayButtonsProps) => {
  return (
    <div className="flex gap-1">
      {weekDates.map((date) => (
        <DayButton
          key={date.toISOString()}
          date={date}
          isCompleted={isCompleted(date)}
          canToggle={isPastOrToday(date) && isCurrentUser}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
};
