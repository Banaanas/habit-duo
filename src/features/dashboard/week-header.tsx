"use client";

import { format } from "date-fns";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2Icon,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { appLimits } from "@/data/app-data";
import { QUERY_PARAMS } from "@/lib/query-params";
import { parseLocalDate } from "@/utils/date";

export const WeekHeader = ({
  weekStartDate,
  weekEndDate,
  weekOffset,
}: WeekHeaderProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [loadingDirection, setLoadingDirection] = useState<
    "back" | "forward" | null
  >(null);

  const weekStart = parseLocalDate(weekStartDate);
  const weekEnd = parseLocalDate(weekEndDate);

  const formattedWeekStart = format(weekStart, "MMM d");
  const formattedWeekEnd = format(weekEnd, "MMM d, yyyy");

  const canGoBack = weekOffset > -appLimits.pastWeeksLimit;
  const canGoForward = weekOffset < 0;

  const navigate = (newOffset: number, direction: "back" | "forward") => {
    setLoadingDirection(direction);
    startTransition(() => {
      router.push(buildWeekUrl(searchParams.toString(), newOffset));
    });
  };

  const isLoadingBack = isPending && loadingDirection === "back";
  const isLoadingForward = isPending && loadingDirection === "forward";

  return (
    <Card>
      <div className="flex flex-col items-center gap-y-2 px-6">
        <div className="flex w-full items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(weekOffset - 1, "back")}
            disabled={!canGoBack || isPending}
            aria-label="Previous week"
          >
            {isLoadingBack ? (
              <Loader2Icon className="text-muted-foreground size-4 animate-spin" />
            ) : (
              <ChevronLeftIcon className="size-4" />
            )}
          </Button>

          <div className="flex items-center gap-x-2">
            <div className="bg-primary/10 flex size-8 items-center justify-center rounded-md">
              <CalendarIcon className="text-primary size-4" />
            </div>
            <CardTitle>
              Week of {formattedWeekStart} - {formattedWeekEnd}
            </CardTitle>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(weekOffset + 1, "forward")}
            disabled={!canGoForward || isPending}
            className={!canGoForward ? "invisible" : undefined}
            aria-label="Next week"
          >
            {isLoadingForward ? (
              <Loader2Icon className="text-muted-foreground size-4 animate-spin" />
            ) : (
              <ChevronRightIcon className="size-4" />
            )}
          </Button>
        </div>

        {weekOffset < 0 ? (
          <span className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 text-xs font-medium">
            Past week
          </span>
        ) : null}
      </div>
    </Card>
  );
};

interface WeekHeaderProps {
  weekStartDate: string;
  weekEndDate: string;
  weekOffset: number;
}

const buildWeekUrl = (currentSearch: string, newOffset: number): string => {
  const params = new URLSearchParams(currentSearch);

  // Back to current week - remove offset param
  if (newOffset === 0) {
    params.delete(QUERY_PARAMS.weekOffset);
    const query = params.toString();
    return query ? `?${query}` : "/";
  }

  // Navigate to offset week
  params.set(QUERY_PARAMS.weekOffset, String(newOffset));
  return `?${params.toString()}`;
};
