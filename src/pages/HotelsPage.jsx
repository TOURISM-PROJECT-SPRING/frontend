import { useMemo, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import { SearchInput } from "../components/common/Toolbar";
import ListingCard from "../components/cards/ListingCard";
import { CardGridSkeleton, EmptyState, DemoNote } from "../components/ui/feedback";
import { useHotels } from "../hooks/useResource";

export default function HotelsPage() {
  const { items, loading, source } = useHotels();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((h) => [h.title, h.location].join(" ").toLowerCase().includes(needle));
  }, [items, q]);

  return (
    <>
      <PageHeader
        eyebrow="Hotels"
        title="Find Your Stay"
        subtitle="Comfortable hotels and beautiful places to stay across Cambodia."
        crumbs={[{ label: "Home", to: "/" }, { label: "Hotels" }]}
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput value={q} onChange={setQ} placeholder="Search hotels or cities…" />
          <p className="text-sm font-medium text-muted">{loading ? "Loading…" : `${filtered.length} stay${filtered.length === 1 ? "" : "s"}`}</p>
        </div>

        {loading ? (
          <div className="mt-10"><CardGridSkeleton count={8} /></div>
        ) : filtered.length === 0 ? (
          <div className="mt-10"><EmptyState title="No hotels found" message="Try a different location." icon="bed" /></div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((h) => <ListingCard key={h.id} item={h} />)}
          </div>
        )}
        {source === "demo" && !loading && <div className="mt-8"><DemoNote /></div>}
      </div>
    </>
  );
}
