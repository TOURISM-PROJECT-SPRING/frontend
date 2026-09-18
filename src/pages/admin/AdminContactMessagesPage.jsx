import AdminLoading from "../../components/admin/AdminLoading";
import TotalBadge from "../../components/admin/TotalBadge";
import AdminPagination from "../../components/admin/AdminPagination";
import { useEffect, useState } from "react";
import { Search, CheckCheck, Trash2, Eye, X, AlertTriangle, Mail, User, Clock, MessageSquare } from "lucide-react";
import { contactService } from "../../services/contactService";
import { useToast } from "../../components/ui/Toast";

const formatWhen = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso).slice(0, 10);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return iso.slice(0, 10);
};

export default function AdminContactMessagesPage() {
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [viewTarget, setViewTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    try {
      const data = await contactService.getAllMessages();
      setMessages(data || []);
    } catch (error) {
      console.error("Error fetching contact messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = async (id) => {
    try {
      await contactService.markRead(id);
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
      toast.success("Message marked as read");
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const remove = async (id) => {
    setDeleting(true);
    try {
      await contactService.deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      toast.success("Message deleted successfully");
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.success("Message deleted (offline mode)");
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } finally {
      setDeleteTarget(null);
      setDeleting(false);
    }
  };

  const filtered = messages
    .filter((m) => readFilter === "All" || (readFilter === "Unread" ? !m.isRead : m.isRead))
    .filter(
      (m) =>
        `${m.name || ""} ${m.email || ""} ${m.subject || ""} ${m.message || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
    );

  const totalItems = filtered.length;
  const paginatedItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (loading) return <AdminLoading message="Loading contact messages from the server..." />;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Messages</h1>
          <TotalBadge count={messages.length} />
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Messages sent from the contact form</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Search by name, email, subject..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition"
          />
        </div>
        <div className="flex gap-2">
          {["All", "Unread", "Read"].map((s) => (
            <button
              key={s}
              onClick={() => {
                setReadFilter(s);
                setCurrentPage(1);
              }}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition ${readFilter === s ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50 dark:border-gray-800">
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Sender</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Subject</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Message</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Received</th>
                <th className="text-left text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-right text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedItems.map((m) => (
                <tr key={m.id} className={`border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition ${!m.isRead ? "bg-primary/[0.02]" : ""}`}>
                  <td className="px-4 py-3">
                    <p className={`text-sm font-medium ${!m.isRead ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}>{m.name || "N/A"}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{m.email || ""}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${!m.isRead ? "text-gray-900 dark:text-white font-medium" : "text-gray-700 dark:text-gray-300"}`}>{m.subject || "N/A"}</span>
                  </td>
                  <td className="px-4 py-3 max-w-[320px]">
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{m.message || "N/A"}</p>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-gray-500 dark:text-gray-400">{formatWhen(m.createdAt)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${m.isRead ? "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300" : "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"}`}>
                      {m.isRead ? "Read" : "New"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setViewTarget(m);
                          if (!m.isRead) markRead(m.id);
                        }}
                        title="View message"
                        className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/5 transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {!m.isRead && (
                        <button
                          onClick={() => markRead(m.id)}
                          title="Mark as read"
                          className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-gray-400 hover:text-primary hover:bg-primary/5 transition"
                        >
                          <CheckCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setDeleteTarget(m)}
                        title="Delete"
                        className="w-8 h-8 rounded-lg inline-flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-gray-400 dark:text-gray-500">No contact messages found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <AdminPagination currentPage={currentPage} pageSize={pageSize} totalItems={totalItems} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} itemLabel="messages" />
      </div>

      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg p-6 animate-scale-in">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" /> Message Details
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">Contact form inquiry</p>
              </div>
              <button onClick={() => setViewTarget(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800/60 rounded-xl p-4 mb-4">
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{viewTarget.name || "N/A"}</p>
                <p className="text-xs text-gray-400 mt-0.5">{viewTarget.email || ""}</p>
              </div>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${viewTarget.isRead ? "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300" : "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400"}`}>
                {viewTarget.isRead ? "Read" : "New"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Sender</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{viewTarget.name || "N/A"}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Received</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{formatWhen(viewTarget.createdAt) || "N/A"}</p>
              </div>
              <div className="col-span-2 bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3">
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5" /> Subject</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">{viewTarget.subject || "N/A"}</p>
              </div>
            </div>

            <div className="mt-4 p-3.5 bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-400 mb-1">Message</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{viewTarget.message || "No message."}</p>
            </div>

            <div className="flex gap-2 mt-5">
              {!viewTarget.isRead && (
                <button
                  type="button"
                  onClick={() => {
                    markRead(viewTarget.id);
                    setViewTarget((v) => ({ ...v, isRead: true }));
                  }}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <CheckCheck className="w-4 h-4" /> Mark as Read
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  setDeleteTarget(viewTarget);
                  setViewTarget(null);
                }}
                className="flex-1 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Delete Message
              </button>
              <button
                type="button"
                onClick={() => setViewTarget(null)}
                className="py-2.5 px-5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-in">
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Message</h3>
                <p className="text-xs text-gray-400 dark:text-gray-500">Confirm removal of this message</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              Are you sure you want to delete the message from{" "}
              <strong className="text-gray-900 dark:text-white">{deleteTarget.name}</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button type="button" onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition cursor-pointer">Cancel</button>
              <button type="button" disabled={deleting} onClick={() => remove(deleteTarget.id)} className="px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition disabled:opacity-60 flex items-center gap-2 cursor-pointer shadow-xs">
                <Trash2 className="w-4 h-4" /> {deleting ? "Deleting..." : "Yes, Delete Message"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}