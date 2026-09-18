import { Construction } from "lucide-react";

export default function AdminPlaceholderPage({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-4">
        <Construction className="w-8 h-8 text-gray-300" />
      </div>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 text-center max-w-sm">
        {description || "This page is under development. Full CRUD functionality coming soon."}
      </p>
    </div>
  );
}
