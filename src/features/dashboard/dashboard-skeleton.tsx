import { Skeleton } from "@/components/ui/skeleton";
import { dashboardMaxWidth } from "@/styles/common-style";

export const DashboardSkeleton = () => {
  return (
    <div
      className="flex w-full flex-col justify-center gap-y-6"
      style={{ maxWidth: dashboardMaxWidth }}
    >
      {/* Week Header Skeleton */}
      <div className="bg-card rounded-xl border p-6">
        <Skeleton className="h-7 w-48" />
      </div>

      {/* Scoreboard Skeleton */}
      <div className="bg-card flex flex-col items-center justify-center gap-y-10 rounded-xl border p-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>

      {/* Goals Section Skeleton */}
      <div className="flex flex-col gap-y-2">
        <Skeleton className="h-8 w-full max-w-40" />
        <div className="flex flex-col gap-y-3">
          <GoalCardSkeleton />
          <GoalCardSkeleton />
        </div>
      </div>

      {/* Add Goal Button Skeleton */}
      <Skeleton className="h-10 w-48 self-center" />
    </div>
  );
};

const GoalCardSkeleton = () => {
  return (
    <div className="bg-card border-border flex flex-col gap-y-4 rounded-xl border p-4">
      <div className="flex items-start justify-between">
        <div className="flex flex-1 flex-col gap-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
      <div className="flex w-full justify-between">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-y-1">
            <Skeleton className="h-3 w-6" />
            <Skeleton className="size-7 rounded-xl" />
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  );
};
