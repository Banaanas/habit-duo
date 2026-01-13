import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentWeek } from "@/lib/supabase/queries/queries";
import { parseLocalDate } from "@/utils/date";

export const CurrentWeekHeader = async () => {
  const currentWeek = await getCurrentWeek();

  if (!currentWeek) return null;

  const { startDate: weekStartDate, endDate: weekEndDate } = currentWeek;

  const weekStart = parseLocalDate(weekStartDate);
  const weekEnd = parseLocalDate(weekEndDate);

  const formattedWeekStart = format(weekStart, "MMM d");

  const formattedWeekEnd = format(weekEnd, "MMM d, yyyy");

  return (
    <Card>
      <CardHeader className="flex items-center justify-center gap-x-2">
        <div className="bg-primary/10 flex size-8 items-center justify-center rounded-md">
          <CalendarIcon className="text-primary size-4" />
        </div>
        <CardTitle className="text-center">
          Week of {formattedWeekStart} - {formattedWeekEnd}
        </CardTitle>
      </CardHeader>
    </Card>
  );
};
