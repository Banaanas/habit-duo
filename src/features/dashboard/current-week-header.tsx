import { format } from "date-fns";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface CurrentWeekHeaderProps {
  weekStartDate: string;
  weekEndDate: string;
}

export const CurrentWeekHeader = ({
  weekStartDate,
  weekEndDate,
}: CurrentWeekHeaderProps) => {
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
