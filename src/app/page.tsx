import { Metadata } from "next";
import { Suspense } from "react";

import { appPageMetadata } from "@/data/app-data";
import { RequireAuth } from "@/features/auth/require-auth";
import { Dashboard } from "@/features/dashboard/dashboard";
import { DashboardSkeleton } from "@/features/dashboard/dashboard-skeleton";
import { QUERY_PARAMS } from "@/lib/query-params";

const HomePage = ({ searchParams }: HomePageProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Suspense fallback={<DashboardSkeleton />}>
        <RequireAuth>
          <Dashboard searchParams={searchParams} />
        </RequireAuth>
      </Suspense>
    </div>
  );
};

export default HomePage;

interface HomePageProps {
  searchParams: Promise<{ [QUERY_PARAMS.selectedUserId]?: string }>;
}

export const metadata: Metadata = {
  title: appPageMetadata.home.title,
  description: appPageMetadata.home.description,
};
