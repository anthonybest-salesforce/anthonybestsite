# GA4 Tracking + SEO Enhancements — Design

**Date:** 2026-07-17
**Goal:** Add Google Analytics 4 tracking across the site, and fix/enhance SEO signals so anthonybest.com ranks as the top result when "Anthony Best" is searched.

## Context

The site is a static HTML site (no build step) served via nginx on Heroku, root `src/`. Five HTML pages exist: homepage (`src/index.html`), a stale duplicate `src/links/index.html`, `src/projects/index.html`, `src/projects/putter-advisory/index.html`, `src/projects/shaft-advisory/index.html`.

Current SEO state has one significant problem: the homepage's own `<link rel="canonical">`, `og:url`, and JSON-LD `WebPage.@id`/`url` all point to `/links` instead of `/`, and `src/links/index.html` is a near-duplicate of the homepage with stale content. This duplicate-content + self-referential-canonical-mismatch actively works against ranking for the site's own name.

No `robots.txt` exists. `sitemap.xml` only lists `/` and `/links`, missing the projects pages. The two advisory-deck pages have no meta description, canonical tag, Open Graph tags, or structured data at all.

Google Search Console is already verified via an existing DNS TXT record (`google-site-verification=...`), so no new verification step is needed — only a manual resubmission of the sitemap after this ships (see Follow-ups).

## 1. Google Analytics 4

- New file `src/assets/js/analytics.js` containing the `gtag.js` loader and config, with the Measurement ID `G-GH4TDQ277N` hardcoded once as the single source of truth.
- Each of the 4 surviving HTML pages (`index.html`, `projects/index.html`, `projects/putter-advisory/index.html`, `projects/shaft-advisory/index.html`) adds one line before `</head>`:
  ```html
  <script src="/assets/js/analytics.js"></script>
  ```
- No per-page duplication of the tracking snippet.

## 2. Fix `/links` duplicate content

- Delete `src/links/index.html` entirely — the homepage is the single canonical source for this content.
- Add a real server-side 301 in `config/nginx.conf.erb`:
  ```
  location = /links {
    return 301 /;
  }
  ```
  This preserves any existing inbound links/bookmarks to `/links` while sending both users and crawlers to the canonical URL.
- Fix the homepage (`src/index.html`):
  - `<link rel="canonical">` → `https://anthonybest.com/`
  - `<meta property="og:url">` → `https://anthonybest.com/`
  - JSON-LD `WebPage` block: `@id` and `url` → `https://anthonybest.com/`

## 3. `robots.txt` + `sitemap.xml`

- New `src/robots.txt`:
  ```
  User-agent: *
  Allow: /

  Sitemap: https://anthonybest.com/sitemap.xml
  ```
- Update `src/sitemap.xml`:
  - Remove the `/links` entry.
  - Add entries for `/projects`, `/projects/putter-advisory/`, `/projects/shaft-advisory/`.
  - Refresh `lastmod` to 2026-07-17 on all entries touched by this change.

## 4. Meta tags & structured data, site-wide

**Homepage (`src/index.html`):**
- Replace `og:image` (currently an external Squarespace CDN URL) with the self-hosted `https://anthonybest.com/assets/images/hero-bg.jpg`.
- Add Twitter Card meta tags: `twitter:card` (`summary_large_image`), `twitter:title`, `twitter:description`, `twitter:image`.

**Projects index (`src/projects/index.html`):**
- Add Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`).
- Add matching Twitter Card tags.
- Add a `WebPage` JSON-LD block whose `author`/`publisher` reference the existing `Person` entity (`@id: https://anthonybest.com/#person`) from the homepage — reinforcing one consistent identity across pages for Google's entity/Knowledge-Graph association.

**Putter advisory (`src/projects/putter-advisory/index.html`) and Shaft advisory (`src/projects/shaft-advisory/index.html`):**
Currently missing all of the following — add:
- `<meta name="description">`
- `<link rel="canonical">` (self-referencing, e.g. `https://anthonybest.com/projects/putter-advisory/`)
- Open Graph tags
- Twitter Card tags
- `WebPage` JSON-LD block referencing the same `Person` `@id` as above

All pages end up self-consistently canonical and cross-referencing one `Person` entity — the main lever for winning a branded-name search.

## Follow-ups (manual, outside this change)

- After deploy, resubmit `sitemap.xml` in Google Search Console and request re-indexing/removal for `/links` (GSC is already verified via existing DNS TXT record — no new verification needed).

## Out of scope

- Core Web Vitals / performance tuning.
- Breadcrumb structured data.
- Changing whether the advisory decks are indexable (they stay indexable, just gain proper metadata).
