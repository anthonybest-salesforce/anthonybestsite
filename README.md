# anthonybest.com

Personal site for Anthony Best — Youtuber, Musician, Collector.

## Stack

- **Host:** Heroku (static buildpack via `bin/start-nginx-static`)
- **Deploy:** Push to `main` → auto-deploys to Heroku
- **Web root:** `src/` (configured in `static.json`)
- **Font:** [Syne](https://fonts.google.com/specimen/Syne) via Google Fonts

## Project structure

```
anthonybestsite/
├── Procfile                      ← Heroku: web: bin/start-nginx-static
├── static.json                   ← Heroku static buildpack config (root: src/)
├── README.md
├── SUMMARY.md                    ← Migration notes & DNS backup
├── src/                          ← Deployed web root
│   ├── index.html                ← Link-in-bio page (homepage)
│   ├── ALB_Logo_White_Transparent.png
│   └── assets/
│       ├── images/
│       │   ├── favicon.ico
│       │   ├── home-main.jpg
│       │   └── logo.png
│       ├── css/
│       ├── js/
│       └── fonts/
├── docs/
│   └── dns-backup.md             ← Full DNS record backup (critical — preserves email)
└── clone/                        ← Squarespace site snapshot (reference only)
```

## Local development

```bash
npx serve src/
```

Then open [http://localhost:3000](http://localhost:3000).

## Deploy

The Heroku app is configured to auto-deploy from GitHub on every push to `main`. Open a PR, merge to `main`, and Heroku ships it automatically — no GitHub Action is involved in the deploy itself.

```bash
git push origin main          # only if working directly on main (use a PR normally)
gh pr merge --merge --delete-branch   # standard merge-to-main flow
```

The `.github/workflows/deploy.yml` workflow runs a post-deploy smoke test after each push — it polls the live URL with a content-hash compare against the source file, and only runs the test suite once the deploy has actually landed. Heroku does not gate on the smoke test; it's purely diagnostic.

## Social links (on the homepage)

| Platform  | URL |
|-----------|-----|
| Instagram | https://instagram.com/itsanthonybest |
| LinkedIn  | https://linkedin.com/in/anthonylbest |
| YouTube   | https://youtube.com/c/anthonybestmusic |

## DNS

Full DNS record backup (including Google Workspace MX, DKIM, SPF, DMARC, and Salesforce records) is in [`docs/dns-backup.md`](docs/dns-backup.md). **Do not delete any of those records** — they keep Google Workspace email working.

## Chief of Staff admin portal (added 2026-07-17)

`anthonybest.com` now runs on a Cloudflare Worker (not Heroku — the Heroku
section above is historical; DNS has pointed `anthonybest.com`/`www` at a
Cloudflare Pages project for a while, and this migration moves it one step
further onto the Worker + D1 + Access harness first built for
`sccgc-site`). The public link-in-bio page and `/projects/*` decks are
unchanged and still fully public. A gated `/admin` portal has been added
for personal daily-life management — SCC Greens Committee's site is a
*product* built on this same harness; this repo is the platform.

### Architecture

- `worker/index.js` — Hono app. Public routes (`/api/version`, `/api/me`)
  plus a generic `/api/admin/:resource` CRUD API, gated by Cloudflare
  Access (`Cf-Access-Authenticated-User-Email` header) + an `ADMIN_EMAILS`
  allowlist, same pattern as sccgc-site.
- `worker/resources.js` — **the reusable scaffold.** Each admin-portal
  domain (tasks, events, notes, contacts, research items, guitar gear,
  social/YouTube content) is one config entry: table name, sort order,
  field types/validation. Adding a new domain is one entry here + one
  table in `schema.sql` — no bespoke route code. This generic pattern is
  worth back-porting into sccgc-site's admin console (currently bespoke
  per-resource routes) next time that project needs a new admin section.
- `worker/validators.js` — generic, config-driven sanitizer built off the
  same field definitions.
- `worker/store/d1.js` — generic D1 CRUD store, also config-driven.
- `worker/schema.sql` — one table per resource in `resources.js`.
- `admin/` — Vite + React + TypeScript SPA, built to `dist/admin/` and
  served by the Worker at `/admin/*`. Mirrors `resources.js` client-side
  (`admin/src/resources.ts`) to drive a single generic `ResourceTable` +
  `ResourceForm` pair instead of one UI per domain.
- `src/` — unchanged public static site, copied into `dist/` alongside the
  built admin app by `scripts/copy-public.mjs`.

### First-deploy checklist

1. `npx wrangler d1 create anthonybestsite-db`, then paste the returned
   `database_id` into `wrangler.toml`.
2. `npm run db:migrate` (remote) / `npm run db:migrate:local` (local dev).
3. Cloudflare dashboard → Zero Trust → Access → create a self-hosted
   application with **two destinations** on the same policy: `anthonybest.com/admin*`
   (the SPA shell) **and** `anthonybest.com/api/*` (the CRUD + `/api/me`
   endpoints the SPA calls). Policy allows only the admin email(s). Gotcha
   learned the hard way: Access only injects the
   `Cf-Access-Authenticated-User-Email` header on requests matching one of
   the app's configured destinations. Gating `/admin*` alone lets the SPA
   shell load past Access fine, but every fetch it makes to `/api/...`
   sails through ungated with no identity header, so the app-level admin
   check always sees `email: null` and shows "access restricted" even for
   the real admin. Both path prefixes must be added as destinations on the
   same app (up to 5 destinations are allowed per self-hosted app). The
   public site and `/projects/*` stay ungated since neither path is
   covered.
4. Set `ADMIN_EMAILS` (Worker → Settings → Variables, or `[vars]` in
   `wrangler.toml`) to the real admin email list.
5. Connect the Worker to this GitHub repo (Workers Builds) for
   push-to-deploy, same as sccgc-site.
6. **DNS cutover (done 2026-07-17):** `anthonybest.com` and `www` used to
   CNAME to `anthonybestsite.pages.dev`. To cut over, the old CNAME records
   were deleted and Cloudflare's Worker "Custom Domains" feature was used
   to attach both hostnames directly to the Worker (Workers & Pages →
   anthonybest-cos → Domains → Add Domain) — this is safer than hand-editing
   a CNAME because it only touches the one record it creates. The Google
   Workspace MX/TXT (SPF/DKIM/DMARC) records and the `mcdo`/Salesforce
   records were left untouched throughout. Verified live end-to-end after
   cutover: public site, Access-gated `/admin` SPA, and a full D1
   create/read/delete round trip through `/api/admin/tasks`.
