import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit3,
  Camera,
  Lock,
  Key,
  Smartphone,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { profileService } from "../../services/profileService";
import { useToast } from "../../components/ui/Toast";

const activityLog = [
  { action: "Updated system settings", time: "2 hours ago", icon: CheckCircle, color: "text-green-500" },
  { action: "Approved new owner: Skyline Resorts", time: "5 hours ago", icon: CheckCircle, color: "text-green-500" },
  { action: "Flagged review #RV-4821", time: "1 day ago", icon: AlertTriangle, color: "text-yellow-500" },
  { action: "Removed user: spam_account", time: "2 days ago", icon: AlertTriangle, color: "text-red-500" },
  { action: "Updated payment gateway", time: "3 days ago", icon: CheckCircle, color: "text-green-500" },
  { action: "Created promotion: WELCOME20", time: "5 days ago", icon: CheckCircle, color: "text-green-500" },
];

const adminStats = [
  { label: "Users Managed", value: "2,568" },
  { label: "Owners Approved", value: "356" },
  { label: "Bookings Reviewed", value: "4,789" },
  { label: "Reports Generated", value: "124" },
  { label: "Promotions Created", value: "47" },
  { label: "System Uptime", value: "99.9%" },
];

export default function AdminProfilePage() {
  const { user: authUser, userId } = useAuth();
  const toast = useToast();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editSaving, setEditSaving] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [twoFA, setTwoFA] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    profileService
      .load(userId, {
        fullname: authUser?.fullname || "Admin",
        email: authUser?.email || "",
        username: authUser?.username || "",
        phone: "",
        address: "",
        gender: "",
        dateOfBirth: null,
        createdAt: null,
        roles: authUser?.roles || ["ADMIN"],
      })
      .then((data) => {
        setProfile(data);
        setLoading(false);
      });
  }, [userId, authUser]);

  const initials = (profile?.fullname || "AU")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formatDate = (iso) => {
    if (!iso) return "N/A";
    try {
      return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    } catch {
      return iso.slice(0, 10);
    }
  };

  const openEdit = () => {
    setEditForm({
      fullname: profile?.fullname || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
    });
    setEditOpen(true);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    if (!userId) return;
    setEditSaving(true);
    try {
      const updated = await profileService.update(userId, editForm);
      setProfile((p) => ({ ...p, ...updated }));
      setEditOpen(false);
      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error(err?.message || "Failed to update profile.");
    } finally {
      setEditSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (!pwForm.newPassword) return;
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    setPwSaving(true);
    try {
      await profileService.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
        confirmPassword: pwForm.confirmPassword,
      });
      setPasswordOpen(false);
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast.success("Password changed successfully.");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || "Could not change password.";
      toast.error(msg);
    } finally {
      setPwSaving(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-gray-400">Loading profile...</div>;
  }

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Profile Header */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary to-primary-dark relative">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ij48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtMmgtNHY2aDJ2Mmgydi0yem0wLThoLTJ2MmgyVjI2ek0yNCAyNGgtMnYyaDJ2LTJ6bTAtNGgtMnYyaDJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        </div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <div className="relative">
              <div className="w-24 h-24 bg-white dark:bg-gray-900 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                <span className="text-3xl font-bold text-primary">{initials}</span>
              </div>
              <button className="absolute bottom-1 right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary-dark transition shadow-md">
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="flex-1 sm:pb-1">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{profile?.fullname || "Admin"}</h1>
              <p className="text-sm text-gray-400 dark:text-gray-500">{profile?.roles?.[0] || "Administrator"}</p>
            </div>
            <button
              onClick={openEdit}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition"
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
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 animate-fade-in-up delay-75">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Personal Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem icon={User} label="Full Name" value={profile?.fullname || "N/A"} />
              <InfoItem icon={Mail} label="Email" value={profile?.email || "N/A"} />
              <InfoItem icon={Phone} label="Phone" value={profile?.phone || "N/A"} />
              <InfoItem icon={MapPin} label="Location" value={profile?.address || "N/A"} />
              <InfoItem icon={Calendar} label="Joined" value={formatDate(profile?.createdAt)} />
              <InfoItem icon={Shield} label="Role" value={profile?.roles?.[0] || "ADMIN"} />
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 animate-fade-in-up delay-150">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {activityLog.map((a, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0 animate-slide-right" style={{ animationDelay: `${i * 80 + 200}ms` }}>
                  <a.icon className={`w-4 h-4 ${a.color} shrink-0`} />
                  <span className="text-[13px] text-gray-600 dark:text-gray-300 flex-1">{a.action}</span>
                  <span className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" /> {a.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Stats */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 animate-fade-in-up delay-100">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Admin Statistics</h3>
            <div className="space-y-3">
              {adminStats.map((s, i) => (
                <div key={s.label} className="flex items-center justify-between py-1.5 animate-slide-left" style={{ animationDelay: `${i * 60 + 300}ms` }}>
                  <span className="text-[13px] text-gray-500 dark:text-gray-400 dark:text-gray-500">{s.label}</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{s.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 animate-fade-in-up delay-200">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Security</h3>
            <div className="space-y-3">
              <button
                onClick={() => setPasswordOpen(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-800 transition text-left"
              >
                <Lock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Change Password</p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">Keep your account secure</p>
                </div>
              </button>
              <div className="flex items-center justify-between px-3 py-2.5">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Auth</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-500">Extra security layer</p>
                  </div>
                </div>
                <label className="relative inline-flex cursor-pointer">
                  <input type="checkbox" checked={twoFA} onChange={() => setTwoFA(!twoFA)} className="sr-only peer" />
                  <div className="w-10 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-[18px] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-600 dark:text-gray-300">
                <Key className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">API Keys</p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">2 active keys</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !editSaving && setEditOpen(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Profile</h2>
              <button onClick={() => !editSaving && setEditOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 transition text-gray-400 dark:text-gray-500"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={saveProfile} className="p-6 space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">{initials}</span>
                </div>
                <button type="button" className="text-sm font-medium text-primary hover:text-primary-dark transition">Change Photo</button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input type="text" required value={editForm.fullname} onChange={(e) => setEditForm((f) => ({ ...f, fullname: e.target.value }))} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input type="email" required value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                <input type="tel" value={editForm.phone} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                <input type="text" value={editForm.address} onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => !editSaving && setEditOpen(false)} disabled={editSaving} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={editSaving} className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition disabled:opacity-50">
                  {editSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {passwordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !pwSaving && setPasswordOpen(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h2>
              <button onClick={() => !pwSaving && setPasswordOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 transition text-gray-400 dark:text-gray-500"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={changePassword} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                <input type="password" required value={pwForm.currentPassword} onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                <input type="password" required minLength={6} value={pwForm.newPassword} onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                <input type="password" required minLength={6} value={pwForm.confirmPassword} onChange={(e) => setPwForm((f) => ({ ...f, confirmPassword: e.target.value }))} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => !pwSaving && setPasswordOpen(false)} disabled={pwSaving} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={pwSaving} className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition disabled:opacity-50">
                  {pwSaving ? "Updating..." : "Update Password"}
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
        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-[13px] font-medium text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}