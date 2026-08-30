import { Loader2, RefreshCw } from "lucide-react";

export function LoadingState({ rows = 6, className = "" }) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 ${className}`}
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 h-80"
        />
      ))}
    </div>
  );
}

export function ErrorState({ onRetry }) {
  return (
    <div className="text-center py-12 sm:py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800">
      <p className="text-sm sm:text-base text-gray-400 dark:text-gray-500">
        Oops — we couldn't load this content. Check your connection and try again.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Try again
        </button>
      )}
    </div>
  );
}

export function InlineLoader() {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-primary">
      <Loader2 className="w-6 h-6 animate-spin" />
    </div>
  );
}