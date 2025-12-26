import { AddGoalButtonWrapper } from "@/features/dashboard/add-goal-dialog/add-goal-button-wrapper";
import { AddGoalDialogWrapper } from "@/features/dashboard/add-goal-dialog/add-goal-dialog-wrapper";
import { CurrentWeekHeader } from "@/features/dashboard/current-week-header";
import { DisplayedGoalsWrapper } from "@/features/dashboard/displayed-goals/displayed-goals-wrapper";
import { ScoreboardWrapper } from "@/features/dashboard/scoreboard/scoreboard-wrapper";
import { dashboardMaxWidth } from "@/styles/common-style";

export const Dashboard = ({
  currentUserId,
  weekId,
  weekStartDate,
  weekEndDate,
  selectedUserId,
}: DashboardProps) => {
  return (
    <div
      className="flex flex-col gap-y-6"
      style={{ maxWidth: dashboardMaxWidth }}
    >
      <CurrentWeekHeader />

      <ScoreboardWrapper />

      <DisplayedGoalsWrapper
        selectedUserId={selectedUserId}
        currentUserId={currentUserId}
      />

      <AddGoalButtonWrapper
        selectedUserId={selectedUserId}
        currentUserId={currentUserId}
      />

      <AddGoalDialogWrapper userId={currentUserId} weekId={weekId} />
    </div>
  );
};

interface DashboardProps {
  currentUserId: string;
  weekId: string;
  weekStartDate: string;
  weekEndDate: string;
  selectedUserId: string;
}
