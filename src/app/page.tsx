import { Suspense } from "react";
import { redirect } from "next/navigation";

import { getUser } from "@/actions/auth";
import { appNavLinks } from "@/data/app-data";
import { Dashboard } from "@/features/dashboard/dashboard";
import { QUERY_PARAMS } from "@/lib/query-params";
import { getCurrentWeek } from "@/lib/supabase/queries";

const HomePage = async ({ searchParams }: HomePageProps) => {
  const params = await searchParams;

  return (
    <div className="flex w-full justify-center items-center">
      <Suspense fallback={<div>Loading...</div>}>
        <DashboardWrapper selectedUserId={params[QUERY_PARAMS.selectedUserId]} />
      </Suspense>
    </div>
  );
};

const DashboardWrapper = async ({ selectedUserId }: DashboardWrapperProps) => {
  const currentUser = await getUser();
  const currentWeek = await getCurrentWeek();

  if (!currentUser || !currentWeek) {
    redirect(appNavLinks.signIn.href);
  }

  const finalSelectedUserId = selectedUserId || currentUser.id;

  return (
    <Dashboard
      currentUserId={currentUser.id}
      weekId={currentWeek.id}
      selectedUserId={finalSelectedUserId}
    />
  );
};

export default HomePage;

interface HomePageProps {
  searchParams: Promise<{ [QUERY_PARAMS.selectedUserId]?: string }>;
}

interface DashboardWrapperProps {
  selectedUserId?: string;
}
