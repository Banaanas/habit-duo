import { Skeleton } from "@/components/ui/skeleton";

export const AuthErrorViewSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-y-8 p-4">
      {/* Error header skeleton */}
      <div className="flex flex-col items-center gap-y-4 text-center">
        <Skeleton className="size-24 rounded-full" />
        <div className="flex flex-col items-center gap-y-2">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-40" />
        </div>
      </div>

      {/* Card skeleton */}
      <div className="w-full max-w-md rounded-xl border bg-card p-6 shadow-lg">
        <div className="flex flex-col gap-y-6">
          {/* Error message skeleton */}
          <div className="flex flex-col gap-y-3 text-center">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6 self-center" />
            <Skeleton className="h-3 w-48 self-center" />
          </div>

          {/* Button skeleton */}
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
};
