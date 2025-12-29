import { Skeleton } from "@/components/ui/skeleton";

export const SignInViewSkeleton = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center p-4">
      <div className="flex w-full max-w-md flex-col gap-y-6 rounded-xl border bg-card p-8 shadow-lg">
        {/* Logo skeleton */}
        <div className="flex flex-col items-center gap-y-3">
          <Skeleton className="h-16 w-16 rounded-2xl" />
          <div className="flex flex-col items-center gap-y-1">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>

        {/* Form skeleton */}
        <div className="flex flex-col gap-y-4">
          <div className="flex flex-col gap-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
};
