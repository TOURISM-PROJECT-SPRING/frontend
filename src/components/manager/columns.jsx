import StatusBadge from "./StatusBadge";
import Icon from "../ui/Icon";
import SmartImage from "../ui/SmartImage";
import { money } from "../../lib/format";

// Convert entityMeta columns into DataTable columns with renderers.
export function buildColumns(metaColumns) {
  return metaColumns.map((c) => ({
    ...c,
    strong: c.strong || c.type === "strong",
    render: renderer(c),
  }));
}

export function searchKeys(metaColumns) {
  return metaColumns
    .filter((c) => !["status", "money", "image", "bool", "rating"].includes(c.type))
    .map((c) => c.key);
}

function renderer(col) {
  switch (col.type) {
    case "status":
      return (row) => <StatusBadge status={row[col.key]} />;
    case "money":
      return (row) => (row[col.key] == null || row[col.key] === "—" ? "—" : money(row[col.key]));
    case "rating":
      return (row) =>
        row[col.key] == null ? (
          <span className="text-muted">—</span>
        ) : (
          <span className="inline-flex items-center gap-1 font-semibold text-brand-800">
            <Icon name="star" size={13} className="text-gold-400" fill="currentColor" stroke="none" />
            {Number(row[col.key]).toFixed(1)}
          </span>
        );
    case "image":
      return (row) => <SmartImage src={row[col.key]} alt="" className="h-10 w-14 rounded-lg" />;
    case "bool":
      return (row) =>
        row[col.key] ? <Icon name="check" size={16} className="text-success" /> : <Icon name="x" size={16} className="text-muted" />;
    default:
      return undefined;
  }
}
