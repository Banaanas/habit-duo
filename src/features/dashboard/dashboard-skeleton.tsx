import { Skeleton } from "@/components/ui/skeleton";
import { dashboardMaxWidth } from "@/styles/common-style";

export const DashboardSkeleton = () => {
  return (
    <div
      className="flex flex-col gap-y-6"
      style={{ maxWidth: dashboardMaxWidth }}
    >
      {/* Week Header Skeleton */}
      <div className="rounded-xl border bg-card">
        <div className="p-6">
          <Skeleton className="h-7 w-48 mb-2" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>

      {/* Scoreboard Skeleton */}
      <div className="rounded-xl border bg-card p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-8 w-20" />
          </div>
          <div className="flex-1 space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
      </div>

      {/* Goals Section Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-40 mb-4" />
        <div className="space-y-3">
          {/* Goal Card Skeleton 1 */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <div className="flex gap-1">
              {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className="flex-1 h-16 rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-4 w-24 ml-auto" />
          </div>

          {/* Goal Card Skeleton 2 */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <div className="flex gap-1">
              {[...Array(7)].map((_, i) => (
                <Skeleton key={i} className="flex-1 h-16 rounded-lg" />
              ))}
            </div>
            <Skeleton className="h-4 w-24 ml-auto" />
          </div>
        </div>
      </div>

      {/* Add Goal Button Skeleton */}
      <div className="flex justify-center">
        <Skeleton className="h-10 w-48" />
      </div>
    </div>
  );
};
