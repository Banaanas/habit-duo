"use client";

import { CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { cn } from "@/lib/utils";
import {
  formatDateToISO,
  getDayName,
  isFutureDate,
  isToday,
} from "@/utils/date";

interface DayButtonProps {
  date: Date;
  isCompleted: boolean;
  canToggle: boolean;
  onToggle: (date: string) => Promise<void>;
}

export const DayButton = ({
  date,
  isCompleted,
  canToggle,
  onToggle,
}: DayButtonProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const today = isToday(date);
  const isFuture = isFutureDate(date);

  const handleClick = async () => {
    if (!canToggle) return;

    startTransition(async () => {
      await onToggle(formatDateToISO(date));
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={!canToggle || isPending}
      className={cn(
        "flex flex-1 flex-col items-center gap-1 rounded-lg px-1 py-1 transition-all",
        today && "ring-primary ring-offset-card ring-2 ring-offset-2",
        canToggle && "hover:bg-muted cursor-pointer",
        !canToggle && "cursor-default",
        isFuture && "opacity-40"
      )}
    >
      <span
        className={cn(
          "text-xs font-medium",
          today ? "text-primary" : "text-muted-foreground"
        )}
      >
        {getDayName(date)}
      </span>
      <div
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full transition-all",
          isCompleted
            ? "bg-primary shadow-md"
            : "bg-muted border-border border-2",
          canToggle && !isCompleted && "hover:border-primary",
          isCompleted && "scale-105"
        )}
      >
        {isCompleted && (
          <CheckIcon className="text-primary-foreground h-4 w-4" />
        )}
      </div>
      {today && (
        <span className="text-primary text-[10px] font-bold">TODAY</span>
      )}
    </button>
  );
};
