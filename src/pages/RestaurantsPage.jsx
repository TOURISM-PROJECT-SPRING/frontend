import { useMemo, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import { SearchInput } from "../components/common/Toolbar";
import ListingCard from "../components/cards/ListingCard";
import { CardGridSkeleton, EmptyState, DemoNote } from "../components/ui/feedback";
import { useRestaurants } from "../hooks/useResource";

export default function RestaurantsPage() {
  const { items, loading, source } = useRestaurants();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((r) => [r.title, r.location, r.category].join(" ").toLowerCase().includes(needle));
  }, [items, q]);

  return (
    <>
      <PageHeader
        eyebrow="Restaurants"
        title="Taste Cambodia"
        subtitle="Authentic Khmer cuisine, seafood, BBQ and buzzing street food."
        crumbs={[{ label: "Home", to: "/" }, { label: "Restaurants" }]}
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput value={q} onChange={setQ} placeholder="Search restaurants or cuisines…" />
          <p className="text-sm font-medium text-muted">{loading ? "Loading…" : `${filtered.length} restaurant${filtered.length === 1 ? "" : "s"}`}</p>
        </div>

        {loading ? (
          <div className="mt-10"><CardGridSkeleton count={8} /></div>
        ) : filtered.length === 0 ? (
          <div className="mt-10"><EmptyState title="No restaurants found" message="Try a different search." icon="utensils" /></div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((r) => <ListingCard key={r.id} item={r} />)}
          </div>
        )}
        {source === "demo" && !loading && <div className="mt-8"><DemoNote /></div>}
      </div>
    </>
  );
}
