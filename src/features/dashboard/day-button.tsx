"use client";

import { CheckIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { cn } from "@/lib/utils";
import {
  formatDateToISO,
  getDayName,
  isFutureDate,
  isToday,
} from "@/utils/date";

export const DayButton = ({
  date,
  isCompleted,
  canToggle,
  onToggle,
}: DayButtonProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticCompleted, setOptimisticCompleted] = useState(isCompleted);
  const today = isToday(date);
  const isFuture = isFutureDate(date);
  const isDisabled = !canToggle || isPending;

  useEffect(() => {
    syncOptimisticStateWithServer({
      isCompleted,
      optimisticCompleted,
      isPending,
      setOptimisticCompleted,
    });
  }, [isCompleted, optimisticCompleted, isPending]);

  const handleClick = () => {
    handleDayButtonClick({
      canToggle,
      optimisticCompleted,
      setOptimisticCompleted,
      startTransition,
      onToggle,
      date,
      router,
    });
  };

  const buttonClassNames = getButtonClassNames({
    today,
    canToggle,
    isPending,
    isFuture,
  });

  const todayBadge = today ? <TodayBadge /> : null;

  return (
    <button
      onClick={handleClick}
      disabled={isDisabled}
      className={buttonClassNames}
    >
      <DayLabel date={date} today={today} />
      <CheckboxCircle
        optimisticCompleted={optimisticCompleted}
        isPending={isPending}
        canToggle={canToggle}
      />
      {todayBadge}
    </button>
  );
};

interface DayButtonProps {
  date: Date;
  isCompleted: boolean;
  canToggle: boolean;
  onToggle: (date: string) => Promise<void>;
}

const DayLabel = ({ date, today }: DayLabelProps) => {
  return (
    <span
      className={cn(
        "text-xs font-medium",
        today ? "text-primary" : "text-muted-foreground"
      )}
    >
      {getDayName(date)}
    </span>
  );
};

interface DayLabelProps {
  date: Date;
  today: boolean;
}

const CheckboxCircle = ({
  optimisticCompleted,
  isPending,
  canToggle,
}: CheckboxCircleProps) => {
  const circleClassNames = getCheckboxCircleClassNames({
    optimisticCompleted,
    canToggle,
    isPending,
  });

  const checkIcon =
    optimisticCompleted && !isPending ? (
      <CheckIcon className="text-primary-foreground h-4 w-4" />
    ) : null;

  const spinner = isPending ? (
    <Loader2Icon className="text-primary-foreground h-4 w-4 animate-spin" />
  ) : null;

  return (
    <div className={circleClassNames}>
      {checkIcon}
      {spinner}
    </div>
  );
};

interface CheckboxCircleProps {
  optimisticCompleted: boolean;
  isPending: boolean;
  canToggle: boolean;
}

const TodayBadge = () => {
  return <span className="text-primary text-[10px] font-bold">TODAY</span>;
};

const syncOptimisticStateWithServer = ({
  isCompleted,
  optimisticCompleted,
  isPending,
  setOptimisticCompleted,
}: SyncOptimisticStateParams) => {
  const stateOutOfSync = isCompleted !== optimisticCompleted;
  const canSync = !isPending;

  if (stateOutOfSync && canSync) {
    setOptimisticCompleted(isCompleted);
  }
};

interface SyncOptimisticStateParams {
  isCompleted: boolean;
  optimisticCompleted: boolean;
  isPending: boolean;
  setOptimisticCompleted: (value: boolean) => void;
}

const handleDayButtonClick = async ({
  canToggle,
  optimisticCompleted,
  setOptimisticCompleted,
  startTransition,
  onToggle,
  date,
  router,
}: HandleDayButtonClickParams) => {
  if (!canToggle) return;

  setOptimisticCompleted(!optimisticCompleted);

  startTransition(async () => {
    await onToggle(formatDateToISO(date));
    router.refresh();
  });
};

interface HandleDayButtonClickParams {
  canToggle: boolean;
  optimisticCompleted: boolean;
  setOptimisticCompleted: (value: boolean) => void;
  startTransition: (callback: () => Promise<void>) => void;
  onToggle: (date: string) => Promise<void>;
  date: Date;
  router: ReturnType<typeof useRouter>;
}

const getButtonClassNames = ({
  today,
  canToggle,
  isPending,
  isFuture,
}: GetButtonClassNamesParams) => {
  const canHover = canToggle && !isPending;
  const isDisabled = !canToggle || isPending;

  return cn(
    "flex flex-1 flex-col items-center gap-1 rounded-lg px-1 py-1 transition-all",
    today && "ring-primary ring-offset-card ring-2 ring-offset-2",
    canHover && "hover:bg-muted cursor-pointer",
    isDisabled && "cursor-not-allowed",
    isFuture && "opacity-40"
  );
};

interface GetButtonClassNamesParams {
  today: boolean;
  canToggle: boolean;
  isPending: boolean;
  isFuture: boolean;
}

const getCheckboxCircleClassNames = ({
  optimisticCompleted,
  canToggle,
  isPending,
}: GetCheckboxCircleClassNamesParams) => {
  const baseClasses =
    "relative flex h-7 w-7 items-center justify-center rounded-full transition-all";
  const completedClasses = "bg-primary shadow-md";
  const uncompletedClasses = "bg-muted border-border border-2";
  const canHoverUncompleted = canToggle && !optimisticCompleted;

  return cn(
    baseClasses,
    optimisticCompleted ? completedClasses : uncompletedClasses,
    canHoverUncompleted && "hover:border-primary",
    optimisticCompleted && "scale-105",
    isPending && "opacity-70"
  );
};

interface GetCheckboxCircleClassNamesParams {
  optimisticCompleted: boolean;
  canToggle: boolean;
  isPending: boolean;
}
