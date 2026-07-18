# Chief of Staff Harness — Migration Brief

Prepared 2026-07-17 for continued work in VS Code. Covers the original ask,
what exists today in both repos, and the gap to close if `sccgc-site`
becomes a product inside the `anthonybestsite` harness rather than a
separate deploy.

---

## 1. The original ask

Verbatim from Anthony:

> "I would like the council to vote on a few things as there are some
> overlaps. The SCC Greens site serves a specific purpose but the learnings
> and presentation formats should be shared with anthonybestsite as that
> will become my chief of staff app. The front end site deployed on
> anthonybest.com right now is just a vanity page with social links. We
> need an admin portal behind it that I can use for my daily life."

Clarified mid-conversation:

> "the SCC green site is basically one PRODUCT from the anthonybestsite"

Decisions made via follow-up questions:

- **Site relation:** shared scaffold — extract the Worker/D1/Access/admin
  pattern from `sccgc-site` into something reusable; `anthonybestsite` gets
  its own independent Worker, D1 database, and Access app built from it.
  (Note: at the time this meant "share the *pattern*," not necessarily "share
  the *repo*" — that question is what this brief is for.)
- **Portal scope:** Tasks & reminders, Calendar & schedule, Notes & journal,
  Contacts & relationships, Research & Presentations, Guitar Gear Inventory,
  Social Posting & YouTube Management.
- **Access model:** just Anthony, single admin email via Cloudflare Access.
- **Vanity page:** stays fully public; portal lives behind `/admin`.

What's been built so far satisfies the "shared pattern" reading: a generic,
config-driven Worker+D1+Access+CRUD scaffold now exists in `anthonybestsite`
(see §3). It has **not** been folded into `sccgc-site`, and `sccgc-site`
has **not** been moved into the `anthonybestsite` repo. Both currently run
as fully independent Cloudflare Workers with independent D1 databases,
independent Access applications, and independent GitHub repos.

---

## 2. Current state: `sccgc-site` (the existing product)

- **Repo:** `anthonylbest/sccgc-site`, working branch `feat/cloudflare-migration`
  — **2 commits ahead of `origin/main`, not merged.** `main` does not
  reflect what's live.
- **Live at:** `sccgreen.anthonybest.com` (Cloudflare Worker `sccgc-site`)
- **Frontend:** Vite + React + TypeScript, but a *purpose-built* site, not a
  generic shell — full presentation/slide deck system (`CoverSlide`,
  `ContentSlide`, `AppendixTableSlide`, `CloseSlide`), council meeting
  minutes, document viewer, Instagram embeds, theming, a custom
  `SequoyahSeal` brand component. This is real, specific product UI, not
  something a generic harness should try to abstract away.
- **Admin console:** hand-built, one component per domain —
  `AdminContent.tsx`, `AdminCouncil.tsx`, `AdminLinks.tsx`, `AdminSocial.tsx`,
  `AdminLayout.tsx` — **not** the generic `resources.js`-driven table/form
  pattern used in `anthonybestsite`. Each admin section has bespoke fields,
  validation, and layout.
- **Backend:** Hono Worker (`worker/index.js`) + D1 (`worker/store/d1.js`,
  `worker/validators.js`), migrated this session from an older
  Express + Postgres/JSON stack (`server.js`, `server/store/postgres.js`,
  `server/store/jsonFile.js` — now dead code post-migration, still in repo).
- **D1 schema** (`worker/schema.sql`): `content_overrides`, `links`,
  `council_reviews`, `social_sources`, `social_posts` — five
  purpose-specific tables, each with its own shape (e.g. `social_posts` has
  `permalink`/`hashtags`/`caption`/`post_date`; `council_reviews` has
  `document_label`/`markdown`/`review_date`). Nothing here maps cleanly
  onto the generic `{table, orderBy, fields}` config shape used in
  `anthonybestsite` without some rework.
- **Auth:** Cloudflare Access, **two-tier** — `sccgreen` app (Members
  policy, whole domain) + `sccgreen-admin` app (Admins policy,
  `sccgreen.anthonybest.com/admin*`). This is a different Access model than
  `anthonybestsite`, which only gates `/admin*` + `/api/*` and leaves
  everything else fully public (no "members" concept).
- **`reference/anthonybestsite-platform/`:** this directory already exists
  in the `sccgc-site` repo — `Procfile.example`, `deploy.yml.example`,
  `nginx.conf.erb.example`, `static.json.example`, `presentation-template.md`,
  `tests.example/`. These are copies of `anthonybestsite`'s *old Heroku-era*
  deployment scaffolding, pulled in as reference when `sccgc-site` was first
  built — i.e. the sharing relationship between these two projects already
  ran in the other direction once, informally, before this session.
- **Leftover Heroku-era files still in the repo:** `Procfile`, `server.js`,
  `server/`, `app.json`, `config/nginx.conf.erb`, `static.json` — all
  superseded by the Cloudflare Worker but not yet deleted.

---

## 3. Current state: `anthonybestsite` (the harness)

- **Repo:** `anthonylbest/anthonybestsite`, `main` branch, up to date with
  what's deployed.
- **Live at:** `anthonybest.com` + `www.anthonybest.com` (Cloudflare Worker
  `anthonybest-cos`); public vanity page at `src/`, portal at `/admin`.
  **Note:** this repo kept moving after this brief's research was done —
  a separate Claude Code session merged two more PRs same-day: PR #20 added
  GA4 tracking + SEO fixes to the homepage and deleted the unused
  `src/links/index.html`; PR #21 retired the public `/projects/*` advisory
  decks entirely (removed `putter-advisory`/`shaft-advisory`, dropped the
  footer link to them) and moved the reusable slide-deck template into
  `admin/public/presentation-template/`, served through the gated
  `/admin/*` path instead. So "public vanity page untouched" is no longer
  accurate — check `git log` before assuming this brief reflects the tip
  of `main`.
- **The reusable scaffold** (this is the part meant to generalize):
  - `worker/resources.js` — single config object, one entry per resource
    (`tasks`, `events`, `notes`, `contacts`, `research_items`, `gear_items`,
    `content_items`), each declaring `{table, orderBy, fields}` where
    `fields` types drive validation (`text`, `number`, `bool`, `date`,
    `datetime`, `enum`).
  - `worker/validators.js` — `sanitizeResourcePatch()`, generic across any
    resource defined in `resources.js`.
  - `worker/store/d1.js` — `createD1Store(db)`, generic CRUD
    (`list/get/create/update/remove`) driven entirely by the resource config,
    no per-domain code.
  - `worker/index.js` — one generic router,
    `/api/admin/:resource` + `/api/admin/:resource/:id`, gated by Access +
    an `ADMIN_EMAILS` allowlist check on `Cf-Access-Authenticated-User-Email`.
  - `admin/src/resources.ts` — client-side mirror of the same config, plus
    UI metadata (`label`, `plural`, `icon`, `columns`), driving one generic
    `ResourceTable` + `ResourceForm` pair for *all* seven sections. No
    per-domain React components exist on the admin side at all.
- **D1 schema** (`worker/schema.sql`): seven simple, mostly-generic tables
  (`tasks`, `events`, `notes`, `contacts`, `research_items`, `gear_items`,
  `content_items`) — deliberately shaped to fit the generic field-type
  system rather than any one domain's specific needs.
- **Auth:** Cloudflare Access, single-tier — one app (`anthonybest.com`)
  with four destinations (`anthonybest.com/admin*`, `anthonybest.com/api/*`,
  `www.anthonybest.com/admin*`, `www.anthonybest.com/api/*`), one "Admins"
  policy, one identity provider (Cloudflare's default one-time-PIN email
  login — no Google/SSO connected). Learned the hard way this session that
  *all* path prefixes the SPA calls (not just the page shell) must be listed
  as Access destinations, or the identity header never reaches those routes.
- **Not yet built:** a second password layer on top of Access was discussed
  and paused (password not yet provided). Gmail/Calendar/Contacts
  integration was raised but not scoped or started.

---

## 4. The actual gap: what "build it into the harness" would mean

Three real options, in increasing order of integration:

**A. Keep them fully separate** (status quo) — two repos, two Workers, two
D1s. Only the *pattern* is shared, by hand, via documentation. Lowest risk,
zero migration work, but `sccgc-site`'s admin console stays bespoke forever
and gets none of the generic scaffold's benefits (new resource = one config
object, not new components).

**B. Port `sccgc-site`'s admin console onto the generic scaffold, same
repo split.** Rewrite `sccgc-site`'s five domains (`content_overrides`,
`links`, `council_reviews`, `social_sources`, `social_posts`) as
`resources.js` config entries, swap `AdminContent`/`AdminCouncil`/etc. for
the generic `ResourceTable`/`ResourceForm`. Repos stay separate; only the
*code pattern* is literally copied over (probably as a small shared npm
package or just copy-pasted files, since there's no monorepo tooling in
place). Medium effort, no deployment/DNS risk, meaningfully reduces
`sccgc-site`'s admin code.

**C. True monorepo — fold `sccgc-site` into `anthonybestsite` as a
product.** Would mean deciding: one Worker serving both domains via routes,
or two Workers still deployed separately but built from one repo with
shared `worker/` library code? One D1 database with per-product tables, or
two databases still? This is the only option that matches "the SCC Greens
site is basically one PRODUCT from the anthonybestsite" literally, but it's
also the most disruptive — touches live DNS, live Access apps, and a
site with real non-generic UI (the slide deck system) that doesn't obviously
belong in a generic harness's `src/`.

This brief doesn't pick one — that's the call to make in VS Code with the
actual code in front of you. Worth noting: `sccgc-site`'s
`reference/anthonybestsite-platform/` directory suggests the *original*
direction of sharing was "copy anthonybestsite's deploy scaffolding into
sccgc-site," which is closer to option B's spirit than a hard monorepo merge.

---

## 5. Loose ends to clean up regardless of which option you pick

- `sccgc-site`'s `feat/cloudflare-migration` branch is unmerged (2 commits
  ahead of `main`) — merge or rebase before doing anything else in that repo.
- `sccgc-site` still carries dead Heroku-era files (`Procfile`, `server.js`,
  `server/`, `app.json`, `config/nginx.conf.erb`, `static.json`) that could
  be deleted now that the Worker is the live deployment.
- `anthonybestsite`'s README has a note pointing at this exact gap already
  (added same session, see "Chief of Staff admin portal" section) —
  worth reading alongside this brief.
