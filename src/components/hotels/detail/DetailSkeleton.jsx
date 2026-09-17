import { Skeleton } from "../../ui/feedback";

// Full-page loading skeleton mirroring the real section order so the layout
// doesn't jump when data arrives.
export default function DetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1440px] animate-pulse px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="h-4 w-2/3 max-w-md" />
      <Skeleton className="mt-6 h-10 w-3/4 max-w-xl" />
      <Skeleton className="mt-3 h-6 w-56" />
      <div className="mt-6 grid gap-2 lg:grid-cols-[3fr_1fr]">
        <Skeleton className="h-[300px] w-full sm:h-[440px] lg:h-[560px]" />
        <div className="grid grid-rows-3 gap-2">
          <Skeleton className="h-full" />
          <Skeleton className="h-full" />
          <Skeleton className="h-full" />
        </div>
      </div>
      <Skeleton className="mt-8 h-8 w-2/3 max-w-lg" />
      <Skeleton className="mt-4 h-64 w-full rounded-2xl" />
      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-72 w-full rounded-2xl" />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
      <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-72 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
