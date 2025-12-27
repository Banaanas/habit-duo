import { redirect } from "next/navigation";

import { getUser } from "@/actions/auth";
import { appNavLinks } from "@/data/app-data";
import { Dashboard } from "@/features/dashboard/dashboard";
import { QUERY_PARAMS } from "@/lib/query-params";
import { getCurrentWeek } from "@/lib/supabase/queries";

const HomePage = async ({ searchParams }: HomePageProps) => {
  const currentUser = await getUser();
  const currentWeek = await getCurrentWeek();

  const params = await searchParams;

  if (!currentUser || !currentWeek) {
    redirect(appNavLinks.signIn.href);
  }
  const selectedUserId = params[QUERY_PARAMS.selectedUserId] || currentUser.id;

  return (
    <div className="flex w-full justify-center items-center">
      <Dashboard
        currentUserId={currentUser.id}
        weekId={currentWeek.id}
        selectedUserId={selectedUserId}
      />
    </div>
  );
};

export default HomePage;

interface HomePageProps {
  searchParams: Promise<{ [QUERY_PARAMS.selectedUserId]?: string }>;
}
