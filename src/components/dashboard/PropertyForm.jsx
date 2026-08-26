import { X, Upload } from "lucide-react";

const propertyTypes = ["Resort", "Hotel", "Villa", "Lodge", "Beach House", "Hostel", "Apartment"];

const defaultForm = {
  name: "",
  type: "",
  location: "",
  description: "",
  rooms: "",
  weekdayPrice: "",
  weekendPrice: "",
  peakPrice: "",
  status: "Active",
};

export default function PropertyForm({ property, onSave, onClose }) {
  const isEdit = !!property;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...property, ...defaultForm, ...Object.fromEntries(new FormData(e.target)), id: property?.id || Date.now() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? "Edit Property" : "Add New Property"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 transition">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Property Name *</label>
            <input
              name="name"
              type="text"
              defaultValue={property?.name || ""}
              required
              placeholder="e.g. Green Park Resort"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
            />
          </div>

          {/* Type + Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Property Type *</label>
              <select
                name="type"
                defaultValue={property?.type || ""}
                required
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
              >
                <option value="">Select type</option>
                {propertyTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Location *</label>
              <input
                name="location"
                type="text"
                defaultValue={property?.location || ""}
                required
                placeholder="e.g. Siem Reap"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={property?.description || ""}
              placeholder="Describe your property..."
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition resize-none"
            />
          </div>

          {/* Rooms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Rooms *</label>
            <input
              name="rooms"
              type="number"
              min="1"
              defaultValue={property?.rooms || ""}
              required
              placeholder="Number of rooms"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
            />
          </div>

          {/* Pricing */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pricing (USD)</label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Weekday</label>
                <input
                  name="weekdayPrice"
                  type="number"
                  min="0"
                  defaultValue={property?.weekdayPrice || ""}
                  placeholder="$0"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Weekend</label>
                <input
                  name="weekendPrice"
                  type="number"
                  min="0"
                  defaultValue={property?.weekendPrice || ""}
                  placeholder="$0"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Peak</label>
                <input
                  name="peakPrice"
                  type="number"
                  min="0"
                  defaultValue={property?.peakPrice || ""}
                  placeholder="$0"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
                />
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Property Image</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-primary/40 transition cursor-pointer">
              <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-300 mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
            <select
              name="status"
              defaultValue={property?.status || "Active"}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-dark transition"
            >
              {isEdit ? "Save Changes" : "Create Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
