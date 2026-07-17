// Copies the static public site (src/) into dist/ alongside the built admin
// SPA (already emitted at dist/admin/ by vite build). Runs after `vite build`.
import { cpSync, existsSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = path.join(root, "src");
const dist = path.join(root, "dist");

if (!existsSync(dist)) mkdirSync(dist, { recursive: true });
cpSync(src, dist, { recursive: true });
console.log(`Copied ${src} -> ${dist}`);
