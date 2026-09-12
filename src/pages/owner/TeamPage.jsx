import { useEffect, useState } from "react";
import { Mail, Languages } from "lucide-react";
import { managementService } from "../../services/managementService";

export default function OwnerTeamPage() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await managementService.getTourGuides();
        setGuides(data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tour guides:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="p-12 text-center text-sm text-gray-400">Loading team from server...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team Members</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Tour guides and team</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {guides.map((g) => (
          <div key={g.id} className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-md transition">
            <div className="flex items-center gap-3 mb-3">
              <img src={`https://i.pravatar.cc/100?u=${g.userId || g.id}`} alt={g.userName} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{g.userName || "N/A"}</h3>
                <p className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" /> {g.userEmail || "N/A"}</p>
              </div>
            </div>
            <div className="space-y-1.5 border-t border-gray-50 dark:border-gray-800 pt-3">
              <p className="text-[11px] text-gray-400 flex items-center gap-1"><Languages className="w-3 h-3" /> {g.languageSpoken || "N/A"}</p>
              <p className="text-[11px] text-gray-400">{g.experienceYear || 0} years</p>
              <p className="text-sm font-bold text-primary">${g.ratePerDay}/day</p>
            </div>
          </div>
        ))}
      </div>

      {guides.length === 0 && <div className="text-center py-12 text-sm text-gray-400 dark:text-gray-500">No team members found.</div>}
    </div>
  );
}