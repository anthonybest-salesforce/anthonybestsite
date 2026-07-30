# anthonybest.com

Personal site for Anthony Best — Youtuber, Musician, Collector.

## Stack

- **Host:** Cloudflare Worker (`anthonybest-cos`) — static assets + a Hono API, backed by D1. See [Chief of Staff admin portal](#chief-of-staff-admin-portal-added-2026-07-17) below for the full architecture. Heroku was the original host but is fully decommissioned — no app running there anymore.
- **Deploy:** `npm run deploy` (`wrangler deploy`), or push to `main` if Workers Builds push-to-deploy is connected (see the deploy checklist below)
- **Web root:** `src/` (unchanged public static site; copied into `dist/` at build time by `scripts/copy-public.mjs`)
- **Font:** [Syne](https://fonts.google.com/specimen/Syne) via Google Fonts

## Project structure

```
anthonybestsite/
├── wrangler.toml                 ← Cloudflare Worker config (D1 binding, assets, vars)
├── worker/                       ← Hono app: public routes + Access-gated /api/admin
├── admin/                        ← Vite + React + TypeScript SPA, served at /admin/*
├── README.md
├── SUMMARY.md                    ← Migration notes & DNS backup
├── src/                          ← Public static site (link-in-bio, guitar guides, etc.)
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
npx serve src/       # static site only
npm run dev           # Vite dev server for the admin SPA
npm run dev:worker    # wrangler dev, full Worker + D1 locally
```

Then open [http://localhost:3000](http://localhost:3000) (static) or the URL Vite/wrangler print.

To run the smoke-test suite locally against the real Worker (headers, redirects, 404 handling — not just static files) before pushing:

```bash
npm run build
npm run dev:worker &
BASE_URL=http://localhost:8787 python3 tests/test_site.py
```

See the note in `tests/test_site.py`'s docstring about the one test (`test_http_redirects_to_https`) that's expected to fail against `localhost`.

## Deploy

The site runs on a Cloudflare Worker, not Heroku. Deploy with:

```bash
npm run build    # vite build + copy src/ into dist/
npm run deploy   # wrangler deploy
```

If Cloudflare Workers Builds is connected to this GitHub repo (see the first-deploy checklist below), pushing to `main` triggers the same deploy automatically — open a PR, `gh pr merge --merge --delete-branch`, and Cloudflare ships it. Otherwise run `npm run deploy` manually after merging.

The `.github/workflows/deploy.yml` workflow runs a post-deploy smoke test against the live site after each push to `main` — diagnostic only, it does not gate merges or deploys.

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
`sccgc-site`). The public link-in-bio page (`src/index.html`) is unchanged
and still fully public. A gated `/admin` portal has been added for
personal daily-life management — SCC Greens Committee's site is a
*product* built on this same harness; this repo is the platform. The
`/projects/*` advisory decks that used to be public were removed (see the
`admin/public/` bullet below) — the homepage no longer links out to a
portfolio page.

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
- `admin/public/` — static files copied verbatim into `dist/admin/` by
  Vite's default public-dir handling, served through the same
  Access-gated `/admin/*` path with no route code needed. Currently holds
  `presentation-template/index.html`, a blank reference deck (one example
  of every slide type) for starting new advisory/analysis presentations —
  see [docs/presentation-template.md](docs/presentation-template.md). The
  two decks previously public at `/projects/*` (putter and shaft advisory)
  were removed since their content was no longer relevant; the reusable
  deck framework lives on here instead.
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
