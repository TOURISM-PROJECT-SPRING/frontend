import Icon from "../../ui/Icon";
import MapCard from "./MapCard";

export default function LocationSection({ address, city, country = "Cambodia", email, lat, lng, name, rating, price }) {
  const full = [address, city, country].filter(Boolean).join(", ");
  const mapsUrl =
    lat != null && lng != null
      ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(full)}`;

  return (
    <section id="location" aria-labelledby="location-heading" className="scroll-mt-28">
      <h2 id="location-heading" className="font-display text-2xl font-bold text-brand-800 sm:text-3xl">Location</h2>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:gap-8">
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-2.5 text-[15px] text-ink/85">
          <Icon name="map-pin" size={18} className="mt-0.5 shrink-0 text-brand-600" />
          <span className="underline decoration-brand-200 underline-offset-4 transition group-hover:text-brand-800 group-hover:decoration-brand-400">{full}</span>
        </a>
        {email && (
          <a href={`mailto:${email}`} className="inline-flex items-center gap-2 text-[15px] font-semibold text-brand-700 underline decoration-brand-200 underline-offset-4 transition hover:text-brand-900 hover:decoration-brand-400">
            <Icon name="mail" size={16} />
            E-mail hotel
          </a>
        )}
      </div>

      <div className="mt-5">
        <MapCard name={name} rating={rating} price={price} />
      </div>
    </section>
  );
}
