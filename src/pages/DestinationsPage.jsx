import { useMemo, useState } from "react";
import PageHeader from "../components/common/PageHeader";
import { SearchInput } from "../components/common/Toolbar";
import DestinationCard from "../components/cards/DestinationCard";
import { CardGridSkeleton, EmptyState, DemoNote } from "../components/ui/feedback";
import { useDestinations } from "../hooks/useResource";

export default function DestinationsPage() {
  const { items, loading, source } = useDestinations();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((d) => d.title.toLowerCase().includes(needle));
  }, [items, q]);

  return (
    <>
      <PageHeader
        eyebrow="Destinations"
        title="Popular Destinations"
        subtitle="From the temples of Siem Reap to the islands of the south coast."
        crumbs={[{ label: "Home", to: "/" }, { label: "Destinations" }]}
      />
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput value={q} onChange={setQ} placeholder="Search destinations…" />
          <p className="text-sm font-medium text-muted">{loading ? "Loading…" : `${filtered.length} destination${filtered.length === 1 ? "" : "s"}`}</p>
        </div>

        {loading ? (
          <div className="mt-10"><CardGridSkeleton count={8} cols="grid-cols-2 lg:grid-cols-4" /></div>
        ) : filtered.length === 0 ? (
          <div className="mt-10"><EmptyState title="No destinations found" message="Try a different search." icon="map-pin" /></div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((d) => <DestinationCard key={d.id} item={d} />)}
          </div>
        )}
        {source === "demo" && !loading && <div className="mt-8"><DemoNote /></div>}
      </div>
    </>
  );
}
