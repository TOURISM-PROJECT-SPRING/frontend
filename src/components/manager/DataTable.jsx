import { useMemo, useState } from "react";
import Icon from "../ui/Icon";
import { Skeleton } from "../ui/feedback";

export default function DataTable({
  columns = [],
  rows = [],
  loading = false,
  searchable = true,
  searchKeys = [],
  pageSize = 8,
  emptyLabel = "No records found",
  onView,
  toolbarRight,
}) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle || !searchKeys.length) return rows;
    return rows.filter((r) => searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(needle)));
  }, [rows, q, searchKeys]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pages - 1);
  const slice = filtered.slice(current * pageSize, current * pageSize + pageSize);

  return (
    <div className="rounded-2xl border border-line bg-white shadow-soft">
      {(searchable || toolbarRight) && (
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
          {searchable ? (
            <label className="flex h-10 items-center gap-2 rounded-xl border border-line bg-canvas px-3 focus-within:border-brand-400 focus-within:bg-white sm:max-w-xs">
              <Icon name="search" size={16} className="text-muted" />
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(0);
                }}
                placeholder="Search…"
                className="w-full bg-transparent text-sm focus:outline-none"
              />
            </label>
          ) : (
            <span />
          )}
          {toolbarRight}
        </div>
      )}

      {loading ? (
        <div className="space-y-2 p-4">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : filtered.length === 0 ? (
        <p className="px-4 py-12 text-center text-sm text-muted">{emptyLabel}</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                  {columns.map((c) => (
                    <th key={c.key} className={`px-4 py-3 font-bold ${c.align === "right" ? "text-right" : ""} ${c.nowrap ? "whitespace-nowrap" : ""}`}>
                      {c.label}
                    </th>
                  ))}
                  {onView && <th className="px-4 py-3" />}
                </tr>
              </thead>
              <tbody>
                {slice.map((row, i) => (
                  <tr key={row.id ?? i} className="border-b border-line/70 transition-colors last:border-0 hover:bg-canvas">
                    {columns.map((c) => (
                      <td key={c.key} className={`px-4 py-3 ${c.align === "right" ? "text-right" : ""} ${c.strong ? "font-semibold text-brand-800" : "text-ink/80"}`}>
                        {c.render ? c.render(row) : row[c.key]}
                      </td>
                    ))}
                    {onView && (
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onView(row)}
                          className="rounded-lg border border-line px-3 py-1.5 text-xs font-bold text-brand-700 transition-colors hover:bg-brand-50"
                        >
                          View
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 p-4 md:hidden">
            {slice.map((row, i) => (
              <div key={row.id ?? i} className="rounded-xl border border-line p-4">
                {columns.map((c) => (
                  <div key={c.key} className="flex items-center justify-between gap-3 py-1 text-sm">
                    <span className="text-muted">{c.label}</span>
                    <span className="text-right font-semibold text-brand-800">
                      {c.render ? c.render(row) : row[c.key]}
                    </span>
                  </div>
                ))}
                {onView && (
                  <button
                    onClick={() => onView(row)}
                    className="mt-2 w-full rounded-lg bg-brand-700 py-2 text-xs font-bold text-white"
                  >
                    View details
                  </button>
                )}
              </div>
            ))}
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-between border-t border-line p-4">
              <p className="text-xs text-muted">
                Page {current + 1} of {pages} · {filtered.length} records
              </p>
              <div className="flex gap-2">
                <button
                  disabled={current === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-line text-brand-700 disabled:opacity-40 hover:bg-brand-50"
                >
                  <Icon name="chevron-right" size={16} className="rotate-180" />
                </button>
                <button
                  disabled={current >= pages - 1}
                  onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-line text-brand-700 disabled:opacity-40 hover:bg-brand-50"
                >
                  <Icon name="chevron-right" size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
