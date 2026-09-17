import { Link } from "react-router-dom";
import { Compass, ArrowLeft } from "lucide-react";

export default function AdminNotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-5">
        <Compass className="w-8 h-8 text-primary" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">404 — Page not found</h2>
      <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 max-w-sm">
        The admin page you're looking for doesn't exist or has been moved. Check the URL or head back to the dashboard.
      </p>
      <Link
        to="/admin"
        className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>
    </div>
  );
}