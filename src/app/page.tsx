import { Metadata } from "next";
import { Suspense } from "react";

import { Dashboard } from "@/features/dashboard/dashboard";
import { DashboardSkeleton } from "@/features/dashboard/dashboard-skeleton";
import { QUERY_PARAMS } from "@/lib/query-params";

const HomePage = ({ searchParams }: HomePageProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Suspense fallback={<DashboardSkeleton />}>
        <Dashboard searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default HomePage;

interface HomePageProps {
  searchParams: Promise<{ [QUERY_PARAMS.selectedUserId]?: string }>;
}

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Track your weekly habits and compete with your friend for the highest score",
};
