"use client";

import { format } from "date-fns";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
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

  const weekStart = parseLocalDate(weekStartDate);
  const weekEnd = parseLocalDate(weekEndDate);

  const formattedWeekStart = format(weekStart, "MMM d");
  const formattedWeekEnd = format(weekEnd, "MMM d, yyyy");

  const canGoBack = weekOffset > -appLimits.pastWeeksLimit;
  const canGoForward = weekOffset < 0;

  const navigate = (newOffset: number) => {
    router.push(buildWeekUrl(searchParams.toString(), newOffset));
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(weekOffset - 1)}
          disabled={!canGoBack}
          aria-label="Previous week"
        >
          <ChevronLeftIcon className="size-4" />
        </Button>

        <div className="flex flex-col items-center gap-y-1">
          <div className="flex items-center gap-x-2">
            <div className="bg-primary/10 flex size-8 items-center justify-center rounded-md">
              <CalendarIcon className="text-primary size-4" />
            </div>
            <CardTitle className="text-center">
              Week of {formattedWeekStart} - {formattedWeekEnd}
            </CardTitle>
          </div>
          {weekOffset < 0 ? (
            <span className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 text-xs font-medium">
              Past week
            </span>
          ) : null}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(weekOffset + 1)}
          disabled={!canGoForward}
          className={!canGoForward ? "invisible" : undefined}
          aria-label="Next week"
        >
          <ChevronRightIcon className="size-4" />
        </Button>
      </CardHeader>
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
