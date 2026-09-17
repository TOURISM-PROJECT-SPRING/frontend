import { Skeleton } from "../../ui/feedback";

// Loading skeleton mirroring the real section order of the detail page.
export default function DetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1440px] animate-pulse px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="h-4 w-2/3 max-w-md" />
      <Skeleton className="mt-6 h-12 w-3/4 max-w-2xl" />
      <Skeleton className="mt-3 h-6 w-56" />
      <Skeleton className="mt-2 h-5 w-72" />
      <div className="mt-6 grid gap-2 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
        <Skeleton className="h-[300px] w-full sm:h-[440px] lg:h-[560px]" />
        <div className="grid grid-rows-3 gap-2">
          <Skeleton className="h-full" />
          <Skeleton className="h-full" />
          <Skeleton className="h-full" />
        </div>
      </div>
      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,65%)_minmax(0,1fr)]">
        <div>
          <Skeleton className="h-14 w-56 rounded-2xl" />
          <Skeleton className="mt-5 h-24 w-full" />
          <Skeleton className="mt-3 h-24 w-full" />
          <Skeleton className="mt-8 h-8 w-40" />
          <Skeleton className="mt-4 h-6 w-full max-w-xl" />
          <Skeleton className="mt-3 h-6 w-full max-w-lg" />
        </div>
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    </div>
  );
}
