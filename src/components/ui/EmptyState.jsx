import { RefreshCw } from "lucide-react";

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="text-center py-14 sm:py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800">
      {Icon && (
        <Icon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
      )}
      <p className="text-sm sm:text-base font-medium text-gray-500 dark:text-gray-400">{title}</p>
      {description && (
        <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 mt-1 px-6">{description}</p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs sm:text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> {actionLabel}
        </button>
      )}
    </div>
  );
}