import { useMemo, useState } from "react";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import { money } from "../../lib/format";

function qtyOf(cart, id) {
  const hit = cart.find((i) => String(i.id) === String(id));
  return hit ? hit.qty : 0;
}

function DishCard({ food, qty, onAdd, onSetQty }) {
  const soldOut = food.available === false;
  return (
    <div
      className={`flex gap-3.5 rounded-2xl border p-3 transition-[transform,box-shadow] duration-300 ease-out ${
        soldOut ? "border-line bg-canvas/60" : "border-line bg-white hover:-translate-y-0.5 hover:shadow-soft"
      }`}
    >
      <SmartImage
        src={food.image}
        alt={food.title}
        className="h-24 w-24 shrink-0 rounded-xl"
        imgClassName={soldOut ? "opacity-60 grayscale" : ""}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <h3 className="min-w-0 font-display text-[15px] font-bold leading-snug text-brand-800">{food.title}</h3>
          <span className="shrink-0 text-sm font-bold text-brand-700">{money(food.price) ?? "—"}</span>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          {food.category && (
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-bold text-brand-600">{food.category}</span>
          )}
          {soldOut && (
            <span className="rounded-full bg-danger/10 px-2 py-0.5 text-[11px] font-bold text-danger">Sold out</span>
          )}
        </div>
        <div className="mt-auto flex justify-end pt-3">
          {soldOut ? (
            <span className="text-xs font-bold text-muted">Unavailable</span>
          ) : qty > 0 ? (
            <div className="inline-flex items-center gap-1 rounded-xl border border-brand-200 bg-brand-50 p-1">
              <button
                type="button"
                aria-label={`Remove one ${food.title}`}
                onClick={() => onSetQty(food.id, qty - 1)}
                className="grid h-8 w-8 place-items-center rounded-lg text-brand-700 transition-colors hover:bg-white"
              >
                <Icon name="minus" size={15} />
              </button>
              <span className="min-w-[2ch] text-center text-sm font-bold text-brand-800">{qty}</span>
              <button
                type="button"
                aria-label={`Add one ${food.title}`}
                onClick={() => onSetQty(food.id, qty + 1)}
                className="grid h-8 w-8 place-items-center rounded-lg bg-brand-700 text-white transition-colors hover:bg-brand-800"
              >
                <Icon name="plus" size={15} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onAdd(food)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-brand-200 bg-white px-3.5 py-2 text-xs font-bold text-brand-700 transition-colors hover:bg-brand-50"
            >
              <Icon name="plus" size={14} /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Dining menu for a restaurant detail page. Foods are grouped by category and
// feed the page-level cart (add / quantity handled by the parent).
export default function DiningMenu({ menu = [], cart = [], cartCount = 0, onAdd, onSetQty, onOpenCart }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(menu.map((f) => f.category).filter(Boolean)))],
    [menu]
  );
  const [cat, setCat] = useState("All");
  const visible = cat === "All" ? menu : menu.filter((f) => f.category === cat);

  if (!menu.length) return null;

  return (
    <section id="menu" className="scroll-mt-24 rounded-2xl border border-line bg-white p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-brand-800">Menu</h2>
          <p className="mt-1 text-sm text-muted">
            {menu.length} {menu.length === 1 ? "dish" : "dishes"} · order online for pickup
          </p>
        </div>
        {cartCount > 0 && (
          <button
            type="button"
            onClick={onOpenCart}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-800"
          >
            <Icon name="shopping-cart" size={16} />
            View order
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold-400 px-1 text-[11px] font-black text-brand-950">
              {cartCount}
            </span>
          </button>
        )}
      </div>

      {categories.length > 1 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                cat === c ? "bg-brand-700 text-white" : "bg-canvas text-brand-700 hover:bg-brand-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {visible.map((food) => (
          <DishCard
            key={food.id}
            food={food}
            qty={qtyOf(cart, food.id)}
            onAdd={onAdd}
            onSetQty={onSetQty}
          />
        ))}
      </div>
    </section>
  );
}
