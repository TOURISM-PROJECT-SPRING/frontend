import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building2,
  Edit3,
  Camera,
  Lock,
  Smartphone,
  Clock,
  CheckCircle,
  X,
  Globe,
  Wallet,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { hotelService } from "../../services/hotelService";
import { authService } from "../../services/authService";
import useDashboardData from "../../hooks/useDashboardData";

export default function OwnerProfilePage() {
  const { user } = useAuth();
  const { data: dashboardData } = useDashboardData();
  const [properties, setProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [twoFA, setTwoFA] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [submittingPassword, setSubmittingPassword] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const allHotels = await hotelService.getAllHotels();
        // filter by current user's owned hotels or all if not assigned
        const myHotels = (allHotels || []).filter((h) => !user?.id || h.ownerId === user.id);
        setProperties(myHotels.length ? myHotels : allHotels || []);
      } catch (err) {
        console.error("Error loading owner properties:", err);
      } finally {
        setLoadingProperties(false);
      }
    };
    fetchProperties();
  }, [user]);

  const displayName = user?.fullname || user?.username || "Business Owner";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "BO";

  const ownerStats = [
    { label: "Properties Listed", value: String(properties.length) },
    { label: "Total Bookings", value: String(dashboardData?.totalBookings || 0) },
    { label: "Total Revenue", value: dashboardData?.revenueText || "$0" },
    { label: "Avg. Rating", value: dashboardData?.avgRating ? `${dashboardData.avgRating}/5` : "4.8" },
    { label: "Available Rooms", value: String(dashboardData?.totalRooms || 0) },
    { label: "Role", value: user?.roles?.[0] || "OWNER" },
  ];

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");
    const fd = new FormData(e.target);
    const currentPassword = fd.get("currentPassword");
    const newPassword = fd.get("newPassword");
    const confirmPassword = fd.get("confirmPassword");

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    setSubmittingPassword(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      setPasswordSuccess("Password updated successfully!");
      setTimeout(() => {
        setPasswordOpen(false);
        setPasswordSuccess("");
      }, 1500);
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to change password. Please verify current password.");
    } finally {
      setSubmittingPassword(false);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600 relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmgtNHY2aDJ2Mmgydi0yem0wLThoLTJ2MmgyVjI2ek0yNCAyNGgtMnYyaDJ2LTJ6bTAtNGgtMnYyaDJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        </div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <div className="relative">
              <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-2xl border-4 border-white dark:border-gray-800 shadow-lg flex items-center justify-center overflow-hidden">
                <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{initials}</span>
              </div>
              <button className="absolute bottom-1 right-1 w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center text-white hover:bg-emerald-700 transition shadow-md">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1 sm:pb-1">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{displayName}</h1>
              <p className="text-sm text-gray-400 dark:text-gray-500">Verified Business Owner</p>
            </div>
            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition shadow-sm"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-5">
          {/* Personal Info */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Account Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem icon={User} label="Username" value={user?.username || "N/A"} />
              <InfoItem icon={Mail} label="Email Address" value={user?.email || "N/A"} />
              <InfoItem icon={Phone} label="Contact Phone" value={user?.phone || "+855 12 345 678"} />
              <InfoItem icon={MapPin} label="Location" value={user?.address || "Siem Reap, Cambodia"} />
              <InfoItem icon={Calendar} label="Date of Birth" value={user?.dateOfBirth || "1990-05-15"} />
              <InfoItem icon={Building2} label="Business Entity" value={properties[0]?.hotelName ? `${properties[0].hotelName} Group` : "Tourism Hospitality"} />
            </div>
          </div>

          {/* Listed Properties */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">My Managed Properties</h3>
            {loadingProperties ? (
              <div className="py-6 text-center text-xs text-gray-400">Loading properties...</div>
            ) : properties.length === 0 ? (
              <div className="py-6 text-center text-xs text-gray-400">No properties registered yet.</div>
            ) : (
              <div className="space-y-3">
                {properties.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-gray-800 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg flex items-center justify-center">
                        <Building2 className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-gray-900 dark:text-white">{p.hotelName}</p>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500">{p.locationName || p.emailContact || "Cambodia"}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Payment & Business Profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem icon={Globe} label="Official Portal" value="https://smarttourism.cambodia.gov.kh" />
              <InfoItem icon={Wallet} label="Settlement Bank" value="ABA Bank ••••4821" />
              <InfoItem icon={Globe} label="Primary Language" value="Khmer / English" />
              <InfoItem icon={Clock} label="Account Status" value={user?.status || "ACTIVE"} />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Stats */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Performance Metrics</h3>
            <div className="space-y-3">
              {ownerStats.map((s) => (
                <div key={s.label} className="flex items-center justify-between py-1.5">
                  <span className="text-[13px] text-gray-500 dark:text-gray-400">{s.label}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Security & Authentication</h3>
            <div className="space-y-3">
              <button
                onClick={() => setPasswordOpen(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition text-left"
              >
                <Lock className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Change Password</p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">Update your security credentials</p>
                </div>
              </button>
              <div className="flex items-center justify-between px-3 py-2.5">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Auth</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">Enhanced login protection</p>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer">
                  <input type="checkbox" checked={twoFA} onChange={() => setTwoFA(!twoFA)} className="sr-only peer" />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-emerald-500/20 rounded-full peer peer-checked:after:translate-x-[18px] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditOpen(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Owner Profile</h2>
              <button onClick={() => setEditOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setEditOpen(false); }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  defaultValue={user?.fullname || ""}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={user?.email || ""}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address / Location</label>
                <input
                  type="text"
                  defaultValue={user?.address || "Siem Reap, Cambodia"}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => setEditOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {passwordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setPasswordOpen(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h2>
              <button onClick={() => setPasswordOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
              {passwordError && (
                <div className="p-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs rounded-lg">
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div className="p-3 bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-xs rounded-lg flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> {passwordSuccess}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                <input
                  name="currentPassword"
                  type="password"
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                <input
                  name="newPassword"
                  type="password"
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  minLength={6}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  disabled={submittingPassword}
                  onClick={() => setPasswordOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPassword}
                  className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition disabled:opacity-50"
                >
                  {submittingPassword ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="w-4 h-4 text-gray-400 dark:text-gray-500 mt-0.5 shrink-0" />
      <div>
        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-semibold">{label}</p>
        <p className="text-[13px] font-medium text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
