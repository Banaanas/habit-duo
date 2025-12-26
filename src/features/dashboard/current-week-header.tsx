import { format } from "date-fns";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentWeek } from "@/lib/supabase/queries-read";

export const CurrentWeekHeader = async () => {
  const currentWeek = await getCurrentWeek();

  if (!currentWeek) return null;

  const { startDate: weekStartDate, endDate: weekEndDate } = currentWeek;

  const weekStart = new Date(weekStartDate);
  const weekEnd = new Date(weekEndDate);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          Week of {format(weekStart, "MMM d")} -{" "}
          {format(weekEnd, "MMM d, yyyy")}
        </CardTitle>
      </CardHeader>
    </Card>
  );
};
