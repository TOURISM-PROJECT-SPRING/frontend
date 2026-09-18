import { useEffect, useRef, useState } from "react";
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
  Loader2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { userAttachmentService } from "../../services/userAttachmentService";
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
  const { user, userId, avatarUrl, setAvatarUrl } = useAuth();
  const toast = useToast();
  const fileInputRef = useRef(null);
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [twoFA, setTwoFA] = useState(true);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const shownAvatar = preview || avatarUrl;

  const initials =
    (user?.fullname || user?.username || "Admin User")
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "AU";

  const displayName = user?.fullname || user?.username || "Admin User";
  const displayEmail = user?.email || "Not provided";
  const roleLabel = user?.role || user?.roles?.[0] || "Administrator";
  const nameParts = (user?.fullname || "").split(" ").filter(Boolean);
  const firstName = nameParts[0] || user?.username || "";
  const lastName = nameParts.slice(1).join(" ");
  const joinedLabel = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—";

  useEffect(() => {
    if (!userId) return;
    let active = true;
    userAttachmentService
      .getUserAttachments(userId)
      .then((attachments) => {
        if (!active) return;
        const profile =
          (attachments || []).find((a) => a.type === "PROFILE") || (attachments || [])[0];
        if (profile?.cloudinaryUrl) setAvatarUrl(profile.cloudinaryUrl);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [userId, setAvatarUrl]);

  const handleAvatarSelect = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.type && !file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB.");
      return;
    }
    if (!userId) {
      toast.error("You must be signed in to upload a photo.");
      return;
    }

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    setUploading(true);
    try {
      const uploaded = await userAttachmentService.uploadUserAttachment(userId, file, "PROFILE");
      const url = uploaded?.[0]?.cloudinaryUrl || uploaded?.cloudinaryUrl || localPreview;
      setAvatarUrl(url);
      toast.success("Profile photo updated");
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      toast.error("Failed to upload profile photo. Please try again.");
    } finally {
      setUploading(false);
      setPreview("");
    }
  };

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
                {shownAvatar ? (
                  <img src={shownAvatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-primary">{initials}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                title="Change profile photo"
                className="absolute bottom-1 right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary-dark transition shadow-md disabled:opacity-60 cursor-pointer"
              >
                {uploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Camera className="w-3.5 h-3.5" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarSelect}
                disabled={uploading}
                className="hidden"
              />
            </div>
            <div className="flex-1 sm:pb-1">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{displayName}</h1>
              <p className="text-sm text-gray-400 dark:text-gray-500">{roleLabel}</p>
            </div>
            <button
              onClick={() => setEditOpen(true)}
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
              <InfoItem icon={User} label="Full Name" value={displayName} />
              <InfoItem icon={Mail} label="Email" value={displayEmail} />
              <InfoItem icon={Phone} label="Phone" value={user?.phone || user?.phoneNumber || "Not provided"} />
              <InfoItem icon={MapPin} label="Location" value={user?.address || "Not provided"} />
              <InfoItem icon={Calendar} label="Joined" value={joinedLabel} />
              <InfoItem icon={Shield} label="Role" value={roleLabel} />
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
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">Last changed 30 days ago</p>
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
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditOpen(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Profile</h2>
              <button onClick={() => setEditOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 transition text-gray-400 dark:text-gray-500"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setEditOpen(false); }} className="p-6 space-y-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center overflow-hidden">
                  {shownAvatar ? (
                    <img src={shownAvatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-primary">{initials}</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="text-sm font-medium text-primary hover:text-primary-dark transition disabled:opacity-60 cursor-pointer"
                >
                  {uploading ? "Uploading..." : "Change Photo"}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
                  <input type="text" defaultValue={firstName} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
                  <input type="text" defaultValue={lastName} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input type="email" defaultValue={displayEmail} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                <input type="tel" defaultValue={user?.phone || user?.phoneNumber || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                <input type="text" defaultValue={user?.address || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio</label>
                <textarea rows={3} defaultValue={user?.bio || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition resize-none" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => setEditOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {passwordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setPasswordOpen(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h2>
              <button onClick={() => setPasswordOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700 transition text-gray-400 dark:text-gray-500"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setPasswordOpen(false); }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                <input type="password" required className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                <input type="password" required className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                <input type="password" required className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => setPasswordOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition">Update Password</button>
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
