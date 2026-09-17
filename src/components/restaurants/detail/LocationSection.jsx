import Icon from "../../ui/Icon";
import MapCard from "./MapCard";

// Location block: heading, interactive map, clickable address, parking + contacts.
export default function LocationSection({
  address,
  city = "Siem Reap",
  country = "Cambodia",
  lat,
  lng,
  name,
  phone,
  email,
  parking = [],
}) {
  const full = [address, city, country].filter(Boolean).join(", ");
  const mapsUrl =
    lat != null && lng != null
      ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${name || ""} ${full}`.trim())}`;

  return (
    <section id="location" aria-labelledby="location-heading" className="scroll-mt-28">
      <h2 id="location-heading" className="font-display text-2xl font-bold text-brand-900 sm:text-3xl">Location</h2>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_minmax(0,420px)]">
        <MapCard label={city} mapsUrl={mapsUrl} className="lg:h-full" />

        <div className="flex flex-col gap-5">
          {/* Address */}
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3">
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
              <Icon name="map-pin" size={18} />
            </span>
            <span className="flex-1">
              <span className="block text-[15px] leading-relaxed text-ink/85 underline decoration-brand-200 underline-offset-4 transition group-hover:text-brand-800 group-hover:decoration-brand-400">
                {full}
              </span>
            </span>
            <Icon name="chevron-right" size={18} className="mt-1 shrink-0 text-brand-500 transition group-hover:translate-x-0.5" />
          </a>

          {/* Parking */}
          {parking.length > 0 && (
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Icon name="car" size={18} />
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Parking</p>
                <p className="text-[15px] text-ink/85">{parking.join(", ")}</p>
              </div>
            </div>
          )}

          {/* Contacts */}
          {(phone || email) && (
            <div className="mt-auto flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-4">
              {phone && (
                <a href={`tel:${String(phone).replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-2 text-[15px] font-semibold text-brand-700 underline decoration-brand-200 underline-offset-4 transition hover:text-brand-900">
                  <Icon name="phone" size={16} /> {phone}
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} className="inline-flex items-center gap-2 text-[15px] font-semibold text-brand-700 underline decoration-brand-200 underline-offset-4 transition hover:text-brand-900">
                  <Icon name="mail" size={16} /> E-mail restaurant
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
