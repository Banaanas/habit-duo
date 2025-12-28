"use client";

import { Check } from "lucide-react";
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
        "flex-1 flex flex-col items-center gap-1 py-1 px-1 rounded-lg transition-all",
        today && "ring-2 ring-primary ring-offset-2 ring-offset-card",
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
          "w-7 h-7 rounded-full flex items-center justify-center transition-all",
          isCompleted
            ? "bg-primary shadow-md"
            : "bg-muted border-2 border-border",
          canToggle && !isCompleted && "hover:border-primary",
          isCompleted && "scale-105"
        )}
      >
        {isCompleted && <Check className="w-4 h-4 text-primary-foreground" />}
      </div>
      {today && (
        <span className="text-[10px] font-bold text-primary">TODAY</span>
      )}
    </button>
  );
};
