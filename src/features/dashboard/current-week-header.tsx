import { format } from "date-fns";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";

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

interface CurrentWeekHeaderProps {
  weekStartDate: string;
  weekEndDate: string;
}
