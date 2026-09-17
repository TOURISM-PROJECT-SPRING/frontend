import { useEffect, useState } from "react";
import { Search, Plus, Eye, Edit3, Trash2, Loader2 } from "lucide-react";
import { ticketService } from "../../services/ticketService";
import { tourPlaceService } from "../../services/tourPlaceService";
import { formatPrice, withTimeout } from "../../utils/helpers";
import { useToast } from "../../components/ui/Toast";

const availableColors = {
  Available: "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-400",
  "Sold Out": "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400",
};

const availLabel = (t) => (t.isAvailable ? "Available" : "Sold Out");

export default function AdminTicketsPage() {
  const toast = useToast();
  const [tickets, setTickets] = useState([]);
  const [tourPlaces, setTourPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ticketData, placeData] = await withTimeout(Promise.all([
          ticketService.getAllTickets(),
          tourPlaceService.getAllTourPlaces(),
        ]));
        setTickets(ticketData);
        setTourPlaces(placeData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setFetchError(true);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = tickets.filter((t) => {
    const name = t.name || "";
    const place = t.tourismPlaceName || "";
    const matchSearch = `${name} ${place}`.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || (filter === "Available" ? t.isAvailable === true : t.isAvailable === false);
    return matchSearch && matchFilter;
  });

  const handleSave = async (data) => {
    setSaving(true);
    try {
      const payload = {
        name: data.name,
        description: data.description || "",
        price: Number(data.price),
        tourismPlaceId: Number(data.tourismPlaceId),
        isAvailable: data.isAvailable === "true",
      };
      if (editItem) {
        const updated = await ticketService.updateTicket(editItem.id, payload);
        setTickets((prev) => prev.map((t) => (t.id === editItem.id ? updated : t)));
      } else {
        const created = await ticketService.createTicket(payload);
        setTickets((prev) => [created, ...prev]);
      }
      setFormOpen(false);
      setEditItem(null);
      toast.success(editItem ? "Ticket updated" : "Ticket created");
    } catch (error) {
      console.error("Error saving ticket:", error);
      toast.error("Failed to save ticket");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await ticketService.deleteTicket(deleteTarget.id);
      setTickets((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      setDeleteTarget(null);
      toast.success("Ticket deleted");
    } catch (error) {
      console.error("Error deleting ticket:", error);
      toast.error("Failed to delete ticket");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-sm text-gray-400">Loading tickets from server...</div>;
  }

  if (fetchError && tickets.length === 0) {
    return (
      <div className="p-12 text-center space-y-4">
        <p className="text-sm text-red-500">Could not load tickets from the server.</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tickets</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Manage ticket types for attractions and events</p>
        </div>
        <button
          onClick={() => { setEditItem(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition"
        >
          <Plus className="w-4 h-4" /> Add Ticket
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input type="text" placeholder="Search by name or place..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", "Available", "Sold Out"].map((s) => (
            <button key={s} onClick={() => setFilter(s)} className={`px-3 py-2 rounded-lg text-xs font-medium transition ${filter === s ? "bg-primary text-white" : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>{s}</button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Place</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Price</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Availability</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                  <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">{t.name}</td>
                  <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">{t.tourismPlaceName || "N/A"}</td>
                  <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">{formatPrice(t.price)}</td>
                  <td className="px-5 py-3.5"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${availableColors[availLabel(t)]}`}>{availLabel(t)}</span></td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button onClick={() => setViewTarget(t)} className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => { setEditItem(t); setFormOpen(true); }} className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-primary hover:bg-primary/5 transition"><Edit3 className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteTarget(t)} className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="text-center py-12 text-sm text-gray-400">No tickets found.</div>}
        </div>
      </div>

      {viewTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade" onClick={() => setViewTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scalein">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ticket Details</h3>
              <button onClick={() => setViewTarget(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-400">&times;</button>
            </div>
            <div className="mt-4 pb-4 border-b border-gray-100 dark:border-gray-800">
              <h4 className="text-base font-semibold text-gray-900 dark:text-white">{viewTarget.name}</h4>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">{viewTarget.tourismPlaceName || "N/A"}</p>
              <span className={`inline-block mt-2 px-2.5 py-1 rounded-full text-xs font-medium ${availableColors[availLabel(viewTarget)]}`}>{availLabel(viewTarget)}</span>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-400">Price</span><span className="font-medium text-gray-900 dark:text-white">{formatPrice(viewTarget.price)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-400">Description</span><span className="text-gray-600 dark:text-gray-300">{viewTarget.description || "N/A"}</span></div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setViewTarget(null); setEditItem(viewTarget); setFormOpen(true); }} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition"><Edit3 className="w-4 h-4" /> Edit</button>
              <button onClick={() => setViewTarget(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition">Close</button>
            </div>
          </div>
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade" onClick={() => { setFormOpen(false); setEditItem(null); }} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scalein">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editItem ? "Edit Ticket" : "Add Ticket"}</h2>
              <button onClick={() => { setFormOpen(false); setEditItem(null); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-gray-400">&times;</button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.target)); handleSave(d); }} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                <input name="name" required defaultValue={editItem?.name || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea name="description" rows={3} defaultValue={editItem?.description || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Place *</label>
                  <select name="tourismPlaceId" required defaultValue={editItem?.tourismPlaceId || ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                    <option value="">Select place</option>
                    {tourPlaces.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price ($) *</label>
                  <input name="price" type="number" min="0" step="0.01" required defaultValue={editItem?.price ?? ""} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Availability</label>
                <select name="isAvailable" defaultValue={editItem ? String(editItem.isAvailable) : "true"} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-primary transition">
                  <option value="true">Available</option>
                  <option value="false">Sold Out</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => { setFormOpen(false); setEditItem(null); }} className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition">Cancel</button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2">{saving && <Loader2 className="w-4 h-4 animate-spin" />}{editItem ? "Save Changes" : "Add Ticket"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade" onClick={() => setDeleteTarget(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center animate-scalein">
            <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto mb-4"><Trash2 className="w-6 h-6 text-red-500" /></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete Ticket</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This cannot be undone.</p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 transition">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 py-2.5 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">{deleting && <Loader2 className="w-4 h-4 animate-spin" />}Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}