import { useEffect, useState } from "react";
import { Search, CheckCheck, Trash2 } from "lucide-react";
import { contactService } from "../../services/contactService";

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
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [readFilter, setReadFilter] = useState("All");

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
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const remove = async (id) => {
    try {
      await contactService.deleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Error deleting message:", error);
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

  if (loading) {
    return <div className="p-12 text-center text-sm text-gray-400">Loading contact messages from server...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Messages</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Messages sent from the contact form</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Search by name, email, subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition"
          />
        </div>
        <div className="flex gap-2">
          {["All", "Unread", "Read"].map((s) => (
            <button
              key={s}
              onClick={() => setReadFilter(s)}
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
              {filtered.map((m) => (
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
                        onClick={() => {
                          if (window.confirm("Delete this contact message?")) remove(m.id);
                        }}
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
      </div>
    </div>
  );
}