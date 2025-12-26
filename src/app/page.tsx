import { redirect } from "next/navigation";

import { getUser } from "@/actions/auth";
import { appNavLinks } from "@/data/app-data";
import { Dashboard } from "@/features/dashboard/dashboard";
import { getCurrentWeek } from "@/lib/supabase/queries";

interface HomePageProps {
  searchParams: Promise<{ selected?: string }>;
}

const HomePage = async ({ searchParams }: HomePageProps) => {
  const currentUser = await getUser();

  if (!currentUser) {
    redirect(appNavLinks.signIn.href);
  }

  const currentWeek = await getCurrentWeek();

  if (!currentWeek) {
    return <div>Loading...</div>;
  }

  const params = await searchParams;
  const selectedUserId = params.selected || currentUser.id;

  return (
    <div className="flex w-full justify-center items-center">
      <Dashboard
        currentUserId={currentUser.id}
        weekId={currentWeek.id}
        weekStartDate={currentWeek.startDate}
        weekEndDate={currentWeek.endDate}
        selectedUserId={selectedUserId}
      />
    </div>
  );
};

export default HomePage;
