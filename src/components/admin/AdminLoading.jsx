import { Loader2 } from "lucide-react";

const SKELETON_CARDS = 7;

function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-3.5">
      <div className="h-4 w-4 bg-gray-100 dark:bg-gray-700 rounded animate-pulse mb-2" />
      <div className="h-6 w-16 bg-gray-100 dark:bg-gray-700 rounded animate-pulse mb-2" />
      <div className="h-3 w-20 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
    </div>
  );
}

export default function AdminLoading({ message = "Loading data from the server...", skeleton = false }) {
  if (skeleton) {
    return (
      <div className="space-y-5 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 w-48 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-3 w-64 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-3">
          {Array.from({ length: SKELETON_CARDS }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 h-64 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 animate-pulse" />
          <div className="h-64 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 animate-pulse" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div className="xl:col-span-2 space-y-5">
            <div className="h-52 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 animate-pulse" />
            <div className="h-40 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 animate-pulse" />
          </div>
          <div className="space-y-5">
            <div className="h-40 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 animate-pulse" />
            <div className="h-52 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-16 animate-fade-in">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
      <p className="mt-4 text-sm font-semibold text-gray-700 dark:text-gray-200">{message}</p>
      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Fetching live data from the API…</p>
    </div>
  );
}