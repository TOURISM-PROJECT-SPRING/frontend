import { useState } from "react";
import { Modal } from "../ui/Modal";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import Rating from "../ui/Rating";
import GuideInfo, { GuideFallbackNote } from "./GuideInfo";
import { money } from "../../lib/format";

function Meter({ label, value, step }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-line bg-canvas px-3 py-2">
      <span className="text-xs font-bold text-muted">{label}</span>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => step(-1)} aria-label={`Decrease ${label}`} className="grid h-7 w-7 place-items-center rounded-lg border border-line text-brand-700 hover:bg-brand-50">
          <Icon name="minus" size={14} />
        </button>
        <span className="min-w-[2ch] text-center text-sm font-bold text-brand-800">{value}</span>
        <button type="button" onClick={() => step(1)} aria-label={`Increase ${label}`} className="grid h-7 w-7 place-items-center rounded-lg bg-brand-700 text-white hover:bg-brand-800">
          <Icon name="plus" size={14} />
        </button>
      </div>
    </div>
  );
}

export default function TourDetailModal({ tour, open, onClose, onAdd }) {
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("");
  const price = tour?.price != null ? money(tour.price) : null;
  const total = tour?.price != null ? tour.price * guests : 0;
  const gallery = tour?.images?.length ? tour.images : [tour?.image].filter(Boolean);

  const handleAdd = () => {
    if (!tour) return;
    onAdd({
      key: `tour-${tour.id}`,
      kind: "tour",
      id: tour.id,
      ticketId: tour.ticketId || null,
      title: tour.title,
      image: tour.image,
      location: tour.location,
      province: tour.province,
      price: tour.price,
      priceUnit: tour.priceUnit,
      qty: guests,
      meta: { date, guests },
    });
    onClose();
  };

  if (!tour) return null;

  return (
    <Modal open={open} onClose={onClose} size="xl">
      <div className="overflow-hidden rounded-t-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-6 text-white">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-300">
          {tour.category || "Tour"} {tour.status ? ` · ${tour.status}` : ""}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h2 className="flex-1 font-display text-2xl font-bold leading-tight">{tour.title}</h2>
          {tour.rating != null && <Rating value={tour.rating} light />}
        </div>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-white/80">
          <Icon name="map-pin" size={15} className="text-gold-300" />
          {tour.province || tour.address || tour.location || "Cambodia"}
          {tour.duration && (
            <span className="ml-1 inline-flex items-center gap-1">
              · <Icon name="clock" size={14} /> {tour.duration}
            </span>
          )}
        </p>
      </div>

      <div className="space-y-6">
        {gallery.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-line">
            <SmartImage src={gallery[0]} alt={tour.title} className="aspect-[16/8] w-full" />
          </div>
        )}

        {tour.description && (
          <div>
            <h3 className="font-display text-lg font-bold text-brand-800">About this experience</h3>
            <p className="mt-1.5 leading-relaxed text-muted">{tour.description}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {tour.duration && <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700"><Icon name="clock" size={13} /> {tour.duration}</span>}
          {tour.location && <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700"><Icon name="map-pin" size={13} /> {tour.location}</span>}
          {tour.address && <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-bold text-brand-700"><Icon name="compass" size={13} /> {tour.address}</span>}
        </div>

        {tour.itinerary?.length > 0 && (
          <div>
            <h3 className="font-display text-lg font-bold text-brand-800">Itinerary</h3>
            <ol className="mt-3 space-y-0">
              {tour.itinerary.map((step, i) => (
                <li key={i} className="relative flex gap-3 pb-5 pl-1 last:pb-0">
                  {i < tour.itinerary.length - 1 && <span className="absolute left-[15px] top-8 h-[calc(100%-2rem)] w-px bg-brand-200" />}
                  <span className="z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-700 font-display text-xs font-bold text-gold-400">
                    {i + 1}
                  </span>
                  <p className="pt-1 text-sm leading-relaxed text-muted">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {tour.includes?.length > 0 && (
          <div>
            <h3 className="font-display text-lg font-bold text-brand-800">What's included</h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {tour.includes.map((inc) => (
                <li key={inc} className="flex items-center gap-2 text-sm text-muted">
                  <Icon name="check" size={15} className="shrink-0 text-success" />
                  {inc}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3 className="font-display text-lg font-bold text-brand-800">Meet your guide</h3>
          <div className="mt-3">
            {tour.guide ? <GuideInfo guide={tour.guide} /> : <GuideFallbackNote />}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-gold-300 bg-gold-50 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wide text-gold-700">Trip total</p>
            <p className="font-display text-2xl font-bold text-brand-800">
              {price ? `${money(total)}` : "On request"}
              {price && <span className="text-xs font-medium text-muted"> for {guests} guest{guests > 1 ? "s" : ""}</span>}
            </p>
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-brand-800">
              <Icon name="calendar" size={15} className="text-brand-500" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs outline-none focus:border-brand-400"
              />
            </label>
            <div className="w-44">
              <Meter label="Guests" value={guests} step={(d) => setGuests((g) => Math.min(12, Math.max(1, g + d)))} />
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold-400 text-sm font-bold text-brand-900 transition-colors duration-500 ease-out hover:bg-gold-300"
        >
          <Icon name="plus" size={18} /> Add to my trip{price ? ` · ${money(total)}` : ""}
        </button>
        <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-gold-700">
          <Icon name="check-circle" size={13} /> Free cancellation up to 24h · Secure payment · Licensed local guides
        </p>
      </div>
    </Modal>
  );
}