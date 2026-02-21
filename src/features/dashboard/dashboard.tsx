import { redirect } from "next/navigation";

import { getUser } from "@/actions/auth";
import { appNavLinks } from "@/data/app-data";
import { AddGoalButtonWrapper } from "@/features/dashboard/add-goal-dialog/add-goal-button-wrapper";
import { AddGoalDialogWrapper } from "@/features/dashboard/add-goal-dialog/add-goal-dialog-wrapper";
import { CurrentWeekHeader } from "@/features/dashboard/current-week-header";
import { DisplayedGoalsWrapper } from "@/features/dashboard/displayed-goals/displayed-goals-wrapper";
import { ScoreboardWrapper } from "@/features/dashboard/scoreboard/scoreboard-wrapper";
import { QUERY_PARAMS } from "@/lib/query-params";
import { getCurrentWeek } from "@/lib/supabase/queries/queries";
import { dashboardMaxWidth } from "@/styles/common-style";

/**
 * Main Dashboard component that fetches and displays user habit tracking data.
 *
 * This component is async and must be rendered inside a Suspense boundary
 * because it accesses dynamic data (searchParams, cookies) that requires
 * request-time rendering in Next.js 16+.
 *
 * Authentication is handled by RequireAuth wrapper - this component assumes user is authenticated.
 */
export const Dashboard = async ({ searchParams }: DashboardProps) => {
  const params = await searchParams;
  const currentUser = await getUser();
  const currentWeek = await getCurrentWeek();

  // RequireAuth guarantees currentUser exists, but we still need to handle missing week data
  if (!currentUser || !currentWeek) {
    redirect(appNavLinks.signIn.href);
  }

  const selectedUserId = params[QUERY_PARAMS.selectedUserId] || currentUser.id;

  return (
    <div
      className="flex w-full flex-col gap-y-6"
      style={{ maxWidth: dashboardMaxWidth }}
    >
      <CurrentWeekHeader />
      <ScoreboardWrapper />
      <DisplayedGoalsWrapper selectedUserId={selectedUserId} />
      <AddGoalButtonWrapper selectedUserId={selectedUserId} />
      <AddGoalDialogWrapper userId={currentUser.id} />
    </div>
  );
};

interface DashboardProps {
  searchParams: Promise<{ [QUERY_PARAMS.selectedUserId]?: string }>;
}
