// Generic D1-backed CRUD store, driven by the RESOURCES config
// (worker/resources.js). Mirrors sccgc-site's worker/store/d1.js shape
// (init() no-op, table creation lives in schema.sql) but replaces the
// bespoke per-table functions there with one config-driven implementation.

import { RESOURCES } from "../resources.js";

function nowIso() {
  return new Date().toISOString();
}

function rowToObject(row) {
  // D1 returns booleans as 0/1; leave as-is, client coerces to boolean where needed.
  return row;
}

export function createD1Store(db) {
  async function init() {}

  async function list(resourceKey, { status } = {}) {
    const def = RESOURCES[resourceKey];
    if (!def) throw new Error(`Unknown resource: ${resourceKey}`);
    let sql = `SELECT * FROM ${def.table}`;
    const binds = [];
    if (status && def.fields.status) {
      sql += ` WHERE status = ?`;
      binds.push(status);
    }
    sql += ` ORDER BY ${def.orderBy}`;
    const { results } = await db.prepare(sql).bind(...binds).all();
    return results.map(rowToObject);
  }

  async function get(resourceKey, id) {
    const def = RESOURCES[resourceKey];
    if (!def) throw new Error(`Unknown resource: ${resourceKey}`);
    const row = await db.prepare(`SELECT * FROM ${def.table} WHERE id = ?`).bind(id).first();
    return row ? rowToObject(row) : null;
  }

  async function create(resourceKey, data) {
    const def = RESOURCES[resourceKey];
    if (!def) throw new Error(`Unknown resource: ${resourceKey}`);
    const id = crypto.randomUUID();
    const ts = nowIso();
    const columns = ["id", ...Object.keys(def.fields), "created_at", "updated_at"];
    const values = [id, ...Object.keys(def.fields).map((k) => (data[k] === undefined ? null : data[k])), ts, ts];
    const placeholders = columns.map(() => "?").join(", ");
    await db
      .prepare(`INSERT INTO ${def.table} (${columns.join(", ")}) VALUES (${placeholders})`)
      .bind(...values)
      .run();
    return get(resourceKey, id);
  }

  async function update(resourceKey, id, patch) {
    const def = RESOURCES[resourceKey];
    if (!def) throw new Error(`Unknown resource: ${resourceKey}`);
    const keys = Object.keys(patch).filter((k) => k in def.fields);
    if (!keys.length) return get(resourceKey, id);
    const ts = nowIso();
    const setClause = [...keys.map((k) => `${k} = ?`), "updated_at = ?"].join(", ");
    const values = [...keys.map((k) => patch[k]), ts, id];
    await db.prepare(`UPDATE ${def.table} SET ${setClause} WHERE id = ?`).bind(...values).run();
    return get(resourceKey, id);
  }

  async function remove(resourceKey, id) {
    const def = RESOURCES[resourceKey];
    if (!def) throw new Error(`Unknown resource: ${resourceKey}`);
    await db.prepare(`DELETE FROM ${def.table} WHERE id = ?`).bind(id).run();
    return { ok: true };
  }

  return { init, list, get, create, update, remove };
}
