import { useState } from "react";
import { Mail, Shield, Edit3, Trash2, UserPlus, X } from "lucide-react";

const roleColors = { Admin: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400", Manager: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400", Staff: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400", Viewer: "bg-gray-100 text-gray-500 dark:bg-gray-600 dark:text-gray-300" };
const statusDot = { Active: "bg-green-400", Inactive: "bg-gray-300" };

const initialMembers = [
  { id: 1, name: "Sovann Vannak", email: "sovann@greenpark.com", role: "Admin", status: "Active", avatar: "https://i.pravatar.cc/80?img=11", phone: "+855 12 345 678" },
  { id: 2, name: "Chan Dara", email: "dara@greenpark.com", role: "Manager", status: "Active", avatar: "https://i.pravatar.cc/80?img=32", phone: "+855 12 987 654" },
  { id: 3, name: "Bopha Kem", email: "bopha@greenpark.com", role: "Staff", status: "Active", avatar: "https://i.pravatar.cc/80?img=47", phone: "+855 12 456 789" },
  { id: 4, name: "Sokha Meng", email: "sokha@greenpark.com", role: "Staff", status: "Inactive", avatar: "https://i.pravatar.cc/80?img=53", phone: "+855 12 321 654" },
  { id: 5, name: "Dara Chhorn", email: "dara.c@greenpark.com", role: "Viewer", status: "Active", avatar: "https://i.pravatar.cc/80?img=15", phone: "+855 12 789 012" },
];

const roles = ["Admin", "Manager", "Staff", "Viewer"];

export default function OwnerTeamPage() {
  const [members, setMembers] = useState(initialMembers);
  const [formOpen, setFormOpen] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleSave = (data) => {
    if (editMember) {
      setMembers((prev) => prev.map((m) => (m.id === editMember.id ? { ...m, ...data } : m)));
    } else {
      setMembers((prev) => [{ ...data, id: Date.now(), status: "Active", avatar: "https://i.pravatar.cc/80?img=11" }, ...prev]);
    }
    setFormOpen(false);
    setEditMember(null);
  };

  const handleDelete = () => {
    setMembers((prev) => prev.filter((m) => m.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team Members</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Manage your team and roles</p>
        </div>
        <button
          onClick={() => { setEditMember(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition"
        >
          <UserPlus className="w-4 h-4" /> Invite Member
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-800">
                {["Member", "Role", "Status", "Phone", "Actions"].map((h) => (
                  <th key={h} className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={m.avatar} alt={m.name} className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{m.name}</p>
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 flex items-center gap-1"><Mail className="w-3 h-3" /> {m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${roleColors[m.role]}`}><Shield className="w-3 h-3" /> {m.role}</span></td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300">
                      <span className={`w-2 h-2 rounded-full ${statusDot[m.status]}`} />
                      {m.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{m.phone}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => { setEditMember(m); setFormOpen(true); }} className="p-1.5 rounded-lg hover:bg-primary/5 transition"><Edit3 className="w-3.5 h-3.5 text-primary" /></button>
                      <button onClick={() => setDeleteTarget(m)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setFormOpen(false); setEditMember(null); }} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editMember ? "Edit Member" : "Invite Member"}</h2>
              <button onClick={() => { setFormOpen(false); setEditMember(null); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-400 dark:text-gray-500"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); handleSave({ ...editMember, ...d }); }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name *</label>
                <input name="name" required defaultValue={editMember?.name || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                <input name="email" type="email" required defaultValue={editMember?.email || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role *</label>
                  <select name="role" required defaultValue={editMember?.role || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                    <option value="">Select role</option>
                    {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                  <input name="phone" defaultValue={editMember?.phone || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => { setFormOpen(false); setEditMember(null); }} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition">{editMember ? "Save Changes" : "Send Invite"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-red-50 dark:bg-red-500/15 rounded-full mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-500 dark:text-red-400" /></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Remove Member</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Remove <strong>{deleteTarget.name}</strong> from the team?</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition">Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
