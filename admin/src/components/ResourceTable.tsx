import { useEffect, useState } from "react";
import { createItem, deleteItem, listItems, updateItem } from "../api";
import type { ResourceDef } from "../resources";
import ResourceForm from "./ResourceForm";

interface Props {
  resource: ResourceDef;
}

type Item = Record<string, unknown> & { id: string };

function formatCell(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "number" && Number.isFinite(value)) {
    return value.toLocaleString();
  }
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) {
      return value.includes("T") ? d.toLocaleString() : d.toLocaleDateString();
    }
  }
  if (value === 1 || value === 0) return value ? "Yes" : "No";
  return String(value);
}

export default function ResourceTable({ resource }: Props) {
  const [items, setItems] = useState<Item[] | null>(null);
  const [editing, setEditing] = useState<Item | null | "new">(null);
  const [err, setErr] = useState<string | null>(null);

  async function refresh() {
    try {
      const rows = await listItems(resource.key);
      setItems(rows);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to load");
    }
  }

  useEffect(() => {
    setItems(null);
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource.key]);

  async function handleSave(data: Record<string, unknown>) {
    if (editing === "new") {
      await createItem(resource.key, data);
    } else if (editing) {
      await updateItem(resource.key, editing.id, data);
    }
    setEditing(null);
    await refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this item? This cannot be undone.")) return;
    await deleteItem(resource.key, id);
    await refresh();
  }

  return (
    <div>
      <div className="topbar">
        <div>
          <div className="eyebrow">Chief of Staff</div>
          <h1 className="page-title">{resource.plural}</h1>
        </div>
        <button className="btn" onClick={() => setEditing("new")}>
          + New {resource.label}
        </button>
      </div>

      {err && <p style={{ color: "var(--orange)" }}>{err}</p>}

      {items === null && <p style={{ color: "var(--muted)" }}>Loading…</p>}

      {items && items.length === 0 && (
        <div className="empty">No {resource.plural.toLowerCase()} yet. Add your first one.</div>
      )}

      {items && items.length > 0 && (
        <table>
          <thead>
            <tr>
              {resource.columns.map((c) => (
                <th key={c}>{resource.fields[c]?.label || c}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                {resource.columns.map((c) => (
                  <td key={c}>
                    {c === resource.columns[0] ? (
                      <strong>{formatCell(item[c])}</strong>
                    ) : resource.fields[c]?.type === "enum" ? (
                      <span className="pill">{formatCell(item[c])}</span>
                    ) : (
                      formatCell(item[c])
                    )}
                  </td>
                ))}
                <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                  <button className="btn secondary" style={{ marginRight: 8 }} onClick={() => setEditing(item)}>
                    Edit
                  </button>
                  <button className="btn danger" onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editing && (
        <ResourceForm
          resource={resource}
          initial={editing === "new" ? undefined : editing}
          onCancel={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
