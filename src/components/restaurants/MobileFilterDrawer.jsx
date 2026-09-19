import { Drawer } from "../ui/Modal";
import RestaurantFilterSidebar from "./RestaurantFilterSidebar";

// Mobile version of the filter sidebar (slides in from the right).
export default function MobileFilterDrawer({ open, onClose, filters, onPatch, resultCount, provinces }) {
  return (
    <Drawer open={open} onClose={onClose} title="Filters" width="max-w-sm">
      <RestaurantFilterSidebar filters={filters} onPatch={onPatch} provinces={provinces} />
      <div className="sticky bottom-0 -mx-5 mt-4 border-t border-line bg-white px-5 py-3">
        <button
          type="button"
          onClick={onClose}
          className="h-11 w-full rounded-full bg-brand-700 text-sm font-bold text-white shadow-sm transition hover:bg-brand-800"
        >
          Show {resultCount.toLocaleString("en-US")} {resultCount === 1 ? "restaurant" : "restaurants"}
        </button>
      </div>
    </Drawer>
  );
}
