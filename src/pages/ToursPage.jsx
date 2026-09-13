import { useMemo, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import { SearchInput, Chips } from "../components/common/Toolbar";
import ListingCard from "../components/cards/ListingCard";
import { CardGridSkeleton, EmptyState, DemoNote } from "../components/ui/feedback";
import { useTours } from "../hooks/useResource";

export default function ToursPage() {
  const { items, loading, source } = useTours();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");

  const chipOptions = useMemo(() => {
    const names = [...new Set(items.map((t) => t.category).filter(Boolean))];
    return [{ id: "all", name: "All" }, ...names.map((n) => ({ id: n, name: n }))];
  }, [items]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return items.filter((t) => {
      const matchQ = !needle || [t.title, t.location, t.category, t.subtitle].join(" ").toLowerCase().includes(needle);
      const matchC = cat === "all" || (t.category || "") === cat;
      return matchQ && matchC;
    });
  }, [items, q, cat]);

  return (
    <>
      <PageHeader
        eyebrow="Tours"
        title="Explore Tours"
        subtitle="Temples, islands, nature and culture — find your next Cambodian adventure."
        crumbs={[{ label: "Home", to: "/" }, { label: "Tours" }]}
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput value={q} onChange={setQ} placeholder="Search tours, cities, experiences…" />
          <p className="text-sm font-medium text-muted">{loading ? "Loading…" : `${filtered.length} experience${filtered.length === 1 ? "" : "s"}`}</p>
        </div>
        <div className="mt-4"><Chips options={chipOptions} value={cat} onChange={setCat} /></div>

        {loading ? (
          <div className="mt-10"><CardGridSkeleton count={8} /></div>
        ) : filtered.length === 0 ? (
          <div className="mt-10"><EmptyState title="No tours found" message="Try a different search or category." /></div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((t) => <ListingCard key={t.id} item={t} />)}
          </div>
        )}
        {source === "demo" && !loading && <div className="mt-8"><DemoNote /></div>}
      </div>
    </>
  );
}
