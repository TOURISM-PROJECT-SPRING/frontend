import { useEffect, useState, useMemo } from "react";
import { Search, Plus, Edit3, Trash2, Ticket, AlertCircle, CheckCircle, X, DollarSign, Calendar, Users } from "lucide-react";
import { ticketService } from "../../services/ticketService";
import { tourPlaceService } from "../../services/tourPlaceService";
import { formatPrice } from "../../utils/helpers";

export default function OwnerTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "15.00",
    tourismPlaceId: "",
    isAvailable: true,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ticketList, placeList] = await Promise.all([
        ticketService.getAllTickets().catch(() => []),
        tourPlaceService.getAllTourPlaces().catch(() => []),
      ]);
      setTickets(ticketList || []);
      setPlaces(placeList || []);
    } catch (e) {
      console.error("Error loading tickets:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      const name = t.name || "";
      const desc = t.description || "";
      const place = t.tourismPlaceName || "";
      return `${name} ${desc} ${place}`.toLowerCase().includes(search.toLowerCase());
    });
  }, [tickets, search]);

  const openCreateModal = () => {
    setEditItem(null);
    setErrorMessage("");
    setFormData({
      name: "",
      description: "",
      price: "15.00",
      tourismPlaceId: places[0]?.id ? String(places[0].id) : "",
      isAvailable: true,
    });
    setFormOpen(true);
  };

  const openEditModal = (t) => {
    setEditItem(t);
    setErrorMessage("");
    setFormData({
      name: t.name || "",
      description: t.description || "",
      price: t.price ? String(t.price) : "15.00",
      tourismPlaceId: t.tourismPlaceId ? String(t.tourismPlaceId) : places[0]?.id ? String(places[0].id) : "",
      isAvailable: t.isAvailable ?? true,
    });
    setFormOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Number(formData.price),
        tourismPlaceId: Number(formData.tourismPlaceId) || 1,
        isAvailable: formData.isAvailable,
      };

      if (!payload.name || !payload.price) {
        setErrorMessage("Please fill in ticket name and price.");
        setSubmitting(false);
        return;
      }

      if (editItem) {
        const updated = await ticketService.updateTicket(editItem.id, payload);
        setTickets((prev) => prev.map((t) => (t.id === editItem.id ? { ...t, ...payload, ...updated } : t)));
        setSuccessMessage("Ticket updated successfully!");
      } else {
        const created = await ticketService.createTicket(payload);
        setTickets((prev) => [created || { ...payload, id: Date.now() }, ...prev]);
        setSuccessMessage("New experience ticket created!");
      }

      setFormOpen(false);
      setEditItem(null);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error("Error saving ticket:", error);
      setErrorMessage(error.response?.data?.message || "Failed to save ticket.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await ticketService.deleteTicket(deleteTarget.id);
      setTickets((prev) => prev.filter((t) => t.id !== deleteTarget.id));
      setDeleteTarget(null);
      setSuccessMessage("Ticket deleted.");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (e) {
      console.error("Failed to delete ticket:", e);
      setErrorMessage("Failed to delete ticket.");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Tour Tickets
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">Experience Tickets & Pricing</h1>
          <p className="text-sm text-gray-400 dark:text-gray-500">Configure entrance passes, guided tour tickets, and admission rates</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Ticket
        </button>
      </div>

      {successMessage && (
        <div className="p-4 bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
          {errorMessage}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search tickets by name or attraction..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500 transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((t) => (
          <div key={t.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                {t.isAvailable ? "Available" : "Sold Out"}
              </span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {formatPrice(t.price || 0)}
              </span>
            </div>

            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{t.name}</h3>
            <p className="text-xs text-gray-400 mb-3">{t.tourismPlaceName || "Tourism Place"}</p>

            {t.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
                {t.description}
              </p>
            )}

            <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                onClick={() => openEditModal(t)}
                className="flex-1 py-1.5 px-3 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                onClick={() => setDeleteTarget(t)}
                className="p-1.5 text-red-500 bg-red-50 dark:bg-red-500/10 rounded-lg hover:bg-red-100 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
          <Ticket className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">No Tickets Found</h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">Add ticket passes for your tourism activities.</p>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add First Ticket
          </button>
        </div>
      )}

      {/* Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => !submitting && setFormOpen(false)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editItem ? "Edit Ticket" : "Add Ticket"}</h2>
              <button onClick={() => setFormOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Ticket Name *</label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g. 1-Day Temple Pass with Guide"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Attraction *</label>
                  <select
                    value={formData.tourismPlaceId}
                    onChange={(e) => setFormData({ ...formData, tourismPlaceId: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Select Place</option>
                    {places.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Price (USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition"
                >
                  {submitting ? "Saving..." : editItem ? "Save Changes" : "Create Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
