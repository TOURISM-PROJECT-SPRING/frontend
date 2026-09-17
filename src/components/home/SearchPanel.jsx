import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Icon from "../ui/Icon";

function Field({ field, value = "", onChange }) {
  return (
    <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/15 dark:bg-card">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
        <Icon name={field.icon} size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-bold uppercase tracking-wide text-muted">
          {field.label}
        </span>
        <input
          type={field.type === "select" ? "text" : field.type}
          readOnly={field.type === "select"}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full bg-transparent text-sm font-semibold text-ink placeholder:font-medium placeholder:text-muted/70 focus:outline-none"
        />
      </span>
      {field.type === "select" && <Icon name="chevron-down" size={16} className="shrink-0 text-muted" />}
    </label>
  );
}

export default function SearchPanel() {
  const { t } = useTranslation();
  const [tab, setTab] = useState("Tour");
  const [values, setValues] = useState({ Tour: {}, Hotel: {}, Restaurant: {} });
  const navigate = useNavigate();

  const TABS = {
    Tour: {
      key: "Tour",
      tabName: t("search.tourTab") || "Tours",
      icon: "binoculars",
      title: t("search.tourTitle") || "Explore Tours",
      subtitle: t("search.tourSub") || "Discover destinations and experiences",
      fields: [
        { key: "tour", icon: "map-pin-house", label: t("search.destination") || "Destination", placeholder: t("search.destinationPlaceholder") || "e.g. Siem Reap", type: "text" },
        { key: "date", icon: "calendar", label: t("search.date") || "Date", placeholder: t("search.selectDate") || "Select date", type: "date" },
        { key: "guests", icon: "users", label: t("search.guests") || "Guests", placeholder: t("search.adultsGuest") || "2 Adults", type: "select" },
      ],
    },
    Hotel: {
      key: "Hotel",
      tabName: t("search.hotelTab") || "Hotels",
      icon: "bed",
      title: t("search.hotelTitle") || "Find Hotels",
      subtitle: t("search.hotelSub") || "Find your perfect stay",
      fields: [
        { key: "hotel", icon: "map-pin-house", label: t("search.destination") || "Destination", placeholder: t("search.locationPlaceholder") || "e.g. Phnom Penh", type: "text" },
        { key: "checkIn", icon: "calendar", label: t("search.checkIn") || "Check-in", placeholder: t("search.selectDate") || "Select date", type: "date" },
        { key: "checkOut", icon: "calendar", label: t("search.checkOut") || "Check-out", placeholder: t("search.selectDate") || "Select date", type: "date" },
        { key: "guests", icon: "users", label: t("search.guests") || "Guests", placeholder: t("search.adultsGuest") || "2 Adults", type: "select" },
      ],
    },
    Restaurant: {
      key: "Restaurant",
      tabName: t("search.restaurantTab") || "Restaurants",
      icon: "utensils",
      title: t("search.restaurantTitle") || "Find Restaurants",
      subtitle: t("search.restaurantSub") || "Discover local food",
      fields: [
        { key: "restaurant", icon: "map-pin", label: t("search.destination") || "Location", placeholder: t("search.destinationPlaceholder") || "e.g. Siem Reap", type: "text" },
        { key: "cuisine", icon: "utensils", label: t("search.cuisine") || "Cuisine", placeholder: "Khmer", type: "select" },
        { key: "time", icon: "clock", label: t("search.dateTime") || "Date / Time", placeholder: "Today, 7:00 PM", type: "text" },
        { key: "guests", icon: "users", label: t("search.guests") || "Guests", placeholder: t("search.restaurantGuest") || "2 Guests", type: "select" },
      ],
    },
  };

  const names = Object.keys(TABS);
  const activeTab = TABS[tab];
  const activeValues = values[tab];
  const setValue = (key) => (v) => setValues((prev) => ({ ...prev, [tab]: { ...prev[tab], [key]: v } }));

  const submit = () => {
    const params = new URLSearchParams();
    if (tab === "Tour") {
      params.set("section", "tours");
      if (activeValues.tour?.trim()) params.set("q", activeValues.tour.trim());
      navigate(`/tour?${params.toString()}`);
    } else if (tab === "Hotel") {
      params.set("section", "hotels");
      if (activeValues.hotel?.trim()) params.set("q", activeValues.hotel.trim());
      navigate(`/hotel?${params.toString()}`);
    } else {
      params.set("section", "restaurants");
      if (activeValues.restaurant?.trim()) params.set("q", activeValues.restaurant.trim());
      navigate(`/restaurant?${params.toString()}`);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-line bg-white/95 p-2.5 shadow-[0_24px_60px_-24px_rgba(2,70,46,0.45)] backdrop-blur-xl sm:p-3 dark:bg-card">
      {/* Tabs */}
      <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-canvas p-1.5">
        {names.map((n) => {
          const on = n === tab;
          return (
            <button
              key={n}
              onClick={() => setTab(n)}
              className={`relative flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold transition-all ${
                on
                  ? "bg-brand-700 text-white shadow-sm"
                  : "text-ink/60 hover:bg-white hover:text-brand-700 dark:hover:bg-brand-50/20"
              }`}
            >
              <Icon name={TABS[n].icon} size={17} className={on ? "text-gold-400" : ""} />
              <span>{TABS[n].tabName}</span>
              {on && <span className="absolute inset-x-6 -bottom-px h-0.5 rounded-full bg-gold-400" />}
            </button>
          );
        })}
      </div>

      {/* Title row */}
      <div className="flex items-center gap-2 px-2 pb-1 pt-3">
        <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
        <span className="text-sm font-bold text-brand-800 dark:text-brand-200">{activeTab.title}</span>
        <span className="hidden text-sm text-muted sm:inline">· {activeTab.subtitle}</span>
      </div>

      {/* Fields + search */}
      <div className="flex flex-col gap-2 p-1 lg:flex-row lg:items-stretch">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row">
          {activeTab.fields.map((f) => (
            <Field key={f.key} field={f} value={activeValues[f.key] || ""} onChange={setValue(f.key)} />
          ))}
        </div>
        <button
          onClick={submit}
          className="group flex items-center justify-center gap-2 rounded-xl bg-gold-400 px-7 py-3.5 text-sm font-bold text-brand-900 shadow-sm transition-all hover:bg-gold-300 hover:shadow-md lg:py-0"
        >
          <Icon name="search" size={18} />
          {t("search.searchBtn") || "Search"}
        </button>
      </div>
    </div>
  );
}