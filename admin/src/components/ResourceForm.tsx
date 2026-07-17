import { useState } from "react";
import type { ResourceDef } from "../resources";

interface Props {
  resource: ResourceDef;
  initial?: Record<string, unknown>;
  onCancel: () => void;
  onSave: (data: Record<string, unknown>) => Promise<void>;
}

export default function ResourceForm({ resource, initial, onCancel, onSave }: Props) {
  const [values, setValues] = useState<Record<string, unknown>>(() => ({ ...(initial || {}) }));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField(key: string, value: unknown) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSave(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onCancel()}>
      <div className="modal">
        <h3 style={{ marginTop: 0 }}>
          {initial ? `Edit ${resource.label}` : `New ${resource.label}`}
        </h3>
        <form onSubmit={handleSubmit}>
          {Object.entries(resource.fields).map(([key, def]) => {
            const value = values[key];
            if (def.type === "bool") {
              return (
                <div className="field checkbox" key={key}>
                  <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(e) => setField(key, e.target.checked)}
                  />
                  <label>{def.label}</label>
                </div>
              );
            }
            if (def.type === "enum") {
              return (
                <div className="field" key={key}>
                  <label>{def.label}</label>
                  <select value={(value as string) || ""} onChange={(e) => setField(key, e.target.value)}>
                    <option value="">—</option>
                    {def.values?.map((v) => (
                      <option value={v} key={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }
            if (def.type === "textarea") {
              return (
                <div className="field" key={key}>
                  <label>
                    {def.label}
                    {def.required ? " *" : ""}
                  </label>
                  <textarea
                    value={(value as string) || ""}
                    required={def.required}
                    onChange={(e) => setField(key, e.target.value)}
                  />
                </div>
              );
            }
            const inputType = def.type === "datetime" ? "datetime-local" : def.type === "date" ? "date" : def.type === "number" ? "number" : "text";
            return (
              <div className="field" key={key}>
                <label>
                  {def.label}
                  {def.required ? " *" : ""}
                </label>
                <input
                  type={inputType}
                  value={(value as string | number) ?? ""}
                  required={def.required}
                  onChange={(e) => setField(key, inputType === "number" ? e.target.valueAsNumber : e.target.value)}
                />
              </div>
            );
          })}

          {error && <p style={{ color: "var(--orange)", fontSize: 13 }}>{error}</p>}

          <div className="modal-actions">
            <button type="button" className="btn secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn" disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
