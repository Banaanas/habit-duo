import { Skeleton } from "@/components/ui/skeleton";

export const AuthErrorViewSkeleton = () => {
  return (
    <div className="flex w-full flex-col items-center gap-y-4">
      <div className="flex w-full flex-col items-center justify-center p-4">
        <div className="flex w-full max-w-md flex-col gap-y-8">
          {/* Error icon skeleton */}
          <div className="flex flex-col items-center gap-y-4">
            <Skeleton className="size-24 rounded-full" />
            <div className="flex flex-col items-center gap-y-2">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-5 w-40" />
            </div>
          </div>

          {/* Card skeleton */}
          <div className="bg-card flex w-full flex-col gap-y-6 rounded-xl border p-6 shadow-lg">
            <div className="flex flex-col gap-y-3 text-center">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6 self-center" />
              <Skeleton className="h-3 w-48 self-center" />
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
