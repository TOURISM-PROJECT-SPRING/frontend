import { Link } from "react-router-dom";
import Icon from "../ui/Icon";
import InfoCard from "./InfoCard";
import { thingsToDo } from "../../data/cambodia";

export default function ThingsToDoSection({ category = "Essentials" }) {
  const items =
    category === "Essentials"
      ? thingsToDo
      : thingsToDo.filter((t) => t.tags?.includes(category));

  return (
    <section id="things-to-do">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-brand-800 sm:text-3xl">
              Things to do
            </h2>
            {category !== "Essentials" && (
              <p className="mt-1 text-sm text-muted">Showing picks for "{category}"</p>
            )}
          </div>
          <Link to="/explore?section=tours" className="group inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-800">
            See all
            <Icon name="arrow-right" size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        <div key={category} className="grid gap-5 animate-fade sm:grid-cols-2 lg:grid-cols-3">
          {items.length > 0 ? (
            items.map((t) => <InfoCard key={t.id} item={t} kind="tour" fill />)
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-line bg-white/60 p-10 text-center text-sm text-muted">
              Nothing here yet for "{category}" — new picks are on the way.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}