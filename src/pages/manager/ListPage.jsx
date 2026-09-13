import { entityMeta } from "../../data/managerData";
import { useManager } from "../../hooks/useManager";
import DataTable from "../../components/manager/DataTable";
import { buildColumns, searchKeys } from "../../components/manager/columns";
import Icon from "../../components/ui/Icon";
import { DemoNote } from "../../components/ui/feedback";
import { useToast } from "../../components/ui/Toast";

export default function ListPage({ entity, title, subtitle }) {
  const meta = entityMeta(entity);
  const { items, loading, source } = useManager(entity);
  const toast = useToast();

  const columns = buildColumns(meta.columns);
  const keys = searchKeys(meta.columns);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-brand-800">{title || meta.title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle || `Manage ${meta.title.toLowerCase()}.`}</p>
        </div>
        <button
          onClick={() => toast.info("Demo action — connect to the API to create records.")}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-brand-800"
        >
          <Icon name="plus" size={17} /> Add {meta.title.replace(/s$/, "")}
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={items}
        loading={loading}
        searchKeys={keys}
        onView={(row) => toast.info(`View ${row.name || row.id || "record"} — demo.`)}
      />

      {source === "demo" && !loading && <DemoNote />}
    </div>
  );
}
