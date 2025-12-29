import { Skeleton } from "@/components/ui/skeleton";

export const SignInViewSkeleton = () => {
  return (
    <div className="flex w-full flex-col items-center gap-y-8">
      <div className="flex w-full flex-col items-center gap-y-2">
        <Skeleton className="h-8 w-full max-w-[320px]" />
        <Skeleton className="h-6 w-full max-w-[280px]" />
      </div>
      <div className="flex w-full flex-col items-center justify-center p-4">
        <div className="bg-card flex w-full max-w-sm flex-col gap-y-6 rounded-xl border p-8 shadow-lg">
          <div className="flex flex-col gap-y-3">
            <div className="flex items-center gap-x-2">
              <Skeleton className="size-12 rounded-full" />
              <Skeleton className="h-8 w-full max-w-40" />
            </div>
            <Skeleton className="h-4 w-full max-w-64" />
          </div>

          {/* Form skeleton */}
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
