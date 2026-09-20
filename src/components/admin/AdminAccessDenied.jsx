import { ShieldX } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminAccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center justify-center mb-4">
        <ShieldX className="w-8 h-8 text-red-500 dark:text-red-400" />
      </div>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white">Access Denied</h2>
      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1 max-w-sm">
        Your role does not include the permission required to open this admin page.
      </p>
      <button
        type="button"
        onClick={() => navigate("/admin", { replace: true })}
        className="mt-5 px-4 py-2 text-sm font-semibold text-white bg-[#1b3b2b] hover:bg-[#12281e] rounded-xl transition cursor-pointer"
      >
        Back to Dashboard
      </button>
    </div>
  );
}