import { redirect } from "next/navigation";

import { getUser } from "@/actions/auth";
import { appNavLinks } from "@/data/app-data";
import { Dashboard } from "@/features/dashboard/dashboard";
import { QUERY_PARAMS } from "@/lib/query-params";
import { getCurrentWeek } from "@/lib/supabase/queries";

/**
 * Wrapper component that handles dynamic data fetching for the Dashboard.
 *
 * This component exists to ensure all dynamic data (searchParams, cookies)
 * is accessed inside a Suspense boundary, as required by Next.js 15+.
 *
 * - Awaits searchParams (dynamic route data)
 * - Fetches current user (requires cookies)
 * - Fetches current week (requires cookies)
 * - Handles auth redirect if user not authenticated
 */
export const DashboardWrapper = async ({
  searchParams,
}: DashboardWrapperProps) => {
  const params = await searchParams;
  const currentUser = await getUser();
  const currentWeek = await getCurrentWeek();

  if (!currentUser || !currentWeek) {
    redirect(appNavLinks.signIn.href);
  }

  const selectedUserId = params[QUERY_PARAMS.selectedUserId] || currentUser.id;

  return (
    <Dashboard
      currentUserId={currentUser.id}
      weekId={currentWeek.id}
      selectedUserId={selectedUserId}
    />
  );
};

interface DashboardWrapperProps {
  searchParams: Promise<{ [QUERY_PARAMS.selectedUserId]?: string }>;
}
