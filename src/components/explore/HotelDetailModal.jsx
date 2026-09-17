import { useState } from "react";
import { Modal } from "../ui/Modal";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import Rating from "../ui/Rating";
import { money } from "../../lib/format";

function nightsBetween(a, b) {
  if (!a || !b) return 1;
  const start = new Date(a);
  const end = new Date(b);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return 1;
  return Math.max(1, Math.round((end - start) / 86400000));
}

export default function HotelDetailModal({ hotel, open, onClose, onAdd }) {
  const rooms = hotel?.rooms || [];
  const [roomId, setRoomId] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const room = rooms.find((r) => String(r.id) === String(roomId)) || rooms[0];
  const nights = nightsBetween(checkIn, checkOut);
  const total = room ? (Number(room.price) || 0) * nights : 0;

  const handleAdd = () => {
    if (!hotel || !room) return;
    onAdd({
      key: `hotel-${hotel.id}-${room.id}`,
      kind: "hotel",
      id: hotel.id,
      title: hotel.title,
      image: hotel.image,
      location: hotel.location,
      province: hotel.province,
      price: Number(room.price) || 0,
      priceUnit: "/night",
      qty: nights,
      meta: { roomId: room.id, roomType: room.roomType, guests, checkIn, checkOut, nights },
    });
    onClose();
  };

  if (!hotel) return null;

  return (
    <Modal open={open} onClose={onClose} size="xl">
      <div className="relative overflow-hidden rounded-2xl border border-line">
        <SmartImage src={hotel.image} alt={hotel.title} className="aspect-[16/7] w-full" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-brand-700 backdrop-blur">
          {hotel.badge || "Hotel"}
        </span>
      </div>

      <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold text-brand-800">{hotel.title}</h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <Icon name="map-pin" size={15} className="text-brand-400" />
            {hotel.location || hotel.province || "Cambodia"}
          </p>
          {hotel.rating != null && <div className="mt-1.5"><Rating value={hotel.rating} size="sm" /></div>}
        </div>
        {hotel.price != null && (
          <div className="text-right">
            <p className="text-[11px] font-bold uppercase text-muted">From</p>
            <p className="font-display text-2xl font-bold text-brand-700">{money(hotel.price)}<span className="text-xs font-medium text-muted">/night</span></p>
          </div>
        )}
      </div>

      {hotel.description && <p className="mt-3 leading-relaxed text-muted">{hotel.description}</p>}

      <div className="mt-6">
        <h3 className="flex items-center gap-2 font-display text-lg font-bold text-brand-800">
          <Icon name="bed" size={19} className="text-brand-500" /> Select a room
        </h3>

        {rooms.length === 0 ? (
          <p className="mt-3 rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">
            Room rates are available when you enquire.
          </p>
        ) : (
          <div className="mt-3 space-y-2.5">
            {rooms.map((r) => {
              const selected = String(r.id) === String(roomId);
              const available = Number(r.total) > 0;
              return (
                <button
                  key={r.id}
                  type="button"
                  disabled={!available}
                  onClick={() => setRoomId(String(r.id))}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors duration-500 ease-out ${
                    selected ? "border-brand-600 bg-brand-50 ring-2 ring-brand-500/15" : "border-line bg-white hover:border-brand-300/60"
                  } ${!available ? "cursor-not-allowed opacity-50" : ""}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${selected ? "border-brand-600" : "border-line"}`}>
                      {selected && <span className="h-2.5 w-2.5 rounded-full bg-brand-600" />}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-brand-800">{r.roomType}</p>
                      <p className="text-xs text-muted">
                        {r.capacity ? `Sleeps ${r.capacity}` : "Sleeps guests"}
                        {r.total != null ? ` · ${r.total} available` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-brand-700">{money(r.price)}<span className="text-xs font-medium text-muted">/night</span></p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-6 rounded-2xl border border-gold-300 bg-gold-50 p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 flex items-center gap-1.5 text-xs font-bold text-brand-800"><Icon name="calendar" size={14} className="text-brand-500" /> Check-in</span>
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-brand-400" />
          </label>
          <label className="block">
            <span className="mb-1 flex items-center gap-1.5 text-xs font-bold text-brand-800"><Icon name="calendar" size={14} className="text-brand-500" /> Check-out</span>
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-brand-400" />
          </label>
          <label className="block">
            <span className="mb-1 flex items-center gap-1.5 text-xs font-bold text-brand-800"><Icon name="users" size={14} className="text-brand-500" /> Guests</span>
            <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none focus:border-brand-400">
              {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n} guest{n > 1 ? "s" : ""}</option>)}
            </select>
          </label>
          <div className="flex items-end justify-between rounded-xl border border-brand-100 bg-white px-3 py-2">
            <div>
              <p className="text-[11px] font-bold uppercase text-muted">Stay total</p>
              <p className="font-display text-lg font-bold text-brand-800">
                {room ? `${money(total)}` : "—"}
                <span className="text-xs font-medium text-muted"> · {nights} night{nights > 1 ? "s" : ""}</span>
              </p>
            </div>
            {room && <span className="text-xs font-medium text-muted">{room.roomType}</span>}
          </div>
        </div>

        <button
          type="button"
          disabled={!room}
          onClick={handleAdd}
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold-400 text-sm font-bold text-brand-900 transition-colors duration-500 ease-out hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name="plus" size={18} /> Add hotel to my trip{room ? ` · ${money(total)}` : ""}
        </button>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-medium text-gold-700">
          <span className="inline-flex items-center gap-1"><Icon name="check-circle" size={13} /> Best-price guarantee</span>
          {hotel.phone && <span className="inline-flex items-center gap-1"><Icon name="phone" size={12} /> {hotel.phone}</span>}
          {hotel.email && <span className="inline-flex items-center gap-1"><Icon name="mail" size={12} /> {hotel.email}</span>}
        </div>
      </div>
    </Modal>
  );
}