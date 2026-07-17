// Generic, config-driven sanitizer. Given a RESOURCES[key] definition and a
// raw JSON body, returns a clean object with only known fields, coerced to
// the right type, with enum/required checks applied. Throws ValidationError
// (with a user-facing message) on bad input.

export class ValidationError extends Error {}

function str(v) {
  if (v === undefined || v === null) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

function num(v) {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  if (Number.isNaN(n)) throw new ValidationError("Expected a number");
  return n;
}

function bool(v) {
  return v === true || v === 1 || v === "1" || v === "true" ? 1 : 0;
}

function isoDateLike(v, kind) {
  const s = str(v);
  if (!s) return null;
  // Accept anything Date can parse; store as given string (already ISO from <input type=date/datetime-local>).
  if (Number.isNaN(Date.parse(s))) {
    throw new ValidationError(`Invalid ${kind}: ${v}`);
  }
  return s;
}

export function sanitizeResourcePatch(resourceDef, body, { partial = false } = {}) {
  if (!body || typeof body !== "object") throw new ValidationError("Expected a JSON object body");
  const out = {};

  for (const [key, def] of Object.entries(resourceDef.fields)) {
    const present = Object.prototype.hasOwnProperty.call(body, key);
    if (!present) {
      if (!partial && def.required) {
        throw new ValidationError(`Missing required field: ${key}`);
      }
      if (!partial && "default" in def) {
        out[key] = def.type === "bool" ? bool(def.default) : def.default;
      }
      continue;
    }

    const raw = body[key];
    switch (def.type) {
      case "text": {
        const v = str(raw);
        if (def.required && !v) throw new ValidationError(`${key} is required`);
        out[key] = v;
        break;
      }
      case "number":
        out[key] = num(raw);
        break;
      case "bool":
        out[key] = bool(raw);
        break;
      case "date":
        out[key] = isoDateLike(raw, "date");
        break;
      case "datetime": {
        const v = isoDateLike(raw, "datetime");
        if (def.required && !v) throw new ValidationError(`${key} is required`);
        out[key] = v;
        break;
      }
      case "enum": {
        const v = str(raw);
        if (v && !def.values.includes(v)) {
          throw new ValidationError(`${key} must be one of: ${def.values.join(", ")}`);
        }
        out[key] = v || def.default || null;
        break;
      }
      default:
        out[key] = raw;
    }
  }

  return out;
}
