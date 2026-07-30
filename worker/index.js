import { Hono } from "hono";
import { createD1Store } from "./store/d1.js";
import { RESOURCES, RESOURCE_KEYS } from "./resources.js";
import { sanitizeResourcePatch, ValidationError } from "./validators.js";

const app = new Hono();

function getEmail(c) {
  return (c.req.header("Cf-Access-Authenticated-User-Email") || "").toLowerCase().trim();
}

function isAdmin(c, email) {
  const allowlist = (c.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return Boolean(email) && allowlist.includes(email);
}

// HTTPS enforcement — nginx used to do this via X-Forwarded-Proto; the
// Worker sees the request's real scheme directly. Skipped for local dev
// (wrangler dev has no TLS listener, so every local request is http: —
// enforcing this locally would redirect-loop every request to a scheme
// nothing is listening on).
app.use("*", async (c, next) => {
  const url = new URL(c.req.url);
  const isLocalDev = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  if (!isLocalDev && url.protocol === "http:") {
    url.protocol = "https:";
    return c.redirect(url.toString(), 301);
  }
  await next();
});

// Security headers, replicating the old nginx config (config/nginx.conf.erb,
// removed in the Heroku cleanup) now that the Worker's static-asset serving
// doesn't set any of this on its own. Response objects from ASSETS.fetch()
// have immutable headers, so headers are applied to a fresh Response
// wrapping the same body/status.
//
// Cache-Control is NOT set here — Cloudflare's static-assets layer
// force-overwrites Cache-Control/ETag on asset-served responses regardless
// of what the Worker script sets afterward. Per-file-type cache rules live
// in src/_headers instead (the platform's documented mechanism for this,
// same convention as Cloudflare Pages).
app.use("*", async (c, next) => {
  await next();
  if (!c.res) return;

  const path = new URL(c.req.url).pathname;
  const res = new Response(c.res.body, c.res);
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "SAMEORIGIN");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  if (!path.startsWith("/api/")) {
    res.headers.append("Vary", "Accept-Encoding");
  }
  c.res = res;
});

app.use("*", async (c, next) => {
  const email = getEmail(c);
  c.set("email", email);
  c.set("admin", isAdmin(c, email));
  await next();
});

app.get("/api/version", (c) =>
  c.json({
    version: c.env.CF_VERSION_METADATA?.id || "dev",
    resources: RESOURCE_KEYS,
  })
);

app.get("/api/me", (c) =>
  c.json({ email: c.get("email") || null, admin: c.get("admin") })
);

const admin = new Hono();

admin.use("*", async (c, next) => {
  if (!c.get("admin")) {
    return c.json({ error: "Administrator authentication required." }, 401);
  }
  await next();
});

function store(c) {
  return createD1Store(c.env.DB);
}

admin.get("/:resource", async (c) => {
  const key = c.req.param("resource");
  if (!RESOURCES[key]) return c.json({ error: "Unknown resource" }, 404);
  const status = c.req.query("status") || undefined;
  const items = await store(c).list(key, { status });
  return c.json({ items });
});

admin.post("/:resource", async (c) => {
  const key = c.req.param("resource");
  const def = RESOURCES[key];
  if (!def) return c.json({ error: "Unknown resource" }, 404);
  try {
    const body = await c.req.json();
    const clean = sanitizeResourcePatch(def, body, { partial: false });
    const item = await store(c).create(key, clean);
    return c.json({ item }, 201);
  } catch (err) {
    if (err instanceof ValidationError) return c.json({ error: err.message }, 400);
    throw err;
  }
});

admin.get("/:resource/:id", async (c) => {
  const key = c.req.param("resource");
  if (!RESOURCES[key]) return c.json({ error: "Unknown resource" }, 404);
  const item = await store(c).get(key, c.req.param("id"));
  if (!item) return c.json({ error: "Not found" }, 404);
  return c.json({ item });
});

admin.patch("/:resource/:id", async (c) => {
  const key = c.req.param("resource");
  const def = RESOURCES[key];
  if (!def) return c.json({ error: "Unknown resource" }, 404);
  try {
    const body = await c.req.json();
    const clean = sanitizeResourcePatch(def, body, { partial: true });
    const item = await store(c).update(key, c.req.param("id"), clean);
    if (!item) return c.json({ error: "Not found" }, 404);
    return c.json({ item });
  } catch (err) {
    if (err instanceof ValidationError) return c.json({ error: err.message }, 400);
    throw err;
  }
});

admin.delete("/:resource/:id", async (c) => {
  const key = c.req.param("resource");
  if (!RESOURCES[key]) return c.json({ error: "Unknown resource" }, 404);
  await store(c).remove(key, c.req.param("id"));
  return c.json({ ok: true });
});

// Legacy URL — /links was the old homepage before the link-in-bio redesign.
// 301 so bookmarks/backlinks consolidate onto the canonical homepage.
app.get("/links", (c) => c.redirect("/", 301));

app.route("/api/admin", admin);

// Anything else: try the exact static asset. /admin/* deep-links fall back
// to the admin SPA shell so client-side routing can take over; everything
// else on the public site gets a real 404, not a silent redirect home.
app.notFound(async (c) => {
  const url = new URL(c.req.url);
  if (url.pathname.startsWith("/api/")) {
    return c.json({ error: "Not found" }, 404);
  }

  const direct = await c.env.ASSETS.fetch(c.req.raw);
  if (direct.status !== 404) return direct;

  if (url.pathname.startsWith("/admin")) {
    const fallbackUrl = new URL("/admin/index.html", url.origin);
    return c.env.ASSETS.fetch(new Request(fallbackUrl, c.req.raw));
  }

  return c.html(
    `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>404 Not Found</title></head>` +
      `<body><h1>404 Not Found</h1><p>The page you're looking for doesn't exist. <a href="/">Go home</a>.</p></body></html>`,
    404
  );
});

export default app;
