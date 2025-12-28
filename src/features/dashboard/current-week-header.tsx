import { format } from "date-fns";
import { Calendar } from "lucide-react";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentWeek } from "@/lib/supabase/queries";

export const CurrentWeekHeader = async () => {
  const currentWeek = await getCurrentWeek();

  if (!currentWeek) return null;

  const { startDate: weekStartDate, endDate: weekEndDate } = currentWeek;

  const weekStart = new Date(weekStartDate);
  const weekEnd = new Date(weekEndDate);

  const formattedWeekStart = format(weekStart, "MMM d");

  const formattedWeekEnd = format(weekEnd, "MMM d, yyyy");

  return (
    <Card>
      <CardHeader className="flex gap-x-2 items-center justify-center">
        <Calendar className="size-4 bg-accent" />
        <CardTitle className="text-center">
          Week of {formattedWeekStart} - {formattedWeekEnd}
        </CardTitle>
      </CardHeader>
    </Card>
  );
};
