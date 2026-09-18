import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../ui/Icon";

const TABS = {
  Tour: {
    icon: "binoculars",
    title: "Explore Tours",
    subtitle: "Discover destinations and experiences",
    queryKeys: {
      q: "tour",
      date: "date",
      guests: "guests",
    },
  },
  Hotel: {
    icon: "bed",
    title: "Find Hotels",
    subtitle: "Find your perfect stay",
    queryKeys: {
      q: "hotel",
      checkIn: "checkIn",
      checkOut: "checkOut",
      guests: "guests",
    },
  },
  Restaurant: {
    icon: "utensils",
    title: "Find Restaurants",
    subtitle: "Discover local food",
    queryKeys: {
      q: "restaurant",
      cuisine: "cuisine",
      time: "time",
      guests: "guests",
    },
  },
};

const names = Object.keys(TABS);

function Field({ field, value, onChange }) {
  return (
    <label className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-500/15">
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
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm font-semibold text-ink placeholder:font-medium placeholder:text-muted/70 focus:outline-none"
        />
      </span>
      {field.type === "select" && <Icon name="chevron-down" size={16} className="shrink-0 text-muted" />}
    </label>
  );
}

const FIELD_DEFS = {
  Tour: [
    { key: "tour", icon: "map-pin-house", label: "Destination", placeholder: "e.g. Siem Reap", type: "text" },
    { key: "date", icon: "calendar", label: "Date", placeholder: "Select date", type: "date" },
    { key: "guests", icon: "users", label: "Guests", placeholder: "2 Adults", type: "select" },
  ],
  Hotel: [
    { key: "hotel", icon: "map-pin-house", label: "Destination", placeholder: "e.g. Phnom Penh", type: "text" },
    { key: "checkIn", icon: "calendar", label: "Check-in", placeholder: "Select date", type: "date" },
    { key: "checkOut", icon: "calendar", label: "Check-out", placeholder: "Select date", type: "date" },
    { key: "guests", icon: "users", label: "Guests", placeholder: "2 Adults", type: "select" },
  ],
  Restaurant: [
    { key: "restaurant", icon: "map-pin", label: "Location", placeholder: "e.g. Siem Reap", type: "text" },
    { key: "cuisine", icon: "utensils", label: "Cuisine", placeholder: "Khmer", type: "select" },
    { key: "time", icon: "clock", label: "Date / Time", placeholder: "Today, 7:00 PM", type: "text" },
    { key: "guests", icon: "users", label: "Guests", placeholder: "2 Guests", type: "select" },
  ],
};

export default function SearchPanel() {
  const [tab, setTab] = useState("Tour");
  const [values, setValues] = useState({ Tour: {}, Hotel: {}, Restaurant: {} });
  const navigate = useNavigate();
  const activeTab = TABS[tab];
  const activeValues = values[tab];
  const setValue = (key) => (v) => setValues((prev) => ({ ...prev, [tab]: { ...prev[tab], [key]: v } }));

  const submit = () => {
    const params = new URLSearchParams();
    params.set("section", tab.toLowerCase());
    if (tab === "Tour") {
      params.set("section", "tours");
    } else if (tab === "Hotel") {
      params.set("section", "hotels");
    } else {
      params.set("section", "restaurants");
    }
    const keys = FIELD_DEFS[tab];
    for (const f of keys) {
      if (activeValues[f.key]?.trim()) params.set(f.key, activeValues[f.key].trim());
    }
    navigate(`/explore?${params.toString()}`);
  };

  return (
    <div className="w-full rounded-2xl border border-line bg-white/95 p-2.5 shadow-[0_24px_60px_-24px_rgba(2,70,46,0.45)] backdrop-blur-xl sm:p-3">
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
                  : "text-ink/60 hover:bg-white hover:text-brand-700"
              }`}
            >
              <Icon name={TABS[n].icon} size={17} className={on ? "text-gold-400" : ""} />
              <span className="capitalize">{n}</span>
              {on && <span className="absolute inset-x-6 -bottom-px h-0.5 rounded-full bg-gold-400" />}
            </button>
          );
        })}
      </div>

      {/* Title row */}
      <div className="flex items-center gap-2 px-2 pb-1 pt-3">
        <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
        <span className="text-sm font-bold text-brand-800">{activeTab.title}</span>
        <span className="hidden text-sm text-muted sm:inline">· {activeTab.subtitle}</span>
      </div>

      {/* Fields + search */}
      <div className="flex flex-col gap-2 p-1 lg:flex-row lg:items-stretch">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row">
          {FIELD_DEFS[tab].map((f) => (
            <Field key={f.key} field={f} value={activeValues[f.key] || ""} onChange={setValue(f.key)} />
          ))}
        </div>
        <button
          onClick={submit}
          className="group flex items-center justify-center gap-2 rounded-xl bg-gold-400 px-7 py-3.5 text-sm font-bold text-brand-900 shadow-sm transition-all hover:bg-gold-300 hover:shadow-md lg:py-0"
        >
          <Icon name="search" size={18} />
          Search
        </button>
      </div>
    </div>
  );
}